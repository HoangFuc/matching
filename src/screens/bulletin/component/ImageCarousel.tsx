import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppColors } from '@/src/constants/colors';

interface IPostImage {
  id: string;
  postId: string;
  presignedUrl: string;
}

interface IProps {
  images: IPostImage[];
}

const imageWidth = Dimensions.get('window').width - ms(32);

const ImageCarousel: React.FC<IProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  //---------------------------------------
  const handleScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / imageWidth);
      setActiveIndex(index);
    },
    [],
  );

  //---------------------------------------
  const renderItem = React.useCallback(
    ({ item }: { item: IPostImage }) => (
      <Image
        source={{ uri: item.presignedUrl }}
        style={[styles.postImage, { width: imageWidth }]}
        resizeMode="cover"
      />
    ),
    [],
  );

  //---------------------------------------
  const keyExtractor = React.useCallback(
    (img: IPostImage) => `${img.id}-${img.postId}`,
    [],
  );

  return (
    <View>
      <FlatList
        data={images}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={renderItem}
      />
      {images.length > 1 && (
        <View style={styles.dotContainer}>
          {images.map((img, index) => (
            <View
              key={`dot-${img.id}`}
              style={[
                styles.dot,
                index === activeIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export const MemoImageCarousel = React.memo(ImageCarousel);

const styles = StyleSheet.create({
  postImage: {
    height: ms(343),
    borderRadius: ms(8),
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ms(6),
    marginTop: ms(10),
  },
  dot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: AppColors.gray30,
  },
  dotActive: {
    backgroundColor: AppColors.purple,
  },
});
