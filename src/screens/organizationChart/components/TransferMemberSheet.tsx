import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoBottomSheetModal } from '@/src/component/BottomSheetModal';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';

type TTransferType = 'department' | 'team';

interface IProps {
  visible: boolean;
  memberName: string;
  currentGroupName: string;
  targetGroupName: string;
  transferType: TTransferType;
  onClose: () => void;
  onConfirm: () => void;
}

//---------------------------------------
const TransferMemberSheet: React.FC<IProps> = ({
  visible,
  memberName,
  currentGroupName,
  targetGroupName,
  transferType,
  onClose,
  onConfirm,
}) => {
  //---------------------------------------
  const handleConfirm = React.useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  //---------------------------------------
  const message = React.useMemo(() => {
    if (transferType === 'department') {
      return `${memberName} 멤버는 현재 ${currentGroupName} 부서에 속해 있습니다.\n이 멤버를 ${targetGroupName} 부서에 추가하시겠습니까?`;
    }
    return `${memberName} 멤버는 현재 ${currentGroupName} 그룹에 속해 있습니다.\n이 멤버를 ${targetGroupName} 그룹에 추가하시겠습니까?`;
  }, [memberName, currentGroupName, targetGroupName, transferType]);

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
          {message}
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

export const MemoTransferMemberSheet = React.memo(TransferMemberSheet);

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
