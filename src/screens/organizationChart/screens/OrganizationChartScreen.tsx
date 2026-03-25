import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Add, Edit2 } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import type { RootStackParamList } from '@/src/interface/tab.interface';
import { ROLE_SLUGS } from '@/src/interface/auth.interface';
import { useUserRole } from '@/src/hooks/useUserRole';
import { useGetStructureQuery } from '@/src/store/api/auth.api';
import { MemoDepartmentSection } from '../components/DepartmentSection';

type Props = NativeStackScreenProps<RootStackParamList, 'OrganizationChart'>;

//---------------------------------------
const OrganizationChartScreen: React.FC<Props> = ({ navigation }) => {
  const userRole = useUserRole();
  const isDirector =
    userRole === ROLE_SLUGS.DIRECTOR || userRole === ROLE_SLUGS.DIRECTOR_2;

  const { data: structure, refetch } = useGetStructureQuery();

  //---------------------------------------
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  //---------------------------------------
  const handlePressAdd = React.useCallback(() => {
    navigation.navigate('OrgChartSetup', { hideStepBar: true });
  }, [navigation]);

  //---------------------------------------
  const rightElement = React.useMemo(
    () =>
      isDirector ? (
        <Pressable hitSlop={8} onPress={handlePressAdd}>
          <Add size={`${ms(24)}`} color={AppColors.white} variant="Linear" />
        </Pressable>
      ) : undefined,
    [isDirector, handlePressAdd],
  );

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.purple} />

      <MemoScreenHeader
        title="조직도"
        rightElement={rightElement}
        onPressBack={() => navigation.navigate('MainTabs', { screen: 'Home', params: { screen: 'Dashboard' } })}
      />

      <MemoScreenBody>
        <View style={styles.hqHeader}>
          <AppText variant="body6" color={AppColors.gray90}> 
            제 1 본부
          </AppText>

          {isDirector && (
            <Pressable
              hitSlop={8}
              style={styles.editButton}
            >
              <Edit2
                size={`${ms(20)}`}
                color={AppColors.gray90}
                variant="Linear"
              />
            </Pressable>
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {structure?.departments.map(dept => (
            <MemoDepartmentSection key={dept.id} department={dept} />
          ))}
        </ScrollView>
      </MemoScreenBody>
    </AppSafeAreaView>
  );
};

export const MemoOrganizationChartScreen = React.memo(OrganizationChartScreen);

//---------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  hqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
  },
  editButton: {
    borderRadius: ms(8),
    padding: ms(4),
    backgroundColor: AppColors.gray20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: ms(16),
    gap: ms(12),
    marginTop: ms(8)
  },
});
