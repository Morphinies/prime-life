import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { toggleTheme } from '@/app/store/theme/theme.slice';
import { selectIsDarkTheme } from '@/app/store/theme/theme.selectors';

export function useThemeMode() {
  const dispatch = useAppDispatch();
  const isDarkTheme = useAppSelector(selectIsDarkTheme);

  return {
    isDarkTheme,
    toggleTheme: () => dispatch(toggleTheme()),
  };
}
