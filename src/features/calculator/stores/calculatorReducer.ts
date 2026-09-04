import Decimal from 'decimal.js';

import {
  format,
  squareMeter,
  toPyeong,
  toSquareMeter,
  tryParse,
} from '../../../utils/areaConverter';
import { CalcField } from '../types/calcField';
import {
  CalculatorState,
  initialCalculatorState,
  valueOf,
} from '../types/calculatorState';

/** 한 칸에 입력할 수 있는 최대 글자 수. */
export const MAX_INPUT_LENGTH = 12;

export type CalculatorAction =
  | { type: 'selectField'; field: CalcField }
  | { type: 'inputDigit'; digit: number }
  | { type: 'inputDot' }
  | { type: 'backspace' }
  | { type: 'reset' };

/** 키패드 입력을 받아 CalculatorState를 갱신한다. */
export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case 'selectField':
      // 값 계산은 하지 않는다.
      if (state.activeField === action.field) return state;
      return { ...state, activeField: action.field };

    case 'inputDigit': {
      const { digit } = action;
      if (digit < 0 || digit > 9) {
        throw new Error(`digit은 0~9 사이여야 한다: ${digit}`);
      }
      const current = activeValue(state);
      // 앞자리 0이 쌓이지 않게 한다. "00", "05" 방지.
      const next =
        current === '0'
          ? digit === 0
            ? current
            : String(digit)
          : current.length >= MAX_INPUT_LENGTH
            ? current
            : current + String(digit);
      return commit(state, next);
    }

    case 'inputDot': {
      // 비어 있으면 `0.`, 이미 있으면 무시한다.
      const current = activeValue(state);
      if (current.includes('.')) return state;
      if (current.length >= MAX_INPUT_LENGTH) return state;
      return commit(state, current === '' ? '0.' : current + '.');
    }

    case 'backspace': {
      const current = activeValue(state);
      if (current === '') return state;
      return commit(state, current.slice(0, -1));
    }

    case 'reset':
      // 모든 칸을 비우고 활성 칸을 가로길이로 되돌린다.
      return initialCalculatorState;
  }
}

function activeValue(state: CalculatorState): string {
  return valueOf(state, state.activeField);
}

function commit(state: CalculatorState, value: string): CalculatorState {
  if (value === activeValue(state)) return state;
  return recalculate({ ...state, [state.activeField]: value });
}

/**
 * 활성 칸을 기준으로 나머지 칸을 다시 계산한다.
 *
 * - 가로 또는 세로 → 넓이 = 가로 × 세로 → 평수 = 넓이 × 0.3025
 * - 넓이 → 평수 = 넓이 × 0.3025, 가로·세로는 비운다
 * - 평수 → 넓이 = 평수 ÷ 0.3025, 가로·세로는 비운다
 *
 * 넓이·평수를 직접 입력할 때만 가로·세로를 비우는 것은, 직접 넣은 값과
 * 가로×세로가 어긋난 채로 남지 않게 하기 위한 것이다.
 */
function recalculate(next: CalculatorState): CalculatorState {
  switch (next.activeField) {
    case 'width':
    case 'height': {
      const width = parse(next.width);
      const height = parse(next.height);
      // 한쪽만 입력한 동안에는 계산이 끝난 값처럼 보이지 않게 비워 둔다.
      if (width === null || height === null) {
        return { ...next, area: '', pyeong: '' };
      }
      // 평수는 화면에 보이는 넓이에서 계산한다. 그래야 사용자가
      // "표시된 넓이 × 0.3025 = 표시된 평수"로 검산할 수 있다.
      const area = squareMeter(width, height);
      return {
        ...next,
        area: format(area),
        pyeong: format(toPyeong(area)),
      };
    }

    case 'area': {
      const area = parse(next.area);
      return {
        ...next,
        width: '',
        height: '',
        pyeong: area === null ? '' : format(toPyeong(area)),
      };
    }

    case 'pyeong': {
      const pyeong = parse(next.pyeong);
      return {
        ...next,
        width: '',
        height: '',
        area: pyeong === null ? '' : format(toSquareMeter(pyeong)),
      };
    }
  }
}

/**
 * 입력 중인 문자열을 숫자로 읽는다.
 *
 * `12.`처럼 소수점만 찍힌 상태도 `12`로 읽어, 소수점을 누른 순간 결과가
 * 사라지지 않게 한다.
 */
function parse(text: string): Decimal | null {
  if (text === '') return null;
  const normalized = text.endsWith('.') ? text.slice(0, -1) : text;
  if (normalized === '') return null;
  return tryParse(normalized);
}
