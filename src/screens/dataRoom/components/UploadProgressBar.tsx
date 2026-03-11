import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';
import * as Progress from 'react-native-progress';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { CloseCircle } from '@/src/constants/icons';
import { CardShadow } from '@/src/constants/shadows';
import { useAppSelector } from '@/src/store/hooks';
import { useFileUploadWithProgress } from '../hooks/useFileUploadWithProgress';

const UploadProgressBar: React.FC = () => {
  //---------------------------------------
  const { cancelUpload } = useFileUploadWithProgress();

  //---------------------------------------
  const progress = useAppSelector(state => state.dataRoom.uploadProgress);

  //---------------------------------------
  const percent = Math.round(progress?.percent ?? 0);

  //---------------------------------------
  const isUploading = progress?.status === 'uploading';

  if (!progress) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppText variant="body6" color={AppColors.gray80} style={styles.text}>
          파일 업로드 중 {percent}%
        </AppText>

        <View style={styles.actions}>
          <Pressable hitSlop={8} onPress={cancelUpload}>
            <CloseCircle
              size={`${ms(20)}`}
              color={AppColors.gray50}
              variant="Linear"
            />
          </Pressable>
        </View>
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
});
