import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet } from 'react-native';

interface Props {
  color: string;
  height?: number;
}

/**
 * 입력을 받고 있는 칸 끝에서 깜빡이는 커서.
 *
 * 시스템 키보드를 쓰지 않으므로 `TextInput`의 커서도 없다. 어느 칸에 숫자가
 * 들어가는지 알려주는 역할을 이 컴포넌트가 대신한다.
 */
export function BlinkingCaret({ color, height = 26 }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  // 접근성 설정에서 애니메이션을 껐다면 깜빡이지 않고 그냥 보여준다.
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1);
      return;
    }
    // 1100ms 주기: 45% 켜짐, 55% 꺼짐.
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(495),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 0,
          easing: Easing.step0,
          useNativeDriver: true,
        }),
        Animated.delay(605),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, reduceMotion]);

  return (
    <Animated.View
      style={[styles.bar, { backgroundColor: color, height, opacity }]}
    />
  );
}

const styles = StyleSheet.create({
  bar: {
    width: 2,
    borderRadius: 1,
  },
});
