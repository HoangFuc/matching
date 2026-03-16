import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { AppColors } from '@/src/constants/colors';
import type { IFile } from '@/src/store/api/dataRoom.api';

interface FileThumbnailProps {
  file: IFile;
  style?: object;
}

//---------------------------------------
const FileThumbnail: React.FC<FileThumbnailProps> = ({ file, style }) => {
  const [hasError, setHasError] = useState(false);

  const imageUrl = file.downloadUrl || file.fileUrl;

  return (
    <View style={[styles.container, style]}>
      {imageUrl && !hasError && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setHasError(true)}
        />
      )}
    </View>
  );
};

export const MemoFileThumbnail = React.memo(FileThumbnail);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: AppColors.gray20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
