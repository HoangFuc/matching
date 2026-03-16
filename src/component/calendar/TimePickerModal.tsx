import React from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { MemoAppBottomSheet } from '@/src/component/AppBottomSheet';
import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';

interface IProps {
  visible: boolean;
  value?: string; // 'HH:mm'
  onConfirm: (time: string) => void; // returns 'HH:mm'
  onCancel: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const ITEM_HEIGHT = ms(40);
const VISIBLE_COUNT = 5;
const LIST_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;
const PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_COUNT / 2);
const pad = (n: number) => String(n).padStart(2, '0');

const parseTime = (value?: string) => {
  if (!value) return { hour: 0, minute: 0 };
  const [h, m] = value.split(':').map(Number);
  return { hour: h ?? 0, minute: m ?? 0 };
};

const TimePickerModal: React.FC<IProps> = ({
  visible,
  value,
  onConfirm,
  onCancel,
}) => {
  const { hour: initHour, minute: initMinute } = parseTime(value);

  const [selectedHour, setSelectedHour] = React.useState(initHour);
  const [selectedMinute, setSelectedMinute] = React.useState(initMinute);

  const hourListRef = React.useRef<ScrollView>(null);
  const minuteListRef = React.useRef<ScrollView>(null);

  //---------------------------------------
  React.useEffect(() => {
    if (visible) {
      const { hour, minute } = parseTime(value);
      setSelectedHour(hour);
      setSelectedMinute(minute);
      setTimeout(() => {
        hourListRef.current?.scrollTo({
          y: hour * ITEM_HEIGHT,
          animated: false,
        });
        minuteListRef.current?.scrollTo({
          y: minute * ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    }
  }, [visible, value]);

  //---------------------------------------
  const handleHourScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, HOURS.length - 1));
      setSelectedHour(clamped);
    },
    [],
  );

  //---------------------------------------
  const handleMinuteScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, MINUTES.length - 1));
      setSelectedMinute(clamped);
    },
    [],
  );

  //---------------------------------------
  const handleConfirm = React.useCallback(() => {
    onConfirm(`${pad(selectedHour)}:${pad(selectedMinute)}`);
  }, [selectedHour, selectedMinute, onConfirm]);

  //---------------------------------------
  const footerButtons = React.useMemo(
    () => (
      <>
        <MemoAppButton
          label="취소"
          variant="secondary"
          style={styles.actionButton}
          onPress={onCancel}
        />
        <MemoAppButton
          label="확인"
          variant="primary"
          style={styles.actionButton}
          onPress={handleConfirm}
        />
      </>
    ),
    [onCancel, handleConfirm],
  );

  return (
    <MemoAppBottomSheet
      visible={visible}
      onClose={onCancel}
      title="시간 선택"
      footer={footerButtons}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.pickerRow}>
        <View style={styles.selectedOverlay} pointerEvents="none" />

        {/* Hour */}
        <View style={[styles.listContainer, { height: LIST_HEIGHT }]}>
          <ScrollView
            ref={hourListRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={handleHourScroll}
            contentContainerStyle={{ paddingVertical: PADDING }}
            nestedScrollEnabled
          >
            {HOURS.map(item => {
              const isSelected = item === selectedHour;
              return (
                <View key={item} style={styles.item}>
                  <AppText
                    variant={isSelected ? 'body6' : 'body8'}
                    color={isSelected ? AppColors.gray100 : AppColors.gray40}
                  >
                    {pad(item)}
                  </AppText>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Minute */}
        <View style={[styles.listContainer, { height: LIST_HEIGHT }]}>
          <ScrollView
            ref={minuteListRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={handleMinuteScroll}
            contentContainerStyle={{ paddingVertical: PADDING }}
            nestedScrollEnabled
          >
            {MINUTES.map(item => {
              const isSelected = item === selectedMinute;
              return (
                <View key={item} style={styles.item}>
                  <AppText
                    variant={isSelected ? 'body6' : 'body8'}
                    color={isSelected ? AppColors.gray100 : AppColors.gray40}
                  >
                    {pad(item)}
                  </AppText>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </MemoAppBottomSheet>
  );
};

export const MemoTimePickerModal = React.memo(TimePickerModal);

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 0,
  },
  pickerRow: {
    flexDirection: 'row',
    position: 'relative',
  },
  listContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOverlay: {
    position: 'absolute',
    top: ITEM_HEIGHT * Math.floor(VISIBLE_COUNT / 2),
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: AppColors.gray10,
    borderRadius: ms(8),
  },
  actionButton: {
    flex: 1,
  },
});
