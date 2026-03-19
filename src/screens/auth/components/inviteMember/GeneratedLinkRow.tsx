import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Copy, ExportSquare } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';

interface IProps {
  link: string;
  onCopy: () => void;
  onShare: () => void;
}

//---------------------------------------
const GeneratedLinkRow: React.FC<IProps> = ({ link, onCopy, onShare }) => {
  return (
    <View style={styles.container}>
      <View style={styles.linkRow}>
        <AppText
          variant="body8"
          color={AppColors.gray80}
          numberOfLines={1}
          style={styles.linkText}
        >
          {link}
        </AppText>

        <Pressable hitSlop={8} onPress={onCopy}>
          <Copy size={`${ms(18)}`} color={AppColors.gray60} variant="Linear" />
        </Pressable>

        <Pressable hitSlop={8} onPress={onShare}>
          <ExportSquare
            size={`${ms(18)}`}
            color={AppColors.gray60}
            variant="Linear"
          />
        </Pressable>
      </View>

      <AppText variant="detail" color={AppColors.purple}>
        * 링크 유형: 여러 명 사용 가능
      </AppText>
    </View>
  );
};

export const MemoGeneratedLinkRow = React.memo(GeneratedLinkRow);

const styles = StyleSheet.create({
  container: {
    gap: ms(8),
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    borderWidth: 1,
    borderColor: AppColors.gray20,
    borderRadius: ms(12),
    paddingHorizontal: ms(14),
    paddingVertical: ms(12),
    backgroundColor: AppColors.white,
  },
  linkText: {
    flex: 1,
  },
});
