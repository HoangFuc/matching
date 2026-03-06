import React from 'react';
import { StyleSheet } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';

interface IProps {
  label: string;
  image: React.ReactNode;
  onPress?: () => void;
}

const ConmomAction: React.FC<IProps> = props => {
  const { label, image, onPress } = props;

  return (
    <MemoBaseCard onPress={onPress} style={styles.container}>
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
    width: ms(80),
    paddingTop: ms(15),
    paddingHorizontal: ms(10),
    paddingBottom: ms(16),
    gap: ms(8),
    alignItems: 'center',
  },
});
