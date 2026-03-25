import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
  type StyleProp,
} from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppColors } from '@/src/constants/colors';
import { AppText } from './AppText';

interface IAppTooltipProps {
  text: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AppTooltip: React.FC<IAppTooltipProps> = ({ text, children, style }) => {
  const [visible, setVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0, width: 0 });
  const [tooltipWidth, setTooltipWidth] = React.useState(0);
  const anchorRef = React.useRef<View>(null);

  //---------------------------------------
  const handlePress = React.useCallback(() => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({ x, y: y + height + ms(4), width });
      setVisible(true);
    });
  }, []);

  //---------------------------------------
  const handleTooltipLayout = React.useCallback((e: LayoutChangeEvent) => {
    setTooltipWidth(e.nativeEvent.layout.width);
  }, []);

  const tooltipLeft = position.x + position.width / 2 - tooltipWidth / 2;

  return (
    <>
      <Pressable ref={anchorRef} onPress={handlePress} style={style}>
        {children}
      </Pressable>

      {visible && (
        <Modal
          transparent
          visible
          animationType="fade"
          onRequestClose={() => setVisible(false)}
        >
          <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
            <View
              style={[
                styles.tooltipBox,
                { top: position.y, left: tooltipLeft },
              ]}
              onLayout={handleTooltipLayout}
            >
              <View style={styles.arrow} />
              
              <AppText variant="body8" color={AppColors.white}>
                {text}
              </AppText>
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
};

export const MemoAppTooltip = React.memo(AppTooltip);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  tooltipBox: {
    position: 'absolute',
    backgroundColor: AppColors.gray90,
    paddingVertical: ms(6),
    paddingHorizontal: ms(10),
    borderRadius: ms(8),
    maxWidth: ms(250),
  },
  arrow: {
    position: 'absolute',
    top: -ms(6),
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: ms(6),
    borderRightWidth: ms(6),
    borderBottomWidth: ms(6),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: AppColors.gray90,
  },
});
