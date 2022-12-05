import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import Trimmer from '../Trimmer';
import {trimVideo, createFrames} from '@salihgun/react-native-video-processor';
import moment from 'moment';

const {width: screenW, height: screenH} = Dimensions.get('window');

const THEME_COLOR = '#fad225';
const WHITE = '#FFFF';

const VideoTrimPicker = ({onSave}: any) => {
  const [videoSource, setVideoSource] = useState<undefined | Asset>();
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [trimmer, setTrimmer] = useState<any>();
  const [isTrimmerVisible, setIsTrimmerVisible] = useState(false);
  const [scrubberPosition, setScrubberPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [videoFrame, setVideoFrame] = useState<string>();

  const videoPlayerRef = useRef();

  useEffect(() => {
    if (!trimmer && videoSource) {
      setTrimmer({startTime: 0, endTime: videoSource?.duration});
    }
  }, [videoSource]);

  const onSaveClick = async () => {
    if (!trimmer || !videoSource?.uri || !videoSource?.fileName) {
      return;
    }

    setIsLoading(true);
    setIsVideoPaused(true);
    try {
      const startsAt = moment()
        .startOf('day')
        .second(+trimmer?.startTime)
        .format('HH:mm:ss');
      const durationAt = moment()
        .startOf('day')
        .second(+trimmer?.endTime)
        .format('HH:mm:ss');

      const secondDotIndex = videoSource.uri.lastIndexOf('.'); // Android path has double dot, need to parse it
      console.log('secondDotIndex', secondDotIndex);
      const newPath = Platform.select({
        ios: videoSource.uri.split('.')[0],
        android: videoSource.uri.substring(
          0,
          secondDotIndex < 0 ? videoSource.uri.length : secondDotIndex,
        ),
      }) as string;

      const outputPath = `${newPath}-trimmed.mp4`;

      const clippedVideoPath = await trimVideo(
        videoSource.uri,
        startsAt,
        durationAt,
        outputPath,
      );
      onSave({
        name: videoSource.fileName.split('.')[0] || videoSource.fileName,
        filename: videoSource.fileName,
        filepath: clippedVideoPath,
        type: videoSource.type,
      });
      onCancelClick();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onCancelClick = () => {
    setVideoSource(undefined);
    setVideoFrame(undefined);
    setTrimmer(undefined);
    setIsTrimmerVisible(false);
    setScrubberPosition(0);
  };

  const onProgressVideo = (currentTime: number) => {
    setScrubberPosition(currentTime);
    if (trimmer?.endTime < currentTime || trimmer?.startTime > currentTime) {
      videoPlayerRef.current.seek(trimmer?.startTime);
    }
  };

  const onPickVideo = async () => {
    try {
      const res = await launchImageLibrary({mediaType: 'video'});
      if (res?.assets && !!res?.assets.length) {
        setVideoSource(res.assets[0]);
        const framesPath = await createFrames(res.assets[0].uri);
        setVideoFrame(framesPath);
        setIsTrimmerVisible(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onHandleChange = ({
    leftPosition,
    rightPosition,
  }: {
    leftPosition: number;
    rightPosition: number;
  }) => {
    setTrimmer({startTime: leftPosition, endTime: rightPosition});
  };

  const onScrubbingComplete = (newValue: number) => {
    setScrubberPosition(newValue);
    videoPlayerRef.current.seek(newValue);
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
              {videoFrame ? (
                <Trimmer
                  onHandleChange={onHandleChange}
                  totalDuration={videoSource?.duration}
                  trimmerLeftHandlePosition={trimmer?.startTime || 0}
                  trimmerRightHandlePosition={
                    trimmer?.endTime || videoSource?.duration
                  }
                  minimumTrimDuration={Math.ceil(
                    (videoSource?.duration || 20) / 10,
                  )}
                  maxTrimDuration={videoSource?.duration}
                  scrubberPosition={scrubberPosition}
                  onScrubbingComplete={onScrubbingComplete}>
                  <View style={styles.frameView}>
                    {Array.from(Array(9).keys()).map(index => {
                      return (
                        <Image
                          key={index}
                          style={styles.frame}
                          source={{uri: `${videoFrame}${index + 1}.jpg`}}
                        />
                      );
                    })}
                  </View>
                </Trimmer>
              ) : (
                <></>
              )}
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
        {isLoading ? (
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="#fad225" />
          </View>
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
    height: screenH * 0.68,
    width: screenW,
    backgroundColor: 'black',
  },
  spinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  frame: {
    height: 80,
    width: 40,
  },
  frameView: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
});
