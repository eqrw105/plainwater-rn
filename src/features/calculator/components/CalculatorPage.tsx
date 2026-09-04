import React, { useReducer } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppStrings } from '../../../utils/appStrings';
import { PYEONG_PER_SQUARE_METER } from '../../../utils/areaConverter';
import { GUTTER, RADIUS } from '../../../theme/appTheme';
import { useAppColors } from '../../../theme/useAppColors';
import { calculatorReducer } from '../stores/calculatorReducer';
import { CalcField } from '../types/calcField';
import {
  initialCalculatorState,
  isEmpty,
  valueOf,
} from '../types/calculatorState';
import { Keypad } from './Keypad';
import { ValueFieldRow } from './ValueFieldRow';

/** 평수 계산기 화면. 앱의 유일한 화면이다. */
export function CalculatorPage() {
  const [state, dispatch] = useReducer(calculatorReducer, initialCalculatorState);
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  const row = (field: CalcField) => (
    <ValueFieldRow
      key={field}
      field={field}
      value={valueOf(state, field)}
      isActive={state.activeField === field}
      onPress={() => dispatch({ type: 'selectField', field })}
    />
  );

  const openPrivacyPolicy = async () => {
    let opened: boolean;
    try {
      await Linking.openURL(AppStrings.privacyPolicyUrl);
      opened = true;
    } catch {
      opened = false;
    }
    if (!opened) {
      Alert.alert(AppStrings.privacyPolicyOpenFailed);
    }
  };

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.surface,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.onSurface }]}>
          {AppStrings.appName}
        </Text>
        <Text style={[styles.headerNote, { color: colors.onSurfaceVariant }]}>
          1㎡ = {PYEONG_PER_SQUARE_METER.toString()}평
        </Text>
      </View>

      {/* 네 개의 값 줄. 가로·세로 묶음과 넓이·평수 묶음을 선으로 나눈다. */}
      <View
        style={[
          styles.valuePanel,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderColor: colors.outlineVariant,
          },
        ]}
      >
        {row('width')}
        {row('height')}
        <View
          style={[styles.divider, { backgroundColor: colors.outlineVariant }]}
        />
        {row('area')}
        {row('pyeong')}
      </View>

      <View style={styles.keypadArea}>
        <Keypad
          onDigit={(digit) => dispatch({ type: 'inputDigit', digit })}
          onDot={() => dispatch({ type: 'inputDot' })}
          onClear={() => dispatch({ type: 'reset' })}
          onBackspace={() => dispatch({ type: 'backspace' })}
          canClear={!isEmpty(state)}
          canBackspace={valueOf(state, state.activeField) !== ''}
        />
      </View>

      <Pressable
        style={styles.privacyLink}
        accessibilityRole="link"
        onPress={openPrivacyPolicy}
      >
        <Text style={[styles.privacyText, { color: colors.onSurfaceVariant }]}>
          {AppStrings.privacyPolicy}
        </Text>
      </Pressable>
    </View>
  );
}

/** 값 영역과 키패드의 높이 비율. */
const VALUE_PANEL_FLEX = 4;
const KEYPAD_FLEX = 6;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: GUTTER,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 8,
    paddingLeft: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  headerNote: {
    fontSize: 12,
  },
  valuePanel: {
    flex: VALUE_PANEL_FLEX,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: RADIUS,
    borderWidth: 1,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    marginHorizontal: 14,
  },
  keypadArea: {
    flex: KEYPAD_FLEX,
  },
  privacyLink: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyText: {
    fontSize: 12,
  },
});
