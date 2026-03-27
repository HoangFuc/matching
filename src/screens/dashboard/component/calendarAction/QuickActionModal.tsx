import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ms } from 'react-native-size-matters/extend';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/src/component/AppText';
import { MemoUnderDevelopmentModal } from '@/src/component/UnderDevelopmentModal';
import { AppColors } from '@/src/constants/colors';
import {
  Add,
  Calendar,
  ClipboardText,
  DocumentText,
} from '@/src/constants/icons';
import { CardShadow } from '@/src/constants/shadows';
import { useOverlay } from '@/src/providers/OverlayProvider';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ICON_SIZE = ms(24);
const ICON_COLOR = AppColors.purple;

const ACTIONS = [
  {
    key: 'schedule',
    label: '일정 등록',
    Icon: Calendar,
  },
  {
    key: 'meeting',
    label: '미팅록 작성',
    Icon: ClipboardText,
  },
  {
    key: 'draft',
    label: '기안 등록',
    Icon: DocumentText,
  },
];

//---------------------------------------

const QuickActionFAB: React.FC = () => {
  const { overlayVisible: expanded, setOverlayVisible } = useOverlay();
  const insets = useSafeAreaInsets();
  const rotation = useSharedValue(0);
  const [showDevModal, setShowDevModal] = useState(false);

  //---------------------------------------

  React.useEffect(() => {
    rotation.value = withSpring(expanded ? 1 : 0, {
      damping: 12,
      stiffness: 180,
    });
  }, [expanded, rotation]);

  //---------------------------------------

  const toggle = React.useCallback(() => {
    setOverlayVisible(!expanded);
  }, [expanded, setOverlayVisible]);

  //---------------------------------------

  const handleAction = React.useCallback(
    (_key: string) => {
      toggle();
      setShowDevModal(true);
    },
    [toggle],
  );

  //---------------------------------------

  const handleCloseDevModal = React.useCallback(() => {
    setShowDevModal(false);
  }, []);

  //---------------------------------------

  const fabIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 45}deg` }],
  }));

  //---------------------------------------

  return (
    <>
      <View
        style={[styles.wrapper, { bottom: ms(116) + insets.bottom }]}
        pointerEvents="box-none"
      >
        <View style={styles.row}>
          {expanded && (
            <Animated.View
              style={styles.actionsRow}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              layout={LinearTransition}
            >
              {ACTIONS.map(action => (
                <Pressable
                  key={action.key}
                  style={styles.actionItem}
                  onPress={() => handleAction(action.key)}
                >
                  <View style={styles.iconCircle}>
                    <action.Icon
                      size={ICON_SIZE}
                      color={ICON_COLOR}
                      variant="Linear"
                      style={{ borderWidth: ms(1.5) }}
                    />
                    <AppText variant="detail" color={AppColors.purple}>
                      {action.label}
                    </AppText>
                  </View>
                </Pressable>
              ))}
            </Animated.View>
          )}

          <AnimatedPressable style={styles.fab} onPress={toggle}>
            <Animated.View style={fabIconStyle}>
              <Add
                size={`${ms(28)}`}
                color={expanded ? AppColors.negative : AppColors.purple}
                variant="Linear"
              />
            </Animated.View>
          </AnimatedPressable>
        </View>
      </View>

      <MemoUnderDevelopmentModal
        visible={showDevModal}
        onClose={handleCloseDevModal}
      />
    </>
  );
};

export const MemoQuickActionFAB = React.memo(QuickActionFAB);

//---------------------------------------

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'flex-end',
    paddingRight: ms(16),
    zIndex: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(16),
    marginRight: ms(12),
  },
  actionItem: {
    alignItems: 'center',
    gap: ms(4),
  },
  iconCircle: {
    width: ms(74),
    height: ms(74),
    borderRadius: ms(33),
    backgroundColor: AppColors.lavendar,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(4),
    borderColor: AppColors.white,
    borderWidth: 2,
  },
  fab: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(100),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: AppColors.white,
    ...CardShadow,
  },
});
