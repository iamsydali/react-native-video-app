import React, {useRef, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {Trimmer, ProcessingManager} from 'react-native-video-processing';
import Video from 'react-native-video';
import {launchImageLibrary, Asset} from 'react-native-image-picker';

const {width: screenW, height: screenH} = Dimensions.get('window');

const THEME_COLOR = '#fad225';
const WHITE = '#FFFF';

const VideoTrimPicker = ({onSave}: any) => {
  const [videoSource, setVideoSource] = useState<undefined | Asset>();
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [trimmer, setTrimmer] = useState<any>();
  const [isTrimmerVisible, setIsTrimmerVisible] = useState(false);

  const videoPlayerRef = useRef();

  const onSaveClick = () => {
    if (!trimmer || !videoSource) {
      return;
    }
    const options = {
      startTime: trimmer.startTime,
      endTime: trimmer.endTime,
    };
    ProcessingManager.trim(videoSource.uri, options)
      .then((newSource: string) => {
        if (!videoSource) {
          return;
        }
        onSave({
          name: videoSource.fileName.split('.')[0] || videoSource.fileName,
          filename: videoSource.fileName,
          filepath: newSource,
          type: videoSource.type,
        });
        onCancelClick();
      })
      .catch(console.warn);
  };

  const onCancelClick = () => {
    setVideoSource(undefined);
    setIsTrimmerVisible(false);
  };

  const onProgressVideo = (currentTime: number) => {
    setVideoCurrentTime(currentTime);
    if (trimmer?.endTime < currentTime || trimmer?.startTime > currentTime) {
      videoPlayerRef.current.seek(trimmer?.startTime);
    }
  };

  const onPickVideo = async () => {
    await launchImageLibrary({mediaType: 'video'}, res => {
      if (res?.assets && !!res?.assets.length) {
        console.log('res.assets[0]', res.assets[0]);
        setVideoSource(res.assets[0]);
        setIsTrimmerVisible(true);
      }
    });
  };

  return (
    <>
      <TouchableOpacity style={styles.pickBtn} onPress={onPickVideo}>
        <Text style={styles.pickText}>Pick Video</Text>
      </TouchableOpacity>
      <Modal
        style={styles.main}
        visible={isTrimmerVisible}
        animationType="slide">
        {videoSource ? (
          <SafeAreaView style={styles.main}>
            <Video
              ref={(ref: undefined) => (videoPlayerRef.current = ref)} // Store reference
              source={{uri: videoSource.uri}} // Can be a URL or a local file.
              style={styles.video}
              repeat
              onProgress={(e: {currentTime: number}) =>
                onProgressVideo(e.currentTime)
              }
              paused={isVideoPaused}
            />
            <>
              <Trimmer
                source={videoSource.uri}
                height={50}
                width={screenW}
                currentTime={videoCurrentTime || 1} // use this prop to set tracker position iOS only
                onChange={setTrimmer}
                themeColor={THEME_COLOR}
                trackerColor={THEME_COLOR} // iOS only
                thumbWidth={20}
              />
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => onCancelClick()}>
                  <Text style={styles.text}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => setIsVideoPaused(!isVideoPaused)}>
                  <Text style={[styles.text, {color: WHITE}]}>
                    {isVideoPaused ? 'Play' : 'Pause'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!trimmer}
                  style={styles.btn}
                  onPress={() => onSaveClick()}>
                  <Text style={styles.text}>Done</Text>
                </TouchableOpacity>
              </View>
            </>
          </SafeAreaView>
        ) : (
          <></>
        )}
      </Modal>
    </>
  );
};

export default VideoTrimPicker;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    height: screenH * 0.7,
    width: screenW,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    color: THEME_COLOR,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    top: 30,
  },
  pickBtn: {
    backgroundColor: '#A3F989',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});
