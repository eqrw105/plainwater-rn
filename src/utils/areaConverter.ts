import Decimal from 'decimal.js';

/**
 * 면적 단위 변환과 표시용 숫자 포맷.
 *
 * 계산은 `number`가 아니라 Decimal로 한다. `number`는 `0.3025`를 정확히
 * 표현하지 못해 반올림 결과가 흔들리고, 자리수가 큰 곱셈에서 유효자리를 넘긴다.
 */

/** 표시할 최대 소수점 자리수. */
export const MAX_FRACTION_DIGITS = 5;

/** 나눗셈에서 반올림 판정에 쓰는 여유 자리수. */
const GUARD_DIGITS = 5;

// 12자리 입력 × 12자리 입력이라도 유효자리를 넘기지 않게 넉넉히 잡는다.
Decimal.set({ precision: 40 });

/**
 * 1㎡당 평수.
 *
 * 1평 = 6자 × 6자 = (20/11)² = 400/121 ㎡ 이므로, 그 역수인 121/400 =
 * 0.3025는 근삿값이 아니라 정확한 값이다.
 */
export const PYEONG_PER_SQUARE_METER = new Decimal('0.3025');

/** 숫자 문자열을 Decimal로 읽는다. 숫자가 아니면 `null`. */
export function tryParse(text: string): Decimal | null {
  try {
    return new Decimal(text);
  } catch {
    return null;
  }
}

/** 표시 자리수로 반올림한다. 5는 올린다. */
function round(value: Decimal): Decimal {
  return value.toDecimalPlaces(MAX_FRACTION_DIGITS, Decimal.ROUND_HALF_UP);
}

/** 가로 width(m), 세로 height(m) 직사각형의 면적(㎡). */
export function squareMeter(width: Decimal, height: Decimal): Decimal {
  return round(width.times(height));
}

/** ㎡ → 평. 0.3025를 곱하는 것이므로 오차가 없다. */
export function toPyeong(area: Decimal): Decimal {
  return round(area.times(PYEONG_PER_SQUARE_METER));
}

/**
 * 평 → ㎡.
 *
 * 400/121을 곱하는 것과 같고 121이 2·5의 곱이 아니라서 유한 소수로 떨어지지
 * 않는다. 여유 자리를 확보한 뒤 표시 자리수에서 반올림한다.
 */
export function toSquareMeter(pyeong: Decimal): Decimal {
  return round(
    pyeong
      .dividedBy(PYEONG_PER_SQUARE_METER)
      .toDecimalPlaces(MAX_FRACTION_DIGITS + GUARD_DIGITS, Decimal.ROUND_HALF_UP),
  );
}

/** 화면에 그대로 쓸 문자열. 뒤쪽의 의미 없는 0은 붙지 않는다. */
export function format(value: Decimal): string {
  const rounded = round(value);
  // decimal.js는 -0을 "-0"으로 출력하므로 0으로 정규화한다.
  return rounded.isZero() ? '0' : rounded.toString();
}
