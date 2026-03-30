import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoBottomSheetModal } from '@/src/component/BottomSheetModal';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';

type TKickType = 'department' | 'team';

interface IProps {
  visible: boolean;
  memberName: string;
  kickType: TKickType;
  onClose: () => void;
  onConfirm: () => void;
}

//---------------------------------------
const KickMemberSheet: React.FC<IProps> = ({
  visible,
  memberName,
  kickType,
  onClose,
  onConfirm,
}) => {
  //---------------------------------------
  const handleConfirm = React.useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  return (
    <MemoBottomSheetModal
      visible={visible}
      onClose={onClose}
      sheetStyle={styles.sheet}
    >
      <View style={styles.content}>
        <Image
          source={AppImages.siren}
          style={styles.bellIcon}
          resizeMode="contain"
        />

        <AppText variant="body6" color={AppColors.black} style={styles.message}>
          {kickType === 'department'
            ? `${memberName} 멤버를 부서에서 내보내시겠습니까?`
            : `${memberName} 멤버를 그룹에서 내보내시겠습니까?`}
        </AppText>

        <View style={styles.buttonRow}>
          <MemoAppButton
            label="취소"
            variant="secondary"
            textVariant="body6"
            onPress={onClose}
            style={styles.button}
          />

          <MemoAppButton
            label="확인"
            variant="primary"
            textVariant="body6"
            textColor={AppColors.white}
            backgroundColor={AppColors.purple}
            onPress={handleConfirm}
            style={styles.button}
          />
        </View>
      </View>
    </MemoBottomSheetModal>
  );
};

export const MemoKickMemberSheet = React.memo(KickMemberSheet);

//---------------------------------------
const styles = StyleSheet.create({
  sheet: {
    paddingBottom: ms(32),
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingTop: ms(24),
  },
  bellIcon: {
    width: ms(48),
    height: ms(48),
    marginBottom: ms(16),
  },
  message: {
    textAlign: 'center',
    marginBottom: ms(24),
  },
  buttonRow: {
    flexDirection: 'row',
    gap: ms(12),
    width: '100%',
  },
  button: {
    flex: 1,
  },
});
