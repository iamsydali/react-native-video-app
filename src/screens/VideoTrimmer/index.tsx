import React, {useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import VideoTrimPicker from '../../components/VideoTrimPicker';
import Video from 'react-native-video';
// import {uploadFile} from '../../helpers';
import RNFS from 'react-native-fs';
import {deleteFile} from '../../helpers';

const {width: screenW, height: screenH} = Dimensions.get('window');

const VideoTrimmer = () => {
  const [selectedVideoFile, setSelectedVideoFile] = useState<
    undefined | RNFS.UploadFileItem
  >();

  const videoPlayerRef = useRef();

  const onUpload = () => {
    // selectedVideoFile && uploadFile(selectedVideoFile); // Upload method
    setSelectedVideoFile(undefined);
    selectedVideoFile && deleteFile(selectedVideoFile.filepath);
  };

  return (
    <View style={styles.main}>
      {selectedVideoFile ? (
        <>
          <Video
            ref={(ref: undefined) => (videoPlayerRef.current = ref)} // Store reference
            source={{
              uri: selectedVideoFile.filepath,
            }} // Can be a URL or a local file.
            style={styles.video}
            controls
            repeat
          />
          <TouchableOpacity style={styles.btn} onPress={() => onUpload()}>
            <Text style={styles.text}>Upload</Text>
          </TouchableOpacity>
        </>
      ) : (
        <VideoTrimPicker onSave={setSelectedVideoFile} />
      )}
    </View>
  );
};

export default VideoTrimmer;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    height: screenH * 0.7,
    width: screenW,
    backgroundColor: 'black',
  },
  btn: {
    backgroundColor: '#A3F989',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});
