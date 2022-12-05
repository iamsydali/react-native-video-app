import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';

const { width: screenW, height: screenH } = Dimensions.get('window');

const VIDEO_URL = 'https://res.cloudinary.com/facetally/video/upload/du_10,e_loop,eo_10,f_gif,q_auto:low,so_0,vs_60/v1658270939/wzrad4yreyux2ekg12bj.gif';

const VideoCubeItem = ({
  source,
  itemIndex,
  inFocusIndex,
}: {
  source?: string;
  itemIndex: number;
  inFocusIndex: number;
}) => {
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const videoPlayerRef = useRef(Video);

  useEffect(() => {
    if (Number(inFocusIndex) === Number(itemIndex)) {
      setIsVideoPaused(false);
    } else {
      setIsVideoPaused(true);
    }
  }, [inFocusIndex, itemIndex]);

  return (
    <View style={styles.main}>
      <TouchableWithoutFeedback
        style={styles.video}
        onPress={() => setIsVideoPaused(!isVideoPaused)}>
        <Video
          ref={(ref: undefined) => (videoPlayerRef.current = ref)}
          source={{ uri: source || VIDEO_URL }}
          style={styles.video}
          repeat
          onError={console.log}
          paused={isVideoPaused}
          fullScreen
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default VideoCubeItem;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  video: {
    height: screenH * 0.8,
    width: screenW,
    backgroundColor: 'black',
  },
});
