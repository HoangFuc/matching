import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ArrowRight2 } from 'iconsax-react-nativejs';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { CardShadow } from '@/src/constants/shadows';

interface IProps {
  image: React.ReactNode;
  text: string;
}

const TemplateMeetingCard: React.FC<IProps> = props => {
  const { image, text } = props;

  return (
    <View style={styles.card}>
      {image}

      <View style={styles.footer}>
        <AppText variant="body6" color={AppColors.gray90}>
          {text}
        </AppText>

        <ArrowRight2 size={`${ms(16)}`} />
      </View>
    </View>
  );
};

export const MemoTemplateMeetingCard = React.memo(TemplateMeetingCard);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: ms(16),
    padding: ms(16),
    gap: 8,
    borderWidth: 1,
    borderColor: AppColors.gray30,
    backgroundColor: AppColors.white,
    ...CardShadow,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
