import React from 'react';
import {
  ActivityIndicator,
  Image,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import ReactNativeBlobUtil from 'react-native-blob-util';
import { WebView } from 'react-native-webview';
import Video from 'react-native-video';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ms } from 'react-native-size-matters/extend';

import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { ArrowLeft2, Microphone2, Pause, Play } from '@/src/constants/icons';
import type { DataRoomStackParamList } from '@/src/interface/tab.interface';

type TNav = NativeStackNavigationProp<DataRoomStackParamList, 'DataRoomFileViewer'>;
type TRoute = RouteProp<DataRoomStackParamList, 'DataRoomFileViewer'>;

const DataRoomFileViewerScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const route = useRoute<TRoute>();

  const { fileName, downloadUrl, mimeType } = route.params;

  const [loading, setLoading] = React.useState(true);
  const [localUri, setLocalUri] = React.useState<string | null>(null);
  const [error, setError] = React.useState(false);

  // Audio player state
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentPosition, setCurrentPosition] = React.useState(0); // ms
  const [duration, setDuration] = React.useState(0); // ms
  const [trackWidth, setTrackWidth] = React.useState(0);

  const isImage = mimeType.startsWith('image/');
  const isPDF = mimeType === 'application/pdf';
  const isVideo = mimeType.startsWith('video/');
  const isAudio = mimeType.startsWith('audio/');
  const isOfficeDoc =
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'application/vnd.ms-powerpoint';

  //---------------------------------------
  React.useEffect(() => {
    if (isImage) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const ext = fileName.includes('.') ? fileName.split('.').pop() ?? 'bin' : 'bin';
    const cachePath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/viewer_${Date.now()}.${ext}`;

    ReactNativeBlobUtil.config({
      fileCache: true,
      path: cachePath,
    })
      .fetch('GET', downloadUrl)
      .then(async res => {
        if (cancelled) return;
        const nativePath = res.path();

        if (isPDF || isOfficeDoc) {
          if (Platform.OS === 'android') {
            await ReactNativeBlobUtil.android.actionViewIntent(nativePath, mimeType);
          } else {
            await ReactNativeBlobUtil.ios.openDocument(nativePath);
          }
          if (!cancelled) navigation.goBack();
          return;
        }

        const path = Platform.OS === 'android' ? `file://${nativePath}` : nativePath;
        if (!cancelled) setLocalUri(path);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [downloadUrl, fileName, isImage, isPDF, isOfficeDoc, mimeType, navigation]);

  //---------------------------------------
  React.useEffect(() => {
    if (!isAudio || !localUri) return;

    AudioRecorderPlayer.startPlayer(localUri).catch(() => setError(true));
    setIsPlaying(true);

    AudioRecorderPlayer.addPlayBackListener(data => {
      setCurrentPosition(data.currentPosition);
      if (data.duration > 0) setDuration(data.duration);
    });

    AudioRecorderPlayer.addPlaybackEndListener(() => {
      setIsPlaying(false);
      setCurrentPosition(0);
    });

    return () => {
      AudioRecorderPlayer.stopPlayer();
      AudioRecorderPlayer.removePlayBackListener();
      AudioRecorderPlayer.removePlaybackEndListener();
    };
  }, [isAudio, localUri]);

  //---------------------------------------
  const handlePressBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  //---------------------------------------
  const handleTogglePlayPause = React.useCallback(async () => {
    if (isPlaying) {
      await AudioRecorderPlayer.pausePlayer();
      setIsPlaying(false);
    } else {
      await AudioRecorderPlayer.resumePlayer();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  //---------------------------------------
  const handleSeek = React.useCallback(
    (event: { nativeEvent: { locationX: number } }) => {
      if (trackWidth === 0 || duration === 0) return;
      const ratio = Math.max(0, Math.min(1, event.nativeEvent.locationX / trackWidth));
      const seekMs = ratio * duration;
      AudioRecorderPlayer.seekToPlayer(seekMs);
      setCurrentPosition(seekMs);
    },
    [trackWidth, duration],
  );

  //---------------------------------------
  const handleTrackLayout = React.useCallback((e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  }, []);

  //---------------------------------------
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  //---------------------------------------
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={AppColors.purple} />
          <AppText variant="body4" color={AppColors.gray60} style={styles.loadingText}>
            파일을 불러오는 중...
          </AppText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <AppText variant="body3" color={AppColors.gray60}>
            파일을 열 수 없습니다.
          </AppText>
        </View>
      );
    }

    if (isImage) {
      return (
        <Image
          source={{ uri: downloadUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      );
    }

    if (isVideo && localUri) {
      return (
        <Video
          source={{ uri: localUri }}
          style={styles.video}
          resizeMode="contain"
          controls
          paused={false}
          onError={() => setError(true)}
        />
      );
    }

    if (isAudio) {
      const progress = duration > 0 ? currentPosition / duration : 0;
      return (
        <View style={styles.audioContainer}>
          <View style={styles.audioCard}>
            <View style={styles.audioIconWrapper}>
              <Microphone2 size={`${ms(40)}`} color={AppColors.purple} variant="Linear" />
            </View>

            <AppText variant="body3" color={AppColors.gray90} style={styles.audioFileName} numberOfLines={2}>
              {fileName}
            </AppText>

            <View style={styles.audioTimes}>
              <AppText variant="detail" color={AppColors.gray60}>
                {formatTime(currentPosition)}
              </AppText>
              <AppText variant="detail" color={AppColors.gray60}>
                {formatTime(duration)}
              </AppText>
            </View>

            <Pressable
              style={styles.trackContainer}
              onLayout={handleTrackLayout}
              onPress={handleSeek}
            >
              <View style={styles.trackBg}>
                <View style={[styles.trackFill, { width: `${progress * 100}%` }]} />
              </View>
              <View style={[styles.trackThumb, { left: `${progress * 100}%` as any }]} />
            </Pressable>

            <Pressable style={styles.playButton} onPress={handleTogglePlayPause}>
              {isPlaying ? (
                <Pause size={`${ms(28)}`} color={AppColors.white} variant="Bold" />
              ) : (
                <Play size={`${ms(28)}`} color={AppColors.white} variant="Bold" />
              )}
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <WebView
        source={{ uri: localUri ?? downloadUrl }}
        style={styles.webview}
        originWhitelist={['*']}
        onError={() => setError(true)}
        startInLoadingState
        renderLoading={() => (
          <View style={[StyleSheet.absoluteFill, styles.center]}>
            <ActivityIndicator size="large" color={AppColors.purple} />
          </View>
        )}
      />
    );
  };

  return (
    <AppSafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={handlePressBack}>
          <ArrowLeft2
            size={`${ms(24)}`}
            color={AppColors.white}
            variant="Linear"
          />
        </Pressable>

        <AppText
          variant="heading3"
          color={AppColors.white}
          numberOfLines={1}
          style={styles.headerTitle}
        >
          {fileName}
        </AppText>

        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <View style={styles.content}>{renderContent()}</View>
    </AppSafeAreaView>
  );
};

export const MemoDataRoomFileViewerScreen = React.memo(DataRoomFileViewerScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingBottom: ms(12),
    height: ms(49),
    backgroundColor: AppColors.purple,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: ms(8),
  },
  headerRight: {
    width: ms(24),
  },
  content: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    overflow: 'hidden',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(12),
  },
  loadingText: {
    marginTop: ms(4),
  },
  image: {
    flex: 1,
    width: '100%',
  },
  video: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  // Audio player
  audioContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ms(24),
  },
  audioCard: {
    width: '100%',
    backgroundColor: AppColors.white,
    borderRadius: ms(16),
    padding: ms(24),
    alignItems: 'center',
    gap: ms(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  audioIconWrapper: {
    width: ms(88),
    height: ms(88),
    borderRadius: ms(44),
    backgroundColor: AppColors.purple + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioFileName: {
    textAlign: 'center',
  },
  audioTimes: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ms(-12),
  },
  trackContainer: {
    width: '100%',
    height: ms(20),
    justifyContent: 'center',
  },
  trackBg: {
    height: ms(4),
    backgroundColor: AppColors.gray20,
    borderRadius: ms(2),
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    backgroundColor: AppColors.purple,
    borderRadius: ms(2),
  },
  trackThumb: {
    position: 'absolute',
    width: ms(14),
    height: ms(14),
    borderRadius: ms(7),
    backgroundColor: AppColors.purple,
    marginLeft: -ms(7),
    top: ms(3),
  },
  playButton: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
    backgroundColor: AppColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
