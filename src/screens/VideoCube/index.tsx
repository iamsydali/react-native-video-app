import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CubeListView from '../../components/CubeListView';
import VideoCubeItem from '../../components/VideoCubeItem';

const VideoCube = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCubeList, setShowCubeList] = useState(false);

  const renderListItem = ({ index, url }: { index: number, url: string }) => {
    return (
      <>
        <VideoCubeItem
          source={url}
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
          {[
            { id: 1, url: "https://res.cloudinary.com/facetally/video/upload/v1658616149/uwpet4mva6p2ak6vuwrl.mp4" },
            { id: 2, url: "https://res.cloudinary.com/facetally/video/upload/v1660597869/kioluvj1uxpx07myqola.mp4" },
            { id: 3, url: "https://res.cloudinary.com/facetally/video/upload/v1658846343/wddvbj0sr4npqfw77otc.mp4" },
            { id: 4, url: "https://res.cloudinary.com/facetally/video/upload/v1659189810/ulzjlnefxjfgesezbp41.mp4" },
            { id: 5, url: "https://res.cloudinary.com/facetally/video/upload/v1658270964/uqb2mndybsklhnq6ykfp.mp4" },
            { id: 6, url: "https://res.cloudinary.com/facetally/video/upload/v1658847777/lkgnjpmj2ojx2pdg98m6.mov" },
            { id: 7, url: "https://res.cloudinary.com/facetally/video/upload/v1658270164/zvhffzrxdcg4pwheqhvn.mp4" },
            { id: 8, url: "https://res.cloudinary.com/facetally/video/upload/v1658267810/udhj6wvd5gywuyzenmac.mp4" },
            { id: 9, url: "https://res.cloudinary.com/facetally/video/upload/v1664188761/zocdpuy7lqzicn08fr5e.mp4" },
            { id: 10, url: "https://res.cloudinary.com/facetally/video/upload/v1664189047/rm9xuppfzciwvm4w3aef.mp4" }
          ].map(({ id, url }) => renderListItem({ index: id, url }))}
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
