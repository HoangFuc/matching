import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoFileInfoCard } from '@/src/component/FileInfoCard';
import { AppColors } from '@/src/constants/colors';
import { CloudPlus, Trash } from '@/src/constants/icons';
import { TUploadFile } from '@/src/interface/meetingMinutes.interface';

interface IUploadFileItemProps {
  file: TUploadFile;
  onRemove: (id: string) => void;
}

const UploadFileItem: React.FC<IUploadFileItemProps> = ({
  file,
  onRemove,
}) => {
  const isDone = file.status === 'done';

  if (isDone) {
    return (
      <MemoFileInfoCard
        fileName={file.name}
        fileSize={file.size}
        onRemove={() => onRemove(file.id)}
      />
    );
  }

  return (
    <View style={styles.fileItemContent}>
      <View style={styles.fileItemHeader}>
        <AppText
          variant="body7"
          color={AppColors.gray80}
          style={styles.fileName}
        >
          파일 업로드 중 {file.progress}%
        </AppText>

        <Pressable
          hitSlop={8}
          onPress={() => onRemove(file.id)}
          style={styles.trashContainer}
        >
          <Trash
            size={`${ms(20)}`}
            color={AppColors.negative}
            variant="Bold"
          />
        </Pressable>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${file.progress}%` }]}
        />
      </View>
    </View>
  );
};

interface IProps {
  files: TUploadFile[];
  onPickFile: () => void;
  onRemoveFile: (id: string) => void;
}

const FileUploadSection: React.FC<IProps> = ({
  files,
  onPickFile,
  onRemoveFile,
}) => {
  const hasFiles = files.length > 0;

  return (
    <View style={styles.container}>
      {hasFiles ? (
        files.map(file => (
          <UploadFileItem
            key={file.id}
            file={file}
            onRemove={onRemoveFile}
          />
        ))
      ) : (
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
      )}
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
  fileItemContent: {
    gap: ms(8),
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: AppColors.gray30,
    backgroundColor: AppColors.white,
    padding: ms(16),
    borderStyle: 'dashed',
    paddingVertical: ms(20),
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
  trashContainer: {
    borderRadius: ms(8),
    padding: ms(4),
    gap: ms(10),
    backgroundColor: AppColors.pastelPink,
  },
});
