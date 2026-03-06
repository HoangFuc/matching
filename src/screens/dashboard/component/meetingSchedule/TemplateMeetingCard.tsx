import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ArrowRight2 } from '@/src/constants/icons';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';

interface IProps {
  image: React.ReactNode;
  text: string;
}

const TemplateMeetingCard: React.FC<IProps> = props => {
  const { image, text } = props;

  return (
    <MemoBaseCard style={styles.card}>
      {image}

      <View style={styles.footer}>
        <AppText variant="body6" color={AppColors.gray90}>
          {text}
        </AppText>

        <ArrowRight2 size={`${ms(16)}`} />
      </View>
    </MemoBaseCard>
  );
};

export const MemoTemplateMeetingCard = React.memo(TemplateMeetingCard);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
