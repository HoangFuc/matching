import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { CloseCircle, CloudPlus, More } from '@/src/constants/icons';
import { TUploadFile } from '@/src/interface/meetingMinutes.interface';

interface IUploadFileItemProps {
  file: TUploadFile;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

const UploadFileItem: React.FC<IUploadFileItemProps> = ({
  file,
  onRemove,
  onRetry,
}) => {
  const isUploading = file.status === 'uploading';
  const isDone = file.status === 'done';

  return (
    <View style={styles.fileItem}>
      <View style={styles.fileItemContent}>
        {isUploading && (
          <>
            <View style={styles.fileItemHeader}>
              <AppText
                variant="body7"
                color={AppColors.gray80}
                style={styles.fileName}
              >
                파일 업로드 중 {file.progress}%
              </AppText>
              <View style={styles.fileActions}>
                <Pressable hitSlop={8} onPress={() => onRetry(file.id)}>
                  <More
                    size={`${ms(18)}`}
                    color={AppColors.gray50}
                    variant="Linear"
                  />
                </Pressable>
                <Pressable hitSlop={8} onPress={() => onRemove(file.id)}>
                  <CloseCircle
                    size={`${ms(18)}`}
                    color={AppColors.negative}
                    variant="Bold"
                  />
                </Pressable>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${file.progress}%` }]}
              />
            </View>
          </>
        )}

        {isDone && (
          <View style={styles.fileItemHeader}>
            <View style={styles.fileNameRow}>
              <AppText
                variant="body7"
                color={AppColors.gray80}
                numberOfLines={1}
                style={styles.fileName}
              >
                {file.name}
              </AppText>
              <AppText variant="detail" color={AppColors.gray50}>
                {file.size}
              </AppText>
            </View>
            <Pressable hitSlop={8} onPress={() => onRemove(file.id)}>
              <CloseCircle
                size={`${ms(18)}`}
                color={AppColors.negative}
                variant="Bold"
              />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

interface IProps {
  files: TUploadFile[];
  onPickFile: () => void;
  onRemoveFile: (id: string) => void;
  onRetryFile: (id: string) => void;
}

const FileUploadSection: React.FC<IProps> = ({
  files,
  onPickFile,
  onRemoveFile,
  onRetryFile,
}) => {
  return (
    <View style={styles.container}>
      {/* Drop zone */}
      <Pressable style={styles.dropZone} onPress={onPickFile}>
        <CloudPlus
          size={`${ms(24)}`}
          color={AppColors.gray40}
          variant="Linear"
        />

        <AppText
          variant="body8"
          color={AppColors.gray40}
          style={styles.formatsText}
        >
          m4a, amr, mp3, wav, ogg, flac
        </AppText>

        <AppText variant="detail" color={AppColors.gray40}>
          지원 파일 용량 100MB
        </AppText>
      </Pressable>

      {files.map(file => (
        <UploadFileItem
          key={file.id}
          file={file}
          onRemove={onRemoveFile}
          onRetry={onRetryFile}
        />
      ))}
    </View>
  );
};

export const MemoFileUploadSection = React.memo(FileUploadSection);

const styles = StyleSheet.create({
  container: {
    gap: ms(8),
  },
  dropZone: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: AppColors.gray30,
    borderRadius: ms(8),
    paddingVertical: ms(20),
    alignItems: 'center',
    gap: ms(4),
  },
  cloudIcon: {
    alignItems: 'center',
    marginBottom: ms(4),
  },
  cloudBody: {
    width: ms(32),
    height: ms(20),
    borderRadius: ms(12),
    backgroundColor: AppColors.gray30,
  },
  cloudArrow: {
    width: ms(2),
    height: ms(12),
    backgroundColor: AppColors.gray30,
    marginTop: -ms(4),
  },
  formatsText: {
    marginTop: ms(4),
  },
  fileItem: {
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: AppColors.gray20,
    backgroundColor: AppColors.white,
    paddingHorizontal: ms(12),
    paddingVertical: ms(10),
  },
  fileItemContent: {
    gap: ms(8),
  },
  fileItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileNameRow: {
    flex: 1,
    gap: ms(2),
    marginRight: ms(8),
  },
  fileName: {
    flex: 1,
  },
  fileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  progressBar: {
    height: ms(4),
    borderRadius: ms(2),
    backgroundColor: AppColors.gray20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: ms(2),
    backgroundColor: AppColors.purple,
  },
});
