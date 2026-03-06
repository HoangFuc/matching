import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';

interface IProps {
  label: string;
  image: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const ConmomAction: React.FC<IProps> = props => {
  const { label, image, onPress, style } = props;

  return (
    <MemoBaseCard onPress={onPress} style={[styles.container, style]}>
      {image}

      <AppText variant="body6" color={AppColors.gray90} numberOfLines={1}>
        {label}
      </AppText>
    </MemoBaseCard>
  );
};

export const MemoCommonAction = React.memo(ConmomAction);

const styles = StyleSheet.create({
  container: {
    paddingTop: ms(15),
    paddingHorizontal: ms(10),
    paddingBottom: ms(16),
    gap: ms(8),
    alignItems: 'center',
  },
});
