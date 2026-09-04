import * as Haptics from 'expo-haptics';
import React, { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useAppColors } from '../../../theme/useAppColors';

interface Props {
  background: string;
  foreground: string;
  /** `undefined`이면 비활성. */
  onPress?: () => void;
  accessibilityLabel: string;
  children: (color: string, pressed: boolean) => ReactNode;
}

/** 키패드 버튼 하나. */
export function KeypadButton({
  background,
  foreground,
  onPress,
  accessibilityLabel,
  children,
}: Props) {
  const colors = useAppColors();
  const isEnabled = onPress !== undefined;

  // 비활성일 때 알파만 낮추면 다크 모드에서 배경과 섞여 여전히 눌릴 것처럼
  // 보인다. Material 3의 비활성 표현(표면 12%, 내용 38%)을 쓴다.
  const backgroundColor = isEnabled ? background : alpha(colors.onSurface, 0.12);
  const foregroundColor = isEnabled ? foreground : alpha(colors.onSurface, 0.38);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        pressed && isEnabled && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !isEnabled }}
      disabled={!isEnabled}
      onPress={() => {
        Haptics.selectionAsync();
        onPress?.();
      }}
    >
      {({ pressed }) => children(foregroundColor, pressed)}
    </Pressable>
  );
}

function alpha(hex: string, opacity: number): string {
  const byte = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return hex + byte;
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 4,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pressed: {
    opacity: 0.7,
  },
});
