import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';

interface NoDataProps {
  message?: string;
}

const NoData: React.FC<NoDataProps> = ({ message = '데이터가 없습니다' }) => {
  return (
    <View style={styles.container}>
      <Image
        source={AppImages.folderWithDocument}
        style={styles.image}
        resizeMode="contain"
      />
      <AppText variant="body7" color={AppColors.gray50}>
        {message}
      </AppText>
    </View>
  );
};

export const MemoNoData = React.memo(NoData);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: ms(60),
    gap: ms(12),
  },
  image: {
    width: ms(80),
    height: ms(80),
  },
});
