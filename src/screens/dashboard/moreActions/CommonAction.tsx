import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { CardShadow } from '@/src/constants/shadows';

interface IProps {
  label: string;
  image: React.ReactNode;
  onPress?: () => void;
}

const ConmomAction: React.FC<IProps> = props => {
  const { label, image, onPress } = props;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {image}

      <AppText variant="body6" color={AppColors.gray90} numberOfLines={1}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
};

export const MemoCommonAction = React.memo(ConmomAction);

const styles = StyleSheet.create({
  container: {
    width: ms(80),
    borderRadius: ms(16),
    paddingTop: ms(15),
    paddingHorizontal: ms(10),
    paddingBottom: ms(16),
    gap: ms(8),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.gray30,
    backgroundColor: AppColors.white,
    ...CardShadow,
  },
});
