import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';

const {width: screenW, height: screenH} = Dimensions.get('window');

// const VIDEO_URL =
//   'file:///Users/syedali/Library/Developer/CoreSimulator/Devices/F613183A-0365-4372-B845-161C49F1E20D/data/Containers/Data/Application/3F8396FF-510B-4B4A-96AB-BD7E973F0F54/tmp/SampleVideo_720x480_5mb.mp4';
const VIDEO_URL = 'content://media/external/video/media/226';

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
          ref={(ref: undefined) => (videoPlayerRef.current = ref)} // Store reference
          source={{uri: source || VIDEO_URL}} // Can be a URL or a local file.
          style={styles.video}
          repeat
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
    height: screenH * 0.7,
    width: screenW,
    backgroundColor: 'black',
  },
});
