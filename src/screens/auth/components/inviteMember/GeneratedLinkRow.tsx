import React from 'react';
import { Pressable, Share, StyleSheet, View } from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { DocumentCopy } from '@/src/constants/icons';
import { useToast } from '@/src/providers/ToastProvider';
import { ShareIcon } from 'react-native-heroicons/solid';

interface IProps {
  link: string;
}

//---------------------------------------
const GeneratedLinkRow: React.FC<IProps> = ({ link }) => {
  const { showToast } = useToast();

  //---------------------------------------
  const handleCopy = React.useCallback(() => {
    Clipboard.setString(link);
    showToast({ type: 'success', message: '링크가 복사되었습니다' });
  }, [link, showToast]);

  //---------------------------------------
  const handleShare = React.useCallback(async () => {
    try {
      await Share.share({ message: link });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  }, [link]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.linkRow}>
          <AppText
            variant="body8"
            color={AppColors.gray80}
            numberOfLines={1}
            style={styles.linkText}
          >
            {link}
          </AppText>

          <Pressable hitSlop={8} onPress={handleCopy}>
            <DocumentCopy
              size={`${ms(18)}`}
              color={AppColors.gray90}
              variant="Linear"
            />
          </Pressable>
        </View>

        <Pressable hitSlop={8} onPress={handleShare}>
          <ShareIcon width={ms(20)} height={ms(20)} stroke={AppColors.white} />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  linkRow: {
    flex: 1,
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
