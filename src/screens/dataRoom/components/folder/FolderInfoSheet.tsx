import React from 'react';
import { StyleSheet, View } from 'react-native';

import dayjs from 'dayjs';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppBottomSheet } from '@/src/component/AppBottomSheet';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { DATA_ROOM_TAB_LABEL } from '../../constants';
import type { IFolder } from '@/src/store/api/dataRoom.api';

interface IProps {
  visible: boolean;
  onClose: () => void;
  folder: IFolder | null;
}

const INFO_ROWS: {
  label: string;
  getValue: (folder: IFolder) => string;
}[] = [
  { label: '폴더명', getValue: f => f.name },
  {
    label: '생성일',
    getValue: f => dayjs(f.createdAt).format('YYYY.MM.DD'),
  },
  {
    label: '수정일',
    getValue: f =>
      f.updatedAt ? dayjs(f.updatedAt).format('YYYY.MM.DD') : '-',
  },
  {
    label: '항목',
    getValue: f => `파일 ${f._count.files}개`,
  },
  {
    label: '저장 위치',
    getValue: f =>
      DATA_ROOM_TAB_LABEL[f.type as keyof typeof DATA_ROOM_TAB_LABEL] ?? f.type,
  },
];

//---------------------------------------
const FolderInfoSheet: React.FC<IProps> = ({ visible, onClose, folder }) => {
  if (!folder) {
    return null;
  }

  return (
    <MemoAppBottomSheet
      visible={visible}
      onClose={onClose}
      title="상세정보"
      scrollable={false}
      footer={
        <View style={styles.footer}>
          <MemoAppButton
            label="취소"
            variant="secondary"
            onPress={onClose}
            style={styles.cancelButton}
          />
        </View>
      }
    >
      <View style={styles.content}>
        {INFO_ROWS.map(row => (
          <View key={row.label} style={styles.row}>
            <AppText
              variant="body6"
              color={AppColors.gray90}
              style={styles.label}
            >
              {row.label}
            </AppText>
            <AppText
              variant="body8"
              color={AppColors.gray90}
              style={styles.value}
              numberOfLines={1}
            >
              {row.getValue(folder)}
            </AppText>
          </View>
        ))}
      </View>
    </MemoAppBottomSheet>
  );
};

export const MemoFolderInfoSheet = React.memo(FolderInfoSheet);

const styles = StyleSheet.create({
  content: {
    paddingTop: ms(16),
    paddingBottom: ms(8),
    gap: ms(16),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: ms(80),
  },
  value: {
    flex: 1,
  },
  footer: {
    flex: 1,
    alignItems: 'center',
  },
  footerDivider: {
    width: '100%',
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: AppColors.gray20,
    marginBottom: ms(12),
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(8),
    borderRadius: ms(100),
    borderWidth: 1,
    width: ms(163),
    borderColor: AppColors.gray20,
  },
  footerHandle: {
    width: ms(134),
    height: ms(5),
    borderRadius: ms(100),
    backgroundColor: AppColors.gray90,
    marginTop: ms(16),
  },
});
