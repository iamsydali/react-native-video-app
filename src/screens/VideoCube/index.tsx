import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CubeListView from '../../components/CubeListView';
import VideoCubeItem from '../../components/VideoCubeItem';

const VideoCube = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderListItem = (index: number) => {
    return (
      <VideoCubeItem
        key={`${index}`}
        itemIndex={index}
        inFocusIndex={currentIndex}
      />
    );
  };

  return (
    <View style={styles.main}>
      <CubeListView callBackAfterSwipe={setCurrentIndex}>
        {Array.from(Array(10).keys()).map(i => renderListItem(i))}
      </CubeListView>
    </View>
  );
};

export default VideoCube;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
