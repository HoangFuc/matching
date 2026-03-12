import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { Trash } from '@/src/constants/icons';

interface IProps {
  fileName: string;
  fileSize: string;
  onRemove?: () => void;
}

const FileInfoCard: React.FC<IProps> = ({ fileName, fileSize, onRemove }) => {
  return (
    <View style={styles.container}>
      <View style={styles.fileNameRow}>
        <AppText
          variant="body7"
          color={AppColors.gray80}
          numberOfLines={1}
          style={styles.fileName}
        >
          {fileName}
        </AppText>

        <AppText variant="detail" color={AppColors.gray50}>
          {fileSize}
        </AppText>
      </View>

      {onRemove && (
        <Pressable
          hitSlop={8}
          onPress={onRemove}
          style={styles.trashContainer}
        >
          <Trash
            size={`${ms(20)}`}
            color={AppColors.negative}
            variant="Linear"
          />
        </Pressable>
      )}
    </View>
  );
};

export const MemoFileInfoCard = React.memo(FileInfoCard);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: ms(8),
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: AppColors.gray30,
    backgroundColor: AppColors.white,
    padding: ms(16),
    paddingVertical: ms(20),
  },
  fileNameRow: {
    flex: 1,
    gap: ms(2),
    marginRight: ms(8),
  },
  fileName: {
    flex: 1,
  },
  trashContainer: {
    borderRadius: ms(8),
    padding: ms(4),
    gap: ms(10),
    backgroundColor: AppColors.pastelPink,
  },
});
