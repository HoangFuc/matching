import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);
  const maxOffset = 0;
  const minOffset = -(data.length - 1) * ITEM_HEIGHT;

  //---------------------------------------

  useEffect(() => {
    translateY.value = withTiming(-selectedIndex * ITEM_HEIGHT, {
      duration: 200,
    });
  }, [selectedIndex, translateY]);

  //---------------------------------------

  const snapToNearest = useCallback(
    (currentY: number) => {
      'worklet';
      const index = Math.round(-currentY / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
      translateY.value = withTiming(-clampedIndex * ITEM_HEIGHT, {
        duration: 200,
      });
      runOnJS(onSelect)(clampedIndex);
    },
    [data.length, onSelect, translateY],
  );

  //---------------------------------------

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate(e => {
      const newY = startY.value + e.translationY;
      translateY.value = Math.max(minOffset, Math.min(maxOffset, newY));
    })
    .onEnd(e => {
      const projected =
        translateY.value + e.velocityY * 0.15;
      const clamped = Math.max(minOffset, Math.min(maxOffset, projected));
      snapToNearest(clamped);
    });

  //---------------------------------------

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const paddingVertical = ((VISIBLE_ITEMS - 1) / 2) * ITEM_HEIGHT;

  return (
    <View style={styles.columnContainer}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[animatedStyle, { paddingVertical }]}
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
        </Animated.View>
      </GestureDetector>
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
  const [selectedMinute, setSelectedMinute] = useState(
    value?.getMinutes() ?? 0,
  );

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
