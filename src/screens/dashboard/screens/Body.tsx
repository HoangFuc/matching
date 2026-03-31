import React from "react";
import { RefreshControl, StyleSheet, View } from "react-native";

import { moderateScale as ms } from "react-native-size-matters/extend";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

import { AppColors } from "@/src/constants/colors";
import { DashboardRefreshContext } from "../context/DashboardRefreshContext";

import { MemoScreenBody } from "@/src/component/ScreenBody";
import { MemoCalendarAction } from "../component/body/CalendarAction";
import { MemoDraft } from "../component/body/Draft";
import { MemoMeetingSchedule } from "../component/body/MeetingSchedule";
import { MemoMoreActions } from "../component/body/MoreActions";
import { MemoRanking } from "../component/body/Ranking";

const GRADIENT_HEIGHT = ms(24);
const GRADIENT_STEPS = 20;

const GRADIENT_OPACITIES = Array.from({ length: GRADIENT_STEPS }, (_, i) => {
  const ratio = i / (GRADIENT_STEPS - 1);
  return 1 - ratio * ratio;
});

//---------------------------------------

const GradientOverlay: React.FC = React.memo(() => {
  return (
    <View style={styles.gradientContainer} pointerEvents="none">
      {GRADIENT_OPACITIES.map((opacity, i) => (
        <View
          key={i}
          style={[styles.gradientStep, { opacity }]}
        />
      ))}
    </View>
  );
});

//---------------------------------------

const BodyDashboard: React.FC = () => {
  const scrollY = useSharedValue(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  //---------------------------------------

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  //---------------------------------------

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  //---------------------------------------

  const ms16 = ms(16);

  const animatedPaddingStyle = useAnimatedStyle(() => ({
    paddingTop: interpolate(
      scrollY.value,
      [0, ms16],
      [ms16, 0],
      Extrapolation.CLAMP,
    ),
  }));

  //---------------------------------------

  const animatedGradientStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, ms16],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  //---------------------------------------

  return (
    <DashboardRefreshContext.Provider value={refreshKey}>
      <MemoScreenBody style={styles.body}>
        <Animated.View style={[styles.gradientWrapper, animatedGradientStyle]} pointerEvents="none">
          <GradientOverlay />
        </Animated.View>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[AppColors.purple]}
              tintColor={AppColors.purple}
            />
          }
        >
          <Animated.View style={animatedPaddingStyle}>
            <MemoCalendarAction />

            <MemoRanking />

            <MemoMeetingSchedule />

            <MemoMoreActions />

            <MemoDraft />
          </Animated.View>
        </Animated.ScrollView>
      </MemoScreenBody>
    </DashboardRefreshContext.Provider>
  );
};

export const MemoBodyDashboard = React.memo(BodyDashboard);

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: ms(16),
  },
  gradientWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  gradientContainer: {
    height: GRADIENT_HEIGHT,
    flexDirection: "column",
  },
  gradientStep: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
