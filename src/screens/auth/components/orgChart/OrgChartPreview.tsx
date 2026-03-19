import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ArrowRight2, Buildings, User } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';

interface IOrgChartPreviewProps {
  directorName: string;
  totalDepartments: number;
  totalTeams: number;
}

const OrgChartPreview: React.FC<IOrgChartPreviewProps> = ({
  directorName,
  totalDepartments,
  totalTeams,
}) => (
  <MemoBaseCard style={styles.card}>
    <AppText variant="body6" color={AppColors.gray90}>
      미리보기
    </AppText>

    <View style={styles.flow}>
      <View style={[styles.tag, { backgroundColor: AppColors.warmIvory }]}>
        <View style={{ flexDirection: 'row' }}>
          <AppText variant="body8" color={AppColors.burntOrange}>
            총괄{' '}
          </AppText>
          <AppText variant="body6" color={AppColors.burntOrange}>
            {directorName}
          </AppText>
        </View>
      </View>

      <ArrowRight2 size={ms(14)} color={AppColors.gray50} variant="Linear" />

      <View style={[styles.tag, { backgroundColor: AppColors.lightLime }]}>
        <Buildings size={ms(14)} color={AppColors.green} variant="Linear" />
        <AppText variant="body6" color={AppColors.green}>
          {`본부 ${totalDepartments}개`}
        </AppText>
      </View>

      <ArrowRight2 size={ms(14)} color={AppColors.gray50} variant="Linear" />

      <View style={[styles.tag, { backgroundColor: AppColors.lightBlue }]}>
        <User size={ms(14)} color={AppColors.strongBlue} variant="Linear" />
        <AppText variant="body6" color={AppColors.strongBlue}>
          {`팀 ${totalTeams}개`}
        </AppText>
      </View>
    </View>

    <AppText variant="detail" color={AppColors.gray80}>
      * 설정한 조직 구조는 나중에 팀 관리 메뉴에서 변경할 수 있습니다.
    </AppText>
  </MemoBaseCard>
);

export const MemoOrgChartPreview = React.memo(OrgChartPreview);

const styles = StyleSheet.create({
  card: {
    gap: ms(12),
    height: ms(121),
  },
  flow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    flexWrap: 'wrap',
  },
  tag: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
    borderRadius: ms(100),
    gap: ms(4),
  },
});
