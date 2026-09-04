import Decimal from 'decimal.js';

import {
  format,
  PYEONG_PER_SQUARE_METER,
  squareMeter,
  toPyeong,
  toSquareMeter,
  tryParse,
} from '../areaConverter';

/** 테스트를 짧게 쓰기 위한 헬퍼. */
const d = (value: string) => new Decimal(value);

describe('파싱', () => {
  test('숫자 문자열을 읽는다', () => {
    expect(tryParse('12.5')?.equals(d('12.5'))).toBe(true);
    expect(tryParse('0')?.equals(d('0'))).toBe(true);
  });

  test('숫자가 아니면 null이다', () => {
    expect(tryParse('')).toBeNull();
    expect(tryParse('.')).toBeNull();
    expect(tryParse('12a')).toBeNull();
  });
});

describe('변환', () => {
  test('1㎡ = 0.3025평', () => {
    expect(PYEONG_PER_SQUARE_METER.equals(d('0.3025'))).toBe(true);
  });

  test('가로 × 세로로 면적을 구한다', () => {
    expect(squareMeter(d('12'), d('8')).equals(d('96'))).toBe(true);
  });

  test('제곱미터를 평으로 바꾼다', () => {
    expect(toPyeong(d('100')).equals(d('30.25'))).toBe(true);
    expect(toPyeong(d('0')).equals(d('0'))).toBe(true);
  });

  test('평을 제곱미터로 바꾼다', () => {
    expect(toSquareMeter(d('30.25')).equals(d('100'))).toBe(true);
    expect(toSquareMeter(d('0')).equals(d('0'))).toBe(true);
  });

  test('평 → 제곱미터는 유한 소수가 아니므로 5자리에서 반올림한다', () => {
    // 1 ÷ 0.3025 = 3.30578512396694214876…
    expect(toSquareMeter(d('1')).equals(d('3.30579'))).toBe(true);
    // 3 ÷ 0.3025 = 9.91735537190082644628…
    expect(toSquareMeter(d('3')).equals(d('9.91736'))).toBe(true);
  });

  test('왕복 변환이 표시 자리수 안에서 일치한다', () => {
    for (const area of ['1', '33.058', '84', '1000', '12345.6789']) {
      const pyeong = toPyeong(d(area));
      const back = toSquareMeter(pyeong);
      expect(back.minus(d(area)).abs().lessThanOrEqualTo(d('0.001'))).toBe(true);
    }
  });
});

describe('number를 쓰지 않아 생기는 정확성', () => {
  test('0.1 × 3 같은 값에 부동소수점 찌꺼기가 남지 않는다', () => {
    // number면 0.30000000000000004가 된다.
    expect(squareMeter(d('0.1'), d('3')).equals(d('0.3'))).toBe(true);
  });

  test('큰 값을 곱해도 자리수가 틀어지지 않는다', () => {
    // number의 정확한 정수 표현 한계(2^53 ≈ 9.0e15)를 넘는 곱셈.
    expect(
      squareMeter(d('99999999'), d('99999999')).equals(d('9999999800000001')),
    ).toBe(true);
  });

  test('반올림 경계에서 5는 올린다', () => {
    // 3.75 × 0.3025 = 1.134375 (정확). 5자리로 반올림하면 1.13438.
    expect(toPyeong(d('3.75')).equals(d('1.13438'))).toBe(true);
  });
});

describe('표시 포맷', () => {
  test('0은 "0"이다', () => {
    expect(format(d('0'))).toBe('0');
  });

  test('의미 없는 뒤쪽 0을 지운다', () => {
    expect(format(d('96.00000'))).toBe('96');
    expect(format(d('29.040'))).toBe('29.04');
  });

  test('소수점 5자리까지만 표시한다', () => {
    expect(format(d('3.3057851239'))).toBe('3.30579');
  });

  test('1 미만 값도 정수부 0을 표시한다', () => {
    expect(format(d('0.3025'))).toBe('0.3025');
    expect(format(d('0.5'))).toBe('0.5');
  });

  test('반올림해서 0이 되는 값은 "0"이다', () => {
    expect(format(d('0.000001'))).toBe('0');
    expect(format(d('-0.000001'))).toBe('0');
  });
});
