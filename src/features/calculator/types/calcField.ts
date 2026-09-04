/** 계산기의 입력 칸. */
export type CalcField = 'width' | 'height' | 'area' | 'pyeong';

export const CALC_FIELDS: readonly CalcField[] = [
  'width',
  'height',
  'area',
  'pyeong',
];

export const FIELD_LABEL: Record<CalcField, string> = {
  width: '가로길이',
  height: '세로길이',
  area: '넓이',
  pyeong: '평수',
};

export const FIELD_UNIT: Record<CalcField, string> = {
  width: 'm',
  height: 'm',
  area: '㎡',
  pyeong: '평',
};
