import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { ArrowRight2 } from 'iconsax-react-nativejs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  scale as s,
  moderateScale as ms,
} from 'react-native-size-matters/extend';

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
    width: s(167.5),
    height: s(120),
    borderRadius: ms(14),
    padding: ms(16),
    gap: 8,
    borderWidth: 1,
    borderColor: AppColors.gray30,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
