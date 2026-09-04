import {
  CalculatorAction,
  calculatorReducer,
  MAX_INPUT_LENGTH,
} from '../calculatorReducer';
import { CalcField } from '../../types/calcField';
import {
  CalculatorState,
  initialCalculatorState,
  isEmpty,
} from '../../types/calculatorState';

/** 리듀서를 순서대로 돌리는 헬퍼. */
function run(state: CalculatorState, ...actions: CalculatorAction[]) {
  return actions.reduce(calculatorReducer, state);
}

/** 키패드로 text를 그대로 입력하는 액션 목록. `.`은 소수점 키로 처리한다. */
function type(text: string): CalculatorAction[] {
  return text.split('').map((char) =>
    char === '.'
      ? { type: 'inputDot' }
      : { type: 'inputDigit', digit: Number(char) },
  );
}

/** 칸을 고르고 값을 입력하는 액션 목록. */
function typeInto(field: CalcField, text: string): CalculatorAction[] {
  return [{ type: 'selectField', field }, ...type(text)];
}

describe('초기 상태', () => {
  test('모든 칸이 비어 있고 가로길이가 활성이다', () => {
    expect(isEmpty(initialCalculatorState)).toBe(true);
    expect(initialCalculatorState.activeField).toBe('width');
  });
});

describe('가로·세로 입력', () => {
  test('가로와 세로를 모두 넣으면 넓이와 평수가 계산된다', () => {
    const state = run(
      initialCalculatorState,
      ...typeInto('width', '12'),
      ...typeInto('height', '8'),
    );

    expect(state.area).toBe('96');
    expect(state.pyeong).toBe('29.04');
  });

  test('한쪽만 입력한 동안에는 넓이와 평수가 비어 있다', () => {
    const state = run(initialCalculatorState, ...typeInto('width', '12'));

    expect(state.width).toBe('12');
    expect(state.area).toBe('');
    expect(state.pyeong).toBe('');
  });

  test('가로·세로 입력은 서로를 지우지 않는다', () => {
    const state = run(
      initialCalculatorState,
      ...typeInto('width', '12'),
      ...typeInto('height', '8'),
      ...typeInto('width', '0'), // "120"
    );

    expect(state.width).toBe('120');
    expect(state.height).toBe('8');
    expect(state.area).toBe('960');
  });

  test('세로를 다 지우면 넓이와 평수도 비워진다', () => {
    const state = run(
      initialCalculatorState,
      ...typeInto('width', '12'),
      ...typeInto('height', '8'),
      { type: 'backspace' },
    );

    expect(state.height).toBe('');
    expect(state.area).toBe('');
    expect(state.pyeong).toBe('');
  });
});

describe('넓이 직접 입력', () => {
  test('평수를 계산하고 가로·세로를 비운다', () => {
    const state = run(
      initialCalculatorState,
      ...typeInto('width', '12'),
      ...typeInto('height', '8'),
      // 넓이 칸에 계산값 "96"이 남아 있으므로 뒤에 붙어 "964"가 된다.
      ...typeInto('area', '4'),
    );

    expect(state.area).toBe('964');
    expect(state.pyeong).toBe('291.61');
    expect(state.width).toBe('');
    expect(state.height).toBe('');
  });

  test('빈 상태에서 넓이만 넣어도 평수가 나온다', () => {
    const state = run(initialCalculatorState, ...typeInto('area', '84'));

    expect(state.pyeong).toBe('25.41');
    expect(state.width).toBe('');
    expect(state.height).toBe('');
  });
});

describe('평수 직접 입력', () => {
  test('넓이를 계산한다', () => {
    const state = run(initialCalculatorState, ...typeInto('pyeong', '25.41'));

    expect(state.area).toBe('84');
  });

  test('가로·세로를 비운다', () => {
    let state = run(
      initialCalculatorState,
      ...typeInto('width', '12'),
      ...typeInto('height', '8'),
    );
    expect(state.pyeong).toBe('29.04');

    state = run(state, ...typeInto('pyeong', '5')); // "29.04" 뒤에 붙어 "29.045"

    expect(state.pyeong).toBe('29.045');
    expect(state.area).toBe('96.01653');
    expect(state.width).toBe('');
    expect(state.height).toBe('');
  });
});

describe('소수점', () => {
  test('빈 칸에서 누르면 "0."이 된다', () => {
    const state = run(initialCalculatorState, { type: 'inputDot' });

    expect(state.width).toBe('0.');
  });

  test('이미 소수점이 있으면 무시된다', () => {
    const state = run(initialCalculatorState, ...typeInto('width', '1.5'), {
      type: 'inputDot',
    });

    expect(state.width).toBe('1.5');
  });

  test('소수점을 찍는 중에도 계산 결과가 유지된다', () => {
    const state = run(
      initialCalculatorState,
      ...typeInto('width', '12'),
      ...typeInto('height', '8'),
      { type: 'selectField', field: 'width' },
      { type: 'inputDot' }, // "12."
    );

    expect(state.width).toBe('12.');
    expect(state.area).toBe('96');
  });

  test('소수 값도 그대로 계산된다', () => {
    const state = run(
      initialCalculatorState,
      ...typeInto('width', '1.5'),
      ...typeInto('height', '2'),
    );

    expect(state.area).toBe('3');
    expect(state.pyeong).toBe('0.9075');
  });
});

describe('지우기', () => {
  test('마지막 글자를 지운다', () => {
    const state = run(initialCalculatorState, ...typeInto('width', '123'), {
      type: 'backspace',
    });

    expect(state.width).toBe('12');
  });

  test('빈 칸에서는 아무 일도 없다', () => {
    const state = run(initialCalculatorState, { type: 'backspace' });

    expect(state.width).toBe('');
    expect(isEmpty(state)).toBe(true);
  });
});

describe('전체 초기화', () => {
  test('모든 값을 비우고 가로길이로 돌아온다', () => {
    const state = run(
      initialCalculatorState,
      ...typeInto('width', '12'),
      ...typeInto('height', '8'),
      { type: 'selectField', field: 'pyeong' },
      { type: 'reset' },
    );

    expect(state).toEqual(initialCalculatorState);
    expect(state.activeField).toBe('width');
  });
});

describe('입력 정리', () => {
  test('앞자리 0이 쌓이지 않는다', () => {
    const state = run(
      initialCalculatorState,
      { type: 'inputDigit', digit: 0 },
      { type: 'inputDigit', digit: 0 },
    );

    expect(state.width).toBe('0');
  });

  test('0 뒤에 숫자를 누르면 0을 대체한다', () => {
    const state = run(
      initialCalculatorState,
      { type: 'inputDigit', digit: 0 },
      { type: 'inputDigit', digit: 5 },
    );

    expect(state.width).toBe('5');
  });

  test('최대 길이를 넘으면 더 입력되지 않는다', () => {
    let state = run(
      initialCalculatorState,
      ...type('1'.repeat(MAX_INPUT_LENGTH)),
    );
    expect(state.width.length).toBe(MAX_INPUT_LENGTH);

    state = run(state, { type: 'inputDigit', digit: 9 }, { type: 'inputDot' });

    expect(state.width).toBe('1'.repeat(MAX_INPUT_LENGTH));
  });
});

describe('칸 선택', () => {
  test('값을 바꾸지 않고 활성 칸만 옮긴다', () => {
    const before = run(initialCalculatorState, ...typeInto('width', '12'));

    const after = calculatorReducer(before, {
      type: 'selectField',
      field: 'pyeong',
    });

    expect(after).toEqual({ ...before, activeField: 'pyeong' });
  });
});
