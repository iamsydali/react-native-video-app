import React from 'react';
import {
  PanResponder,
  Animated,
  Dimensions,
  StyleSheet,
  Platform,
  PanResponderGestureState,
} from 'react-native';

interface Props {
  children: any;
  loop?: boolean;
  customHeight?: number;
  customWidth?: number;
  callBackAfterSwipe?: ({
    direction,
    index,
  }: {
    direction: string;
    index: number;
  }) => void;
}
interface State {
  isVerticalSwipe: boolean;
}

const {width: screenW, height: screenH} = Dimensions.get('window');
const height = screenH * 0.8;
const width = screenW;

const PERSPECTIVE = Platform.OS === 'ios' ? 2.38 : 1.95;
const TR_POSITION = Platform.OS === 'ios' ? 2 : 1.5;

export default class CubeListView extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.height = this.props.customHeight || height;
    this.width = this.props.customWidth || width;
    this.pagesX = this.props.children.map(
      (_child: any, index: number) => width * -index,
    );
    this.pagesY = this.props.children.map(
      (_child: any, index: number) => height * -index,
    );
    this.fullWidth = (this.props.children.length - 1) * width;

    this.state = {
      isVerticalSwipe: false,
    };
  }

  height: number;
  width: number;

  pagesX: number[];
  pagesY: number[];

  fullWidth: number;

  _animatedValue: any;
  _value: any;
  _lastValue: any;
  _panResponder: any;

  componentWillMount() {
    this._animatedValue = new Animated.ValueXY();

    this._animatedValue.setValue({x: 0, y: 0});
    this._value = {x: 0, y: 0};
    this._lastValue = {x: 0, y: 0};

    this._animatedValue.addListener((value: any) => {
      this._value = value;
    });

    const onDoneSwiping = (gestureState: PanResponderGestureState) => {
      let goTo = 0;
      let swipeDirection = 'none';
      if (this.state.isVerticalSwipe) {
        goTo = this._closest(this._value.y + gestureState.dy);
        if (goTo) {
          const newValue = {
            x: this.pagesX[goTo],
            y: this.pagesY[goTo],
          };
          if (Math.abs(this._lastValue.x) > Math.abs(newValue.x)) {
            swipeDirection = 'down';
          } else if (Math.abs(this._lastValue.x) < Math.abs(newValue.x)) {
            swipeDirection = 'up';
          }
          this._lastValue = newValue;
          this._animatedValue.flattenOffset();
          Animated.spring(this._animatedValue, {
            toValue: {x: 0, y: this.pagesY[goTo]},
            friction: 3,
            tension: 0.6,
            useNativeDriver: false,
          }).start();
        }
      } else {
        let mod = gestureState.dx > 0 ? 100 : -100;

        goTo = this._closest(this._value.x + mod);
        if (goTo) {
          const newValue = {
            x: this.pagesX[goTo],
            y: this.pagesY[goTo],
          };
          if (Math.abs(this._lastValue.x) > Math.abs(newValue.x)) {
            swipeDirection = 'right';
          } else if (Math.abs(this._lastValue.x) < Math.abs(newValue.x)) {
            swipeDirection = 'left';
          }
          this._lastValue = newValue;
          this._animatedValue.flattenOffset();
          Animated.spring(this._animatedValue, {
            toValue: {x: this.pagesX[goTo], y: 0},
            friction: 3,
            tension: 0.6,
            useNativeDriver: false,
          }).start();
        }
      }
      if (this.props.callBackAfterSwipe) {
        this.props.callBackAfterSwipe({
          direction: swipeDirection,
          index: goTo,
        });
      }
    };

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        this._animatedValue.stopAnimation();
        this._animatedValue.setOffset({
          x: this._lastValue.x,
          y: this._lastValue.y,
        });
      },
      onPanResponderMove: (e, gestureState) => {
        const {dx, dy} = gestureState;

        if (Math.abs(dy) > Math.abs(dx)) {
          this.setState({isVerticalSwipe: true});

          Animated.event(
            [null, {dy: this._animatedValue.y, dx: this._animatedValue.x}],
            {
              listener: () => {},
              useNativeDriver: false,
            },
          )(e, gestureState);
        } else {
          this.setState({isVerticalSwipe: false});

          Animated.event(
            [null, {dy: this._animatedValue.y, dx: this._animatedValue.x}],
            {
              listener: () => {},
              useNativeDriver: false,
            },
          )(e, gestureState);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        onDoneSwiping(gestureState);
      },
    });
  }

  _closest = (num: number) => {
    let array = this.state.isVerticalSwipe ? this.pagesY : this.pagesX;
    let i = 0;
    let minDiff = 1000;
    let index;
    for (i in array) {
      let m = Math.abs(num - array[i]);
      if (m < minDiff) {
        minDiff = m;
        index = i;
      }
    }
    return index;
  };

  _getTransformsFor = (i: number) => {
    let scrollX = this._animatedValue.x;
    let scrollY = this._animatedValue.y;

    let pageX = -this.width * i;
    let pageY = -this.height * i;

    let loopVariable = (variable: number, sign = 1) =>
      variable + Math.sign(sign) * (this.fullWidth + this.width);

    let padInput = (variables: any[]) => {
      if (!this.props.loop) {
        return variables;
      }
      const returnedVariables = [...variables];
      returnedVariables.unshift(
        ...variables.map((variable: any) => loopVariable(variable, -1)),
      );
      returnedVariables.push(
        ...variables.map((variable: any) => loopVariable(variable, 1)),
      );
      return returnedVariables;
    };

    let padOutput = (variables: number[] | string[]) => {
      if (!this.props.loop) {
        return variables;
      }
      const returnedVariables = [...variables];
      returnedVariables.unshift(...variables);
      returnedVariables.push(...variables);
      return returnedVariables;
    };

    let translateX = scrollX.interpolate({
      inputRange: padInput([pageX - this.width, pageX + this.width]),
      outputRange: padOutput([
        -this.width / TR_POSITION,
        this.width / TR_POSITION,
      ]),
      extrapolate: 'clamp',
    });

    let translateY = scrollY.interpolate({
      inputRange: [pageY - this.height, pageY, pageY + this.height],
      outputRange: [-this.height / TR_POSITION, 0, this.height / TR_POSITION],
      extrapolate: 'clamp',
    });

    let rotateY = scrollX.interpolate({
      inputRange: padInput([pageX - this.width, pageX, pageX + this.width]),
      outputRange: padOutput(['-60deg', '0deg', '60deg']),
      extrapolate: 'clamp',
    });

    let rotateX = scrollY.interpolate({
      inputRange: [pageY - this.height, pageY, pageY + this.height],
      outputRange: ['60deg', '0deg', '-60deg'],
      extrapolate: 'clamp',
    });

    let translateXAfterRotate = scrollX.interpolate({
      inputRange: padInput([
        pageX - this.width,
        pageX - this.width + 0.1,
        pageX,
        pageX + this.width - 0.1,
        pageX + this.width,
      ]),
      outputRange: padOutput([
        -this.width - 1,
        (-this.width - 1) / PERSPECTIVE,
        0,
        (this.width + 1) / PERSPECTIVE,
        +this.width + 1,
      ]),
      extrapolate: 'clamp',
    });

    let translateYAfterRotate = scrollY.interpolate({
      inputRange: [
        pageY - this.height,
        pageY - this.height + 0.1,
        pageY,
        pageY + this.height - 0.1,
        pageY + this.height,
      ],
      outputRange: [
        -this.height - 1,
        (-this.height - 1) / PERSPECTIVE,
        0,
        (this.height + 1) / PERSPECTIVE,
        +this.height + 1,
      ],
      extrapolate: 'clamp',
    });

    let opacityX = scrollX.interpolate({
      inputRange: padInput([
        pageX - this.width,
        pageX - this.width + 10,
        pageX,
        pageX + this.width - 250,
        pageX + this.width,
      ]),
      outputRange: padOutput([0, 0.6, 1, 0.6, 0]),
      extrapolate: 'clamp',
    });

    let opacityY = scrollY.interpolate({
      inputRange: [
        pageY - this.height,
        pageY - this.height + 30,
        pageY,
        pageY + this.height - 100,
        pageY + this.height,
      ],
      outputRange: [0, 0.6, 1, 0.6, 0],
      extrapolate: 'clamp',
    });

    return this.state.isVerticalSwipe
      ? {
          transform: [
            {perspective: this.height},
            {translateY},
            {rotateX: rotateX},
            {translateY: translateYAfterRotate},
          ],
          opacity: opacityY,
        }
      : {
          transform: [
            {perspective: this.width},
            {translateX},
            {rotateY: rotateY},
            {translateX: translateXAfterRotate},
          ],
          opacity: opacityX,
        };
  };

  _renderChild = (
    child: React.FunctionComponentElement<{i: any; style: any[]}>,
    i: number,
  ) => {
    let expandStyle = {width: this.width, height: this.height};
    let style = [child.props.style, expandStyle];
    let props = {
      i,
      style,
    };
    let element = React.cloneElement(child, props);

    return (
      <Animated.View
        style={[StyleSheet.absoluteFill, this._getTransformsFor(i)]}
        key={`child- ${i}`}>
        {element}
      </Animated.View>
    );
  };

  render() {
    let expandStyle = {width: this.width, height: this.height};

    return (
      <Animated.View style={styles.main} {...this._panResponder.panHandlers}>
        <Animated.View style={[styles.container, expandStyle]}>
          {this.props.children.map(this._renderChild)}
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  main: {position: 'absolute'},
  container: {backgroundColor: '#000', position: 'absolute'},
});
