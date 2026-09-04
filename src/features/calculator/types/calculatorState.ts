import { CalcField } from './calcField';

/**
 * 계산기 화면의 상태.
 *
 * 값을 `number`가 아니라 `string`으로 들고 있는 이유는 `12.`이나 `0.`처럼
 * 입력 중인 중간 상태를 그대로 보여줘야 하기 때문이다.
 */
export interface CalculatorState {
  readonly width: string;
  readonly height: string;
  readonly area: string;
  readonly pyeong: string;
  /** 키패드 입력을 받는 칸. */
  readonly activeField: CalcField;
}

export const initialCalculatorState: CalculatorState = {
  width: '',
  height: '',
  area: '',
  pyeong: '',
  activeField: 'width',
};

export function isEmpty(state: CalculatorState): boolean {
  return (
    state.width === '' &&
    state.height === '' &&
    state.area === '' &&
    state.pyeong === ''
  );
}

export function valueOf(state: CalculatorState, field: CalcField): string {
  return state[field];
}
