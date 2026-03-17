import React from 'react';
import { StyleSheet, View } from 'react-native';

import dayjs from 'dayjs';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppBottomSheet } from '@/src/component/AppBottomSheet';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';

import { formatFileSize } from '@/src/utils/format';
import type { IFile } from '@/src/store/api/dataRoom.api';

interface IProps {
  visible: boolean;
  onClose: () => void;
  file: IFile | null;
  folderName: string;
}

const INFO_ROWS: {
  label: string;
  getValue: (file: IFile) => string;
}[] = [
  { label: '파일명', getValue: f => f.originalName },
  {
    label: '크기',
    getValue: f => formatFileSize(Number(f.fileSize)),
  },
  {
    label: '생성일',
    getValue: f => dayjs(f.createdAt).format('YYYY.MM.DD'),
  },
  {
    label: '수정일',
    getValue: f =>
      f.updatedAt ? dayjs(f.updatedAt).format('YYYY.MM.DD') : '-',
  },
];

//---------------------------------------
const FileInfoSheet: React.FC<IProps> = ({ visible, onClose, file, folderName }) => {
  if (!file) {
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
        {INFO_ROWS.map((row, index) => (
          <React.Fragment key={row.label}>
            <View style={styles.row}>
              <AppText variant="body6" color={AppColors.gray60} style={styles.label}>
                {row.label}
              </AppText>
              <AppText
                variant="body6"
                color={AppColors.gray90}
                style={styles.value}
                numberOfLines={1}
              >
                {row.getValue(file)}
              </AppText>
            </View>
            {index === 0 && (
              <View style={styles.row}>
                <AppText variant="body6" color={AppColors.gray60} style={styles.label}>
                  저장 위치
                </AppText>
                <AppText
                  variant="body6"
                  color={AppColors.gray90}
                  style={styles.value}
                  numberOfLines={1}
                >
                  {folderName}
                </AppText>
              </View>
            )}
          </React.Fragment>
        ))}
      </View>
    </MemoAppBottomSheet>
  );
};

export const MemoFileInfoSheet = React.memo(FileInfoSheet);

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
});
