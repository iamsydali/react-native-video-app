import React from 'react';
import {View} from 'react-native';
import VideoCube from './src/screens/VideoCube';
import VideoTrimmer from './src/screens/VideoTrimmer';

const App = () => {
  return (
    <View style={{flex: 1}}>
      <VideoCube />
    </View>
  );
};

export default App;
