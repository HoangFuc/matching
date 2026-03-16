import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ms, s } from 'react-native-size-matters/extend';

import { AppColors } from '@/src/constants/colors';
import { AppText } from '../AppText';
import { MemoAppBottomSheet } from '../AppBottomSheet';

const ITEM_HEIGHT = s(40);
const VISIBLE_ITEMS = 5;

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

interface IProps {
  visible: boolean;
  value?: Date;
  onConfirm: (time: Date) => void;
  onCancel: () => void;
}

//---------------------------------------

const WheelColumn: React.FC<{
  data: number[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}> = ({ data, selectedIndex, onSelect }) => {
  const scrollRef = useRef<ScrollView>(null);
  const isUserScrolling = useRef(false);

  useEffect(() => {
    if (!isUserScrolling.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: selectedIndex * ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    }
  }, [selectedIndex]);

  //---------------------------------------

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
      onSelect(clampedIndex);
      isUserScrolling.current = false;
    },
    [data.length, onSelect],
  );

  //---------------------------------------

  const handleScrollBeginDrag = useCallback(() => {
    isUserScrolling.current = true;
  }, []);

  //---------------------------------------

  const paddingVertical = ((VISIBLE_ITEMS - 1) / 2) * ITEM_HEIGHT;

  return (
    <View style={styles.columnContainer}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollBeginDrag={handleScrollBeginDrag}
        contentContainerStyle={{ paddingVertical }}
        nestedScrollEnabled
      >
        {data.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <View key={index} style={styles.itemContainer}>
              <AppText
                variant={isSelected ? 'heading3' : 'body2'}
                color={isSelected ? AppColors.gray100 : AppColors.gray40}
              >
                {String(item).padStart(2, '0')}
              </AppText>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

//---------------------------------------

const TimePickerModal: React.FC<IProps> = ({
  visible,
  value,
  onConfirm,
  onCancel,
}) => {
  const [selectedHour, setSelectedHour] = useState(value?.getHours() ?? 0);
  const [selectedMinute, setSelectedMinute] = useState(value?.getMinutes() ?? 0);

  //---------------------------------------

  useEffect(() => {
    if (visible) {
      setSelectedHour(value?.getHours() ?? 0);
      setSelectedMinute(value?.getMinutes() ?? 0);
    }
  }, [visible, value]);

  //---------------------------------------

  const handleConfirm = useCallback(() => {
    const newDate = new Date(value ?? new Date());
    newDate.setHours(selectedHour);
    newDate.setMinutes(selectedMinute);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    onConfirm(newDate);
  }, [value, selectedHour, selectedMinute, onConfirm]);

  //---------------------------------------

  const footer = (
    <>
      <Pressable style={styles.cancelButton} onPress={onCancel}>
        <AppText variant="body1" color={AppColors.gray100}>
          취소
        </AppText>
      </Pressable>
      <Pressable style={styles.confirmButton} onPress={handleConfirm}>
        <AppText variant="body1" color={AppColors.purple}>
          확인
        </AppText>
      </Pressable>
    </>
  );

  return (
    <MemoAppBottomSheet
      visible={visible}
      onClose={onCancel}
      title="시간 선택"
      footer={footer}
      scrollable={false}
    >
      <View style={styles.pickerContainer}>
        <View style={styles.selectedIndicator} />
        <WheelColumn
          data={hours}
          selectedIndex={selectedHour}
          onSelect={setSelectedHour}
        />
        <WheelColumn
          data={minutes}
          selectedIndex={selectedMinute}
          onSelect={setSelectedMinute}
        />
      </View>
    </MemoAppBottomSheet>
  );
};

export const MemoTimePickerModal = React.memo(TimePickerModal);

//---------------------------------------

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: 'row',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    justifyContent: 'center',
  },
  columnContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * ((VISIBLE_ITEMS - 1) / 2),
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: AppColors.gray20,
    borderRadius: ms(8),
  },
  cancelButton: {
    flex: 1,
    height: s(48),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(25),
    backgroundColor: AppColors.gray20,
  },
  confirmButton: {
    flex: 1,
    height: s(48),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(25),
    backgroundColor: AppColors.lavendar,
  },
});
