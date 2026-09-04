/**
 * Material 3 시드 컬러(#2B5CE6) 기반 라이트·다크 팔레트.
 *
 * RN에는 ColorScheme.fromSeed가 없어 Flutter가 같은 시드로 만드는 토큰 값을
 * 고정 팔레트로 옮겨 적었다.
 */
export interface AppColors {
  surface: string;
  onSurface: string;
  onSurfaceVariant: string;
  surfaceContainerLow: string;
  surfaceContainerHigh: string;
  outlineVariant: string;
  primary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  errorContainer: string;
  onErrorContainer: string;
}

export const lightColors: AppColors = {
  surface: '#FAF8FF',
  onSurface: '#1A1B21',
  onSurfaceVariant: '#45464F',
  surfaceContainerLow: '#F4F2FA',
  surfaceContainerHigh: '#E8E7EF',
  outlineVariant: '#C6C5D0',
  primary: '#4457A9',
  primaryContainer: '#DDE1FF',
  onPrimaryContainer: '#2B3C90',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#93000A',
};

export const darkColors: AppColors = {
  surface: '#121318',
  onSurface: '#E3E1E9',
  onSurfaceVariant: '#C6C5D0',
  surfaceContainerLow: '#1A1B21',
  surfaceContainerHigh: '#292A2F',
  outlineVariant: '#45464F',
  primary: '#B9C3FF',
  primaryContainer: '#2B3C90',
  onPrimaryContainer: '#DDE1FF',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',
};

/** 카드 모서리 반경. */
export const RADIUS = 20;

/** 화면 좌우 여백. */
export const GUTTER = 16;

/** 값이 갱신될 때 글자폭이 흔들리지 않게 하는 고정폭 숫자 피처. */
export const TABULAR_FIGURES = ['tabular-nums'] as const;
