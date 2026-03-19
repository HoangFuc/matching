import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Add } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { AppColors } from '@/src/constants/colors';
import type { RootStackParamList } from '@/src/interface/tab.interface';
import type { THeadquarters } from '../type';
import { MemoDepartmentSection } from '../components/DepartmentSection';
import { MemoHqSelector } from '../components/HqSelector';

type Props = NativeStackScreenProps<RootStackParamList, 'OrganizationChart'>;

// Mock data — replace with API data
const MOCK_DATA: THeadquarters[] = [
  {
    id: 'hq-1',
    name: '제 1 본부',
    departments: [
      {
        id: 'dept-1',
        name: '1본부',
        teams: [
          {
            id: 'team-1',
            name: '1팀',
            members: [
              { id: 'm1', name: '홍길동', role: '팀장' },
              { id: 'm2', name: '논개', role: '팀원' },
            ],
          },
          {
            id: 'team-2',
            name: '2팀',
            members: [{ id: 'm3', name: '임꺽정', role: '팀장' }],
          },
          {
            id: 'team-3',
            name: '재무팀',
            members: [
              { id: 'm4', name: '차수현', role: '팀장' },
              { id: 'm5', name: '강민지', role: '팀원' },
              { id: 'm6', name: '윤서준', role: '팀원' },
            ],
          },
        ],
      },
      {
        id: 'dept-2',
        name: '2본부',
        teams: [
          {
            id: 'team-4',
            name: '1팀',
            members: [
              { id: 'm7', name: '홍길동', role: '팀장' },
              { id: 'm8', name: '논개', role: '팀원' },
            ],
          },
          {
            id: 'team-5',
            name: '마케팅팀',
            members: [
              { id: 'm9', name: '차수현', role: '팀장' },
              { id: 'm10', name: '강민지', role: '팀원' },
              { id: 'm11', name: '윤서준', role: '팀원' },
            ],
          },
        ],
      },
      {
        id: 'dept-3',
        name: '3본부',
        teams: [],
      },
    ],
  },
];

//---------------------------------------
const OrganizationChartScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedHqIndex, setSelectedHqIndex] = React.useState(0);
  const [showHqPicker, setShowHqPicker] = React.useState(false);

  const headquarters = MOCK_DATA;
  const currentHq = headquarters[selectedHqIndex];

  //---------------------------------------
  const handleToggleHqPicker = React.useCallback(() => {
    setShowHqPicker(prev => !prev);
  }, []);

  //---------------------------------------
  const handleSelectHq = React.useCallback((index: number) => {
    setSelectedHqIndex(index);
    setShowHqPicker(false);
  }, []);

  //---------------------------------------
  const handlePressAdd = React.useCallback(() => {
    navigation.navigate('OrgChartSetup', { hideStepBar: true });
  }, [navigation]);

  //---------------------------------------
  const handlePressEdit = React.useCallback(() => {
    // TODO: navigate to edit org chart
  }, []);

  //---------------------------------------
  const rightElement = React.useMemo(
    () => (
      <Pressable hitSlop={8} onPress={handlePressAdd}>
        <Add size={`${ms(24)}`} color={AppColors.white} variant="Linear" />
      </Pressable>
    ),
    [handlePressAdd],
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
          <MemoHqSelector
            headquarters={headquarters}
            selectedHqIndex={selectedHqIndex}
            showPicker={showHqPicker}
            onTogglePicker={handleToggleHqPicker}
            onSelectHq={handleSelectHq}
            onPressEdit={handlePressEdit}
          />

          {currentHq?.departments.map(dept => (
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
