import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ms } from 'react-native-size-matters/extend';

import type { IFile } from '@/src/store/api/dataRoom.api';
import { getFileTypeConfig, isImageFileName } from '../../utils/fileTypeConfig';

interface FileThumbnailProps {
  file: IFile;
  style?: object;
}

//---------------------------------------
const FileThumbnail: React.FC<FileThumbnailProps> = ({ file, style }) => {
  const [hasError, setHasError] = useState(false);

  const isImage =
    isImageFileName(file.originalName) || file.mimeType?.startsWith('image/');
  const imageUrl = file.downloadUrl || file.fileUrl;

  if (isImage && imageUrl && !hasError) {
    return (
      <View style={[styles.container, style]}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.fill}
          resizeMode="cover"
          onError={() => setHasError(true)}
        />
      </View>
    );
  }

  const config = getFileTypeConfig(file.originalName);

  return (
    <View style={[styles.container, { backgroundColor: config.bgColor }, style]}>
      {config.image ? (
        <Image source={config.image} style={styles.typeIcon} resizeMode="contain" />
      ) : (
        <Text style={styles.label}>{config.label}</Text>
      )}
    </View>
  );
};

export const MemoFileThumbnail = React.memo(FileThumbnail);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  typeIcon: {
    width: '55%',
    height: '55%',
  },
  label: {
    color: '#FFFFFF',
    fontSize: ms(16),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
