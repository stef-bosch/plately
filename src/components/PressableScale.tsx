import React, { useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Scale applied while pressed. */
  scaleTo?: number;
}

/**
 * A Pressable that springs slightly smaller while held, for a tactile,
 * high-end feel on cards and buttons. Pure transform, so it stays smooth.
 */
export function PressableScale({
  children,
  style,
  scaleTo = 0.97,
  onPressIn,
  onPressOut,
  ...rest
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: USE_NATIVE_DRIVER,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(event: GestureResponderEvent) => {
        animateTo(scaleTo);
        onPressIn?.(event);
      }}
      onPressOut={(event: GestureResponderEvent) => {
        animateTo(1);
        onPressOut?.(event);
      }}
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedPressable>
  );
}
