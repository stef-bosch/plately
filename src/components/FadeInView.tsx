import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

// Native driver runs animations off the JS thread on iOS/Android. On web it's
// unsupported (and warns), so we fall back to the JS driver there — fine for
// short, one-shot opacity/transform tweens like these.
const USE_NATIVE_DRIVER = Platform.OS !== 'web';

interface FadeInViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Stagger start, in ms. */
  delay?: number;
  /** How far it slides up while fading in, in px. */
  offset?: number;
  duration?: number;
}

/**
 * Fades + slides its children in on mount. Used to give screens and list items
 * a gentle entrance so navigating and scrolling feels alive without any
 * per-frame work during scrolling.
 */
export function FadeInView({
  children,
  style,
  delay = 0,
  offset = 14,
  duration = 320,
}: FadeInViewProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: USE_NATIVE_DRIVER,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, delay, duration]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [offset, 0],
  });

  return (
    <Animated.View
      style={[style, { opacity: progress, transform: [{ translateY }] }]}
    >
      {children}
    </Animated.View>
  );
}
