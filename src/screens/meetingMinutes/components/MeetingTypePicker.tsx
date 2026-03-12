import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBottomSheetModal } from '@/src/component/BottomSheetModal';
import { AppColors } from '@/src/constants/colors';
import { MEETING_TYPE_CONFIG } from '@/src/constants/meetingMinutes';
import { TMeetingTypeLabel } from '@/src/interface/meetingMinutes.interface';

const MEETING_TYPES = Object.keys(MEETING_TYPE_CONFIG) as TMeetingTypeLabel[];

interface IProps {
  visible: boolean;
  onSelect: (type: TMeetingTypeLabel) => void;
  onClose: () => void;
}

const MeetingTypePicker: React.FC<IProps> = ({
  visible,
  onSelect,
  onClose,
}) => {
  return (
    <MemoBottomSheetModal
      visible={visible}
      onClose={onClose}
      title="선택"
      sheetStyle={styles.sheet}
    >
      <View style={styles.optionContainer}>
        {MEETING_TYPES.map(type => {
          return (
            <Pressable
              key={type}
              onPress={() => {
                onSelect(type);
                onClose();
              }}
            >
              <AppText
                variant="body4"
                color={AppColors.gray100}
                style={styles.text}
              >
                {type}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </MemoBottomSheetModal>
  );
};

export const MemoMeetingTypePicker = React.memo(MeetingTypePicker);

const styles = StyleSheet.create({
  sheet: {
    alignItems: 'center',
  },
  optionContainer: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(24),
    gap: ms(16),
  },
  text: {
    textAlign: 'center',
  },
});
