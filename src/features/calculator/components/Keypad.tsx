import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppStrings } from '../../../utils/appStrings';
import { TABULAR_FIGURES } from '../../../theme/appTheme';
import { useAppColors } from '../../../theme/useAppColors';
import { KeypadButton } from './KeypadButton';

interface Props {
  onDigit: (digit: number) => void;
  onDot: () => void;
  onClear: () => void;
  onBackspace: () => void;
  /** 비울 값이 남아 있는지. 아니면 `C`를 비활성으로 둔다. */
  canClear: boolean;
  /** 활성 칸에 지울 글자가 있는지. 아니면 `지우기`를 비활성으로 둔다. */
  canBackspace: boolean;
}

const DIGIT_ROWS = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
] as const;

/** 숫자 키패드. 3×4 그리드 아래에 전폭 `지우기`. */
export function Keypad({
  onDigit,
  onDot,
  onClear,
  onBackspace,
  canClear,
  canBackspace,
}: Props) {
  const colors = useAppColors();

  const digitButton = (digit: number) => (
    <KeypadButton
      key={digit}
      background={colors.surfaceContainerHigh}
      foreground={colors.onSurface}
      accessibilityLabel={String(digit)}
      onPress={() => onDigit(digit)}
    >
      {(color) => <Text style={[styles.key, { color }]}>{digit}</Text>}
    </KeypadButton>
  );

  return (
    <View style={styles.keypad}>
      {DIGIT_ROWS.map((row) => (
        <View key={row[0]} style={styles.row}>
          {row.map(digitButton)}
        </View>
      ))}
      <View style={styles.row}>
        <KeypadButton
          background={colors.errorContainer}
          foreground={colors.onErrorContainer}
          accessibilityLabel="전체 지우기"
          onPress={canClear ? onClear : undefined}
        >
          {(color) => <Text style={[styles.key, { color }]}>{AppStrings.clear}</Text>}
        </KeypadButton>
        {digitButton(0)}
        <KeypadButton
          background={colors.surfaceContainerHigh}
          foreground={colors.onSurface}
          accessibilityLabel="소수점"
          onPress={onDot}
        >
          {(color) => <Text style={[styles.key, { color }]}>{AppStrings.dot}</Text>}
        </KeypadButton>
      </View>
      <View style={styles.row}>
        <KeypadButton
          background={colors.primaryContainer}
          foreground={colors.onPrimaryContainer}
          accessibilityLabel={AppStrings.backspace}
          onPress={canBackspace ? onBackspace : undefined}
        >
          {(color) => (
            <>
              <Text style={[styles.backspaceIcon, { color }]}>⌫</Text>
              <Text style={[styles.backspaceLabel, { color }]}>
                {AppStrings.backspace}
              </Text>
            </>
          )}
        </KeypadButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  keypad: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  key: {
    fontSize: 28,
    fontWeight: '600',
    fontVariant: [...TABULAR_FIGURES],
  },
  backspaceIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  backspaceLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
