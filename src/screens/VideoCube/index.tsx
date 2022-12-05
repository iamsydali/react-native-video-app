import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CubeListView from '../../components/CubeListView';
import VideoCubeItem from '../../components/VideoCubeItem';

const VideoCube = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCubeList, setShowCubeList] = useState(false);

  const renderListItem = (index: number) => {
    return (
      <>
        <VideoCubeItem
          key={`${index}`}
          itemIndex={index}
          inFocusIndex={currentIndex}
        />
        <View style={styles.header}>
          <Text style={styles.text}>Video {index}</Text>
        </View>
      </>
    );
  };

  return (
    <View style={styles.main}>
      {showCubeList ? (
        <CubeListView callBackAfterSwipe={setCurrentIndex}>
          {Array.from(Array(10).keys()).map(i => renderListItem(i))}
        </CubeListView>
      ) : (
        <TouchableOpacity
          style={styles.btn}
          onPress={() => setShowCubeList(!showCubeList)}>
          <Text style={styles.text}>Show Cube</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCube;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 100,
  },
  header: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: '500',
    color: '#fff',
  },
  btn: {
    backgroundColor: '#A3F989',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
