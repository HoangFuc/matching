import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { ms } from 'react-native-size-matters/extend';
import * as Progress from 'react-native-progress';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { CloseCircle } from '@/src/constants/icons';

export interface IUploadProgressData {
  status: 'uploading' | 'completed' | 'error' | 'cancelled';
  percent: number;
  fileName: string;
  error?: string;
}

interface IProps {
  progress: IUploadProgressData;
  onCancel: () => void;
  containerStyle?: ViewStyle;
  showError?: boolean;
  showFileName?: boolean;
}

const UploadProgressBar: React.FC<IProps> = ({
  progress,
  onCancel,
  containerStyle,
  showError = false,
  showFileName = false,
}) => {
  //---------------------------------------
  const percent = Math.round(progress.percent);
  const isUploading = progress.status === 'uploading';
  const isError = progress.status === 'error';

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.content}>
        {showFileName ? (
          <AppText
            variant="body7"
            color={isError ? AppColors.negative : AppColors.gray90}
            numberOfLines={1}
            style={styles.text}
          >
            {progress.fileName}
          </AppText>
        ) : null}

        {showError && isError ? (
          <AppText variant="body6" color={AppColors.negative}>
            업로드 실패: {progress.error ?? '알 수 없는 오류'}
          </AppText>
        ) : (
          <AppText variant="body6" color={AppColors.gray80} style={styles.text}>
            파일 업로드 중 {percent}%
          </AppText>
        )}

        {isUploading && (
          <View style={styles.actions}>
            <Pressable hitSlop={8} onPress={onCancel}>
              <CloseCircle
                size={`${ms(20)}`}
                color={AppColors.gray50}
                variant="Linear"
              />
            </Pressable>
          </View>
        )}
      </View>

      {isUploading && (
        <Progress.Bar
          progress={percent / 100}
          width={null}
          height={ms(3)}
          color={AppColors.purple}
          unfilledColor={AppColors.gray20}
          borderWidth={0}
          borderRadius={ms(2)}
          animated
        />
      )}
    </View>
  );
};

export const MemoUploadProgressBar = React.memo(UploadProgressBar);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
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
});
