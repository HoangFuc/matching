import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoFormInput } from '@/src/component/FormInput';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import { Add, CloseCircle } from '@/src/constants/icons';

const MAX_IMAGES = 3;

type TImageItem = {
  uri: string;
};

const CreateBulletinScreen: React.FC = () => {
  const navigation = useNavigation();

  //---------------------------------------
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<TImageItem[]>([]);

  //---------------------------------------
  const handlePickImage = useCallback(() => {
    // TODO: integrate image picker library (e.g. react-native-image-picker)
    Alert.alert('Image Picker', 'Image picker will be integrated later.');
  }, []);

  //---------------------------------------
  const handleRemoveImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  //---------------------------------------
  const handleSubmit = useCallback(() => {
    if (content.length < 10) {
      Alert.alert('', '내용은 10자 이상 입력해주세요.');
      return;
    }

    // TODO: call API to create bulletin post
    navigation.goBack();
  }, [content, navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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
            onChangeText={setTitle}
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
              onChangeText={setContent}
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
          />
        </View>
      </MemoScreenBody>
    </SafeAreaView>
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
});
