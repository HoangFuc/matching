import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { CloseCircle } from '@/src/constants/icons';
import { CardShadow } from '@/src/constants/shadows';
import type { IUploadProgress } from '../hooks/useFileUploadWithProgress';

interface IProps {
  progress: IUploadProgress;
  onDismiss: () => void;
  onAddFile?: () => void;
}

const UploadProgressBar: React.FC<IProps> = ({ progress, onDismiss }) => {
  const isUploading = progress.status === 'uploading';
  const percent = Math.round(progress.percent);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppText variant="body6" color={AppColors.gray80} style={styles.text}>
          파일 업로드 중 {percent}%
        </AppText>

        <View style={styles.actions}>
          <Pressable hitSlop={8} onPress={onDismiss}>
            <CloseCircle
              size={`${ms(20)}`}
              color={AppColors.gray50}
              variant="Linear"
            />
          </Pressable>
        </View>
      </View>

      {isUploading && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percent}%` }]} />
        </View>
      )}
    </View>
  );
};

export const MemoUploadProgressBar = React.memo(UploadProgressBar);

const styles = StyleSheet.create({
  container: {
    borderRadius: ms(100),
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.gray20,
    overflow: 'hidden',
    paddingVertical: ms(8),
    paddingHorizontal: ms(16),
    marginLeft: ms(16),
    ...CardShadow,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ms(10),
  },
  text: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  progressBar: {
    height: ms(3),
    backgroundColor: AppColors.gray20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.purple,
    borderRadius: ms(2),
  },
});
