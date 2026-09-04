import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TABULAR_FIGURES } from '../../../theme/appTheme';
import { useAppColors } from '../../../theme/useAppColors';
import { CalcField, FIELD_LABEL, FIELD_UNIT } from '../types/calcField';
import { BlinkingCaret } from './BlinkingCaret';

interface Props {
  field: CalcField;
  /** 표시할 값. 비어 있으면 흐린 `0`을 보여준다. */
  value: string;
  isActive: boolean;
  onPress: () => void;
}

/**
 * 값 한 줄. 탭하면 이 칸이 키패드 입력을 받는다.
 *
 * 시스템 키보드를 띄우지 않으려고 텍스트 입력 컴포넌트를 쓰지 않고 선택
 * 상태를 직접 그린다.
 */
export function ValueFieldRow({ field, value, isActive, onPress }: Props) {
  const colors = useAppColors();
  const isPlaceholder = value === '';

  return (
    <Pressable
      style={[
        styles.row,
        isActive && { backgroundColor: colors.primary + '1A' },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${FIELD_LABEL[field]} ${
        isPlaceholder ? '비어 있음' : value
      } ${FIELD_UNIT[field]}`}
      onPress={onPress}
    >
      <Text
        style={[
          styles.label,
          {
            color: isActive ? colors.primary : colors.onSurfaceVariant,
            fontWeight: isActive ? '600' : '400',
          },
        ]}
      >
        {FIELD_LABEL[field]}
      </Text>
      <Text
        style={[
          styles.value,
          {
            color: isPlaceholder
              ? colors.onSurfaceVariant + '59'
              : colors.onSurface,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {isPlaceholder ? '0' : value}
      </Text>
      {/* 활성 여부가 바뀔 때 값이 밀리지 않도록 커서 자리를 항상 비워 둔다. */}
      <View style={styles.caretSlot}>
        {isActive && <BlinkingCaret color={colors.primary} />}
      </View>
      {/* 단위를 고정폭 칸에 넣어 네 줄의 단위가 세로로 정렬되게 한다. */}
      <Text style={[styles.unit, { color: colors.onSurfaceVariant }]}>
        {FIELD_UNIT[field]}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  label: {
    fontSize: 14,
    marginRight: 12,
  },
  value: {
    flex: 1,
    textAlign: 'right',
    fontSize: 24,
    fontWeight: '600',
    fontVariant: [...TABULAR_FIGURES],
  },
  caretSlot: {
    width: 7,
    alignItems: 'flex-end',
  },
  unit: {
    width: 34,
    textAlign: 'right',
    fontSize: 16,
  },
});
