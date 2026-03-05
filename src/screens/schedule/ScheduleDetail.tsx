import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { ArrowLeft2, Sort } from "iconsax-react-nativejs";
import { moderateScale as ms, scale as s } from "react-native-size-matters/extend";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/src/component/AppText";
import { AppColors } from "@/src/constants/colors";
import { TScheduleEvent } from "@/src/interface/schedule.interface";
import type { ScheduleStackParamList } from "@/src/interface/tab.interface";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"] as const;

const formatDateHeader = (dateKey: string): string => {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const yy = String(y).slice(2);
  const dayName = DAY_NAMES[date.getDay()];
  return `${yy}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")} (${dayName})`;
};

// ── Event Card ───────────────────────────────────────
interface IEventCardProps {
  event: TScheduleEvent;
}

const EventCard: React.FC<IEventCardProps> = ({ event }) => {
  return (
    <View style={cardStyles.container}>
      <View style={cardStyles.row}>
        <AppText variant="body6" color={AppColors.gray80}>
          일정 종류
        </AppText>
        <View
          style={[cardStyles.badge, { backgroundColor: event.backgroundColor }]}
        >
          <AppText variant="detail" color={event.color}>
            {event.type || event.title}
          </AppText>
        </View>
      </View>

      <View style={cardStyles.row}>
        <AppText variant="body6" color={AppColors.gray80}>
          일정명
        </AppText>
        <AppText variant="body8" color={AppColors.gray90}>
          {event.title}
        </AppText>
      </View>

      <View style={cardStyles.row}>
        <AppText variant="body6" color={AppColors.gray80}>
          일정내용
        </AppText>
        <AppText
          variant="body8"
          color={AppColors.gray90}
          style={cardStyles.descriptionText}
        >
          {event.description || "-"}
        </AppText>
      </View>
    </View>
  );
};

// ── Main Screen ──────────────────────────────────────
const ScheduleDetail: React.FC = () => {
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<ScheduleStackParamList, "ScheduleDetail">>();
  const { dateKey, events } = route.params;

  const handlePressBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={handlePressBack}>
          <ArrowLeft2
            size={`${ms(24)}`}
            color={AppColors.white}
            variant="Linear"
          />
        </Pressable>

        <AppText variant="heading3" color={AppColors.white}>
          일정
        </AppText>

        <Pressable hitSlop={8}>
          <Sort
            size={`${ms(24)}`}
            color={AppColors.white}
            variant="Linear"
          />
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Date navigation */}
        <View style={styles.dateHeader}>
          <Pressable hitSlop={8} onPress={handlePressBack}>
            <ArrowLeft2
              size={`${ms(20)}`}
              color={AppColors.gray90}
              variant="Linear"
            />
          </Pressable>

          <AppText variant="heading3" color={AppColors.gray100}>
            {formatDateHeader(dateKey)}
          </AppText>
        </View>

        {/* Event list */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}

          {events.length === 0 && (
            <View style={styles.emptyContainer}>
              <AppText variant="body4" color={AppColors.gray50}>
                등록된 일정이 없습니다.
              </AppText>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export const MemoScheduleDetail = React.memo(ScheduleDetail);

// ── Styles ───────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ms(16),
    paddingBottom: ms(24),
    backgroundColor: AppColors.purple,
    borderRadius: ms(100),
    width: s(375),
    height: s(49),
  },
  content: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(8),
    paddingHorizontal: ms(16),
    paddingTop: ms(24),
    paddingBottom: ms(16),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ms(16),
    paddingBottom: ms(40),
    gap: ms(16),
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: ms(40),
  },
});

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: AppColors.gray30,
    paddingHorizontal: ms(16),
    paddingVertical: ms(16),
    gap: ms(12),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(12),
  },
  badge: {
    borderRadius: ms(4),
    paddingHorizontal: ms(8),
    paddingVertical: ms(2),
  },
  descriptionText: {
    flex: 1,
  },
});
