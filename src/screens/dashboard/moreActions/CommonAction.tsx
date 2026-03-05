import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import {
  moderateScale as ms,
  scale as s,
} from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { CardShadow } from '@/src/constants/shadows';

interface IProps {
  label: string;
  image: React.ReactNode;
  onPress?: () => void;
  width?: number;
}

const ConmomAction: React.FC<IProps> = props => {
  const { label, image, onPress, width } = props;

  return (
    <TouchableOpacity
      style={[styles.container, { width: width ?? s(80) }]}
      onPress={onPress}
    >
      {image}

      <AppText variant="body6" color={AppColors.gray90}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
};

export const MemoCommonAction = React.memo(ConmomAction);

const styles = StyleSheet.create({
  container: {
    height: s(108),
    borderRadius: ms(16),
    padding: ms(15),
    gap: ms(8),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.gray30,
    backgroundColor: AppColors.white,
    ...CardShadow,
  },
});
