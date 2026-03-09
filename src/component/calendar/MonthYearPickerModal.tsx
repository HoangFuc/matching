import React from 'react';
import {
  Dimensions,
  FlatList,
  type ListRenderItemInfo,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoBottomSheetModal } from '@/src/component/BottomSheetModal';
import { AppColors } from '@/src/constants/colors';
import { ArrowLeft2, ArrowRight2 } from '@/src/constants/icons';

interface IProps {
  visible: boolean;
  year: number;
  month: number;
  onClose: () => void;
  onConfirm: (year: number, month: number) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i);
const CONTENT_PADDING = ms(16);
const PAGE_WIDTH =
  Dimensions.get('window').width - CONTENT_PADDING * 2 - CONTENT_PADDING * 2;
const DECADE_PAGES = Array.from({ length: 21 }, (_, i) => 1900 + i * 10);
const ARROW_SIZE = `${ms(20)}`;

const getDecadeStart = (y: number) => Math.floor(y / 10) * 10;
const getDecadeIndex = (y: number) =>
  Math.max(0, DECADE_PAGES.indexOf(getDecadeStart(y)));

const MonthYearPickerModal: React.FC<IProps> = ({
  visible,
  year,
  month,
  onClose,
  onConfirm,
}) => {
  const [tempYear, setTempYear] = React.useState(year);
  const [tempMonth, setTempMonth] = React.useState(month);
  const [pickingYear, setPickingYear] = React.useState(false);
  const [visibleDecade, setVisibleDecade] = React.useState(() =>
    getDecadeStart(year),
  );

  //---------------------------------------
  const headerLabel = React.useMemo(
    () =>
      pickingYear
        ? `${visibleDecade}년 - ${visibleDecade + 9}년`
        : `${tempYear}년`,
    [pickingYear, visibleDecade, tempYear],
  );

  //---------------------------------------
  const flatListRef = React.useRef<FlatList<number>>(null);

  //---------------------------------------
  const scrollToDecade = React.useCallback((y: number, animated = false) => {
    const idx = getDecadeIndex(y);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: idx, animated });
    }, 50);
  }, []);

  //---------------------------------------
  const handleNavigate = React.useCallback(
    (direction: 1 | -1) => {
      if (pickingYear) {
        setVisibleDecade(prev => {
          const next = prev + direction * 10;
          const idx = DECADE_PAGES.indexOf(next);
          if (idx >= 0) {
            flatListRef.current?.scrollToIndex({ index: idx, animated: true });
          }
          return idx >= 0 ? next : prev;
        });
      } else {
        setTempYear(prev => prev + direction);
      }
    },
    [pickingYear],
  );

  //---------------------------------------
  const handleYearPress = React.useCallback(() => {
    setVisibleDecade(getDecadeStart(tempYear));
    setPickingYear(true);
    scrollToDecade(tempYear);
  }, [tempYear, scrollToDecade]);

  //---------------------------------------
  const handleSelectYear = React.useCallback((y: number) => {
    setTempYear(y);
    setPickingYear(false);
  }, []);

  //---------------------------------------
  const handleConfirm = React.useCallback(() => {
    onConfirm(tempYear, tempMonth);
    onClose();
  }, [tempYear, tempMonth, onConfirm, onClose]);

  //---------------------------------------
  const handleMomentumScrollEnd = React.useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const pageIndex = Math.round(e.nativeEvent.contentOffset.x / PAGE_WIDTH);
      const newDecade = DECADE_PAGES[pageIndex];
      if (newDecade !== undefined) {
        setVisibleDecade(newDecade);
      }
    },
    [],
  );

  //---------------------------------------
  const renderDecadePage = React.useCallback(
    ({ item: pageStart }: ListRenderItemInfo<number>) => {
      const years = Array.from({ length: 12 }, (_, i) => pageStart + i);
      return (
        <View style={[styles.monthGrid, { width: PAGE_WIDTH }]}>
          {years.map(y => {
            const isSelected = y === tempYear;
            const isOutOfRange = y > pageStart + 9;
            return (
              <Pressable
                key={y}
                style={[
                  styles.monthCell,
                  isSelected && styles.monthCellSelected,
                ]}
                onPress={() => handleSelectYear(y)}
              >
                <AppText
                  variant={isSelected ? 'body6' : 'body8'}
                  color={
                    isSelected
                      ? AppColors.purple
                      : isOutOfRange
                      ? AppColors.gray30
                      : AppColors.gray90
                  }
                >
                  {y}년
                </AppText>
              </Pressable>
            );
          })}
        </View>
      );
    },
    [tempYear, handleSelectYear],
  );

  //---------------------------------------
  const getItemLayout = React.useCallback(
    (_: unknown, index: number) => ({
      length: PAGE_WIDTH,
      offset: PAGE_WIDTH * index,
      index,
    }),
    [],
  );

  //---------------------------------------
  const keyExtractor = React.useCallback((item: number) => item.toString(), []);

  //---------------------------------------
  React.useEffect(() => {
    if (visible) {
      setTempYear(year);
      setTempMonth(month);
      setPickingYear(false);
      setVisibleDecade(getDecadeStart(year));
      scrollToDecade(year);
    }
  }, [visible, year, month, scrollToDecade]);

  return (
    <MemoBottomSheetModal visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <View style={styles.yearSelector}>
          <Pressable onPress={() => handleNavigate(-1)} hitSlop={8}>
            <ArrowLeft2
              size={ARROW_SIZE}
              color={AppColors.gray90}
              variant="Linear"
            />
          </Pressable>

          <Pressable onPress={handleYearPress}>
            <AppText variant="body5" color={AppColors.gray90}>
              {headerLabel}
            </AppText>
          </Pressable>

          <Pressable onPress={() => handleNavigate(1)} hitSlop={8}>
            <ArrowRight2
              size={ARROW_SIZE}
              color={AppColors.gray90}
              variant="Linear"
            />
          </Pressable>
        </View>

        {pickingYear ? (
          <FlatList
            ref={flatListRef}
            data={DECADE_PAGES}
            keyExtractor={keyExtractor}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={getDecadeIndex(tempYear)}
            getItemLayout={getItemLayout}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            style={styles.flatList}
            renderItem={renderDecadePage}
          />
        ) : (
          <View style={styles.monthGrid}>
            {MONTHS.map(m => {
              const isSelected = m === tempMonth;
              return (
                <Pressable
                  key={m}
                  style={[
                    styles.monthCell,
                    isSelected && styles.monthCellSelected,
                  ]}
                  onPress={() => setTempMonth(m)}
                >
                  <AppText
                    variant={isSelected ? 'body6' : 'body8'}
                    color={isSelected ? AppColors.purple : AppColors.gray90}
                  >
                    {m + 1}월
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={styles.actions}>
          <MemoAppButton
            label="취소"
            variant="secondary"
            style={styles.actionButton}
            onPress={onClose}
          />
          <MemoAppButton
            label="확인"
            variant="primary"
            style={styles.actionButton}
            onPress={handleConfirm}
          />
        </View>
      </View>
    </MemoBottomSheetModal>
  );
};

export const MemoMonthYearPickerModal = React.memo(MonthYearPickerModal);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(24),
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ms(16),
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthCell: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(4),
    borderRadius: ms(100),
    paddingHorizontal: ms(6),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  monthCellSelected: {
    borderColor: AppColors.purple,
  },
  flatList: {
    width: PAGE_WIDTH,
  },
  actions: {
    flexDirection: 'row',
    gap: ms(8),
    marginTop: ms(16),
  },
  actionButton: {
    flex: 1,
  },
});
