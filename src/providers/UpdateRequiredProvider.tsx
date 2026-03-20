import React, {createContext, useCallback, useEffect, useState} from 'react';
import {Linking, Modal, Pressable, StyleSheet, View} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {ms} from 'react-native-size-matters/extend';

import {AppText} from '@/src/component/AppText';
import {AppColors} from '@/src/constants/colors';
import {setGlobalShowUpdateRequired} from '@/src/utils/updateRequiredDispatcher';

const UpdateRequiredProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(false);
  const [updateUrl, setUpdateUrl] = useState('');

  //---------------------------------------

  const handleShow = useCallback((url: string) => {
    setUpdateUrl(url);
    setVisible(true);
  }, []);

  //---------------------------------------

  useEffect(() => {
    setGlobalShowUpdateRequired(handleShow);
  }, [handleShow]);

  //---------------------------------------

  const handleReject = useCallback(() => {
    setVisible(false);
  }, []);

  //---------------------------------------

  const handleUpgrade = useCallback(() => {
    if (updateUrl) {
      Linking.openURL(updateUrl);
    }
    setVisible(false);
  }, [updateUrl]);

  //---------------------------------------

  return (
    <>
      {children}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleReject}>
        <BlurView style={styles.blur} blurType="dark" blurAmount={8}>
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <AppText
                variant="heading3"
                color={AppColors.gray100}
                style={styles.title}>
                앱 업데이트 필요
              </AppText>

              <AppText
                variant="body7"
                color={AppColors.gray70}
                style={styles.message}>
                새로운 버전이 출시되었습니다.{'\n'}최신 버전으로 업데이트해
                주세요.
              </AppText>

              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.button, styles.rejectButton]}
                  onPress={handleReject}>
                  <AppText variant="body6" color={AppColors.gray70}>
                    닫기
                  </AppText>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.upgradeButton]}
                  onPress={handleUpgrade}>
                  <AppText variant="body6" color={AppColors.white}>
                    업데이트
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
    </>
  );
};

export const MemoUpdateRequiredProvider = React.memo(UpdateRequiredProvider);

const styles = StyleSheet.create({
  blur: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: AppColors.white,
    borderRadius: ms(16),
    paddingTop: ms(24),
    paddingBottom: ms(16),
    paddingHorizontal: ms(20),
    marginHorizontal: ms(32),
    width: '85%',
  },
  title: {
    textAlign: 'center',
    marginBottom: ms(12),
  },
  message: {
    textAlign: 'center',
    marginBottom: ms(24),
  },
  buttonRow: {
    flexDirection: 'row',
    gap: ms(10),
  },
  button: {
    flex: 1,
    paddingVertical: ms(12),
    borderRadius: ms(99),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButton: {
    backgroundColor: AppColors.gray20,
  },
  upgradeButton: {
    backgroundColor: AppColors.purple,
  },
});
