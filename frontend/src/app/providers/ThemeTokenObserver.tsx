import { useEffect } from 'react';
import { type ThemeConfig } from 'antd';
import { useAppSelector } from '@/app/store/hooks';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import { selectIsDarkTheme } from '@/app/store/theme/theme.selectors';

interface ThemeTokenObserverProps {
  onTokenChange?: (token: ThemeConfig['token']) => void;
}

export const ThemeTokenObserver = ({ onTokenChange }: ThemeTokenObserverProps) => {
  const { token } = useThemeToken();
  const isDarkTheme = useAppSelector(selectIsDarkTheme);

  useEffect(() => {
    onTokenChange?.(token);
  }, [token, isDarkTheme, onTokenChange]);

  return null;
};
