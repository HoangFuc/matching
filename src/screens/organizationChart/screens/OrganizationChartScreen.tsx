import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Add } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
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
  console.log('======================user', userRole);
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

      <MemoScreenHeader title="조직도" rightElement={rightElement} />

      <MemoScreenBody>
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
  scrollContent: {
    flexGrow: 1,
    padding: ms(16),
    gap: ms(12),
  },
});
