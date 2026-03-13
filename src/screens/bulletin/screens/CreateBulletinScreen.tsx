import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoFormInput } from '@/src/component/FormInput';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { Add, CloseCircle } from '@/src/constants/icons';
import { useCreateBulletinMutation } from '@/src/store/api/bulletin.api';

const MAX_IMAGES = 3;

type TImageItem = {
  uri: string;
  type: string;
  name: string;
};

type TBulletinForm = {
  title: string;
  content: string;
  images: TImageItem[];
};

const CreateBulletinScreen: React.FC = () => {
  const navigation = useNavigation();
  const [createBulletin, { isLoading }] = useCreateBulletinMutation();

  //---------------------------------------
  const { watch, setValue } = useForm<TBulletinForm>({
    defaultValues: {
      title: '',
      content: '',
      images: [],
    },
  });

  const title = watch('title');
  const content = watch('content');
  const images = watch('images');

  //---------------------------------------
  const isDisableButton = React.useMemo(() => {
    return !title.trim() || content.trim().length < 10 || images.length === 0;
  }, [title, content, images]);

  //---------------------------------------
  const handlePickImage = React.useCallback(async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: MAX_IMAGES - images.length,
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.7,
    });

    if (result.didCancel || !result.assets) {
      return;
    }

    const picked: TImageItem[] = result.assets
      .filter(asset => asset.uri)
      .map(asset => ({
        uri: asset.uri!,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `image_${Date.now()}.jpg`,
      }));

    setValue('images', [...images, ...picked].slice(0, MAX_IMAGES));
  }, [images, setValue]);

  //---------------------------------------
  const handleRemoveImage = React.useCallback(
    (index: number) => {
      setValue(
        'images',
        images.filter((_, i) => i !== index),
      );
    },
    [images, setValue],
  );

  //---------------------------------------
  const handleSubmit = React.useCallback(async () => {
    if (content.length < 10) {
      Alert.alert('', '내용은 10자 이상 입력해주세요.');
      return;
    }

    try {
      await createBulletin({
        title,
        content,
        images,
      }).unwrap();
      navigation.goBack();
    } catch {
      Alert.alert('', '게시글 등록에 실패했습니다.');
    }
  }, [title, content, images, createBulletin, navigation]);

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <MemoScreenHeader title="게시글 작성" />

      <MemoScreenBody>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <MemoFormInput
            label="제목"
            placeholder="제목을입력해주세요"
            value={title}
            onChangeText={v => setValue('title', v)}
          />

          <View>
            <AppText variant="body7" color={AppColors.gray90}>
              내용(10자 이상){' '}
              <AppText variant="body7" color={AppColors.negative}>
                *
              </AppText>
            </AppText>
            <MemoFormInput
              label=""
              placeholder="내용을입력해주세요"
              value={content}
              onChangeText={v => setValue('content', v)}
              multiline
            />
          </View>

          <View style={styles.imageSection}>
            <View style={styles.imageSectionHeader}>
              <AppText variant="body7" color={AppColors.gray90}>
                첨부이미지(최대3장)
              </AppText>
              <AppText variant="body7" color={AppColors.gray90}>
                {images.length}/{MAX_IMAGES}
              </AppText>
            </View>

            <View style={styles.imageList}>
              {images.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: img.uri }} style={styles.imageThumb} />
                  <Pressable
                    style={styles.removeBtn}
                    hitSlop={4}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <CloseCircle
                      size={`${ms(20)}`}
                      color={AppColors.gray60}
                      variant="Bold"
                    />
                  </Pressable>
                </View>
              ))}

              {images.length < MAX_IMAGES && (
                <Pressable style={styles.addImageBtn} onPress={handlePickImage}>
                  <Add
                    size={`${ms(28)}`}
                    color={AppColors.gray40}
                    variant="Linear"
                  />
                </Pressable>
              )}
            </View>

            <AppText variant="detail" color={AppColors.gray50}>
              *이미지는 jpg, png최대 10MB까지 등록가능
            </AppText>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <MemoAppButton
            label="등록"
            onPress={handleSubmit}
            variant="primary"
            style={styles.submitBtn}
            disabled={isLoading || isDisableButton}
          />
        </View>
      </MemoScreenBody>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={AppColors.purple} />
        </View>
      )}
    </AppSafeAreaView>
  );
};

export const MemoCreateBulletinScreen = React.memo(CreateBulletinScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  scrollContent: {
    padding: ms(16),
    gap: ms(16),
  },
  imageSection: {
    gap: ms(8),
  },
  imageSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageList: {
    flexDirection: 'row',
    gap: ms(8),
  },
  imageWrapper: {
    position: 'relative',
  },
  imageThumb: {
    width: ms(109),
    height: ms(109),
    borderRadius: ms(8),
  },
  removeBtn: {
    position: 'absolute',
    top: -ms(6),
    right: -ms(6),
  },
  addImageBtn: {
    width: ms(109),
    height: ms(109),
    borderRadius: ms(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.gray10,
  },
  bottomContainer: {
    backgroundColor: AppColors.white,
    paddingVertical: ms(16),
    alignItems: 'center',
  },
  submitBtn: {
    width: ms(163),
    paddingVertical: ms(8),
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
