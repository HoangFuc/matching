import React from 'react';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';
import { ArchiveBook, Data2 } from '@/src/constants/icons';

import { MemoMenuItem } from './MenuItem';

interface IGeneralMenuSectionProps {
  onPressOrgChart: () => void;
}

//---------------------------------------
const GeneralMenuSection: React.FC<IGeneralMenuSectionProps> = ({
  onPressOrgChart,
}) => {
  return (
    <MemoBaseCard>
      <MemoMenuItem
        icon={
          <Data2
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        }
        label="조직도"
        onPress={onPressOrgChart}
        gap={ms(6)}
        labelVariant="body6"
        isFirst
      />

      <MemoMenuItem
        icon={
          <ArchiveBook
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
          />
        }
        label="팀 미션"
        gap={ms(6)}
        labelVariant="body6"
        isLast
      />
    </MemoBaseCard>
  );
};

export const MemoGeneralMenuSection = React.memo(GeneralMenuSection);
