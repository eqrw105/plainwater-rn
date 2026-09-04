import { useColorScheme } from 'react-native';

import { AppColors, darkColors, lightColors } from './appTheme';

/** 시스템 라이트·다크 설정에 맞는 팔레트. */
export function useAppColors(): AppColors {
  return useColorScheme() === 'dark' ? darkColors : lightColors;
}
