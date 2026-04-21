import { useEffect } from 'react';
import { type ThemeConfig } from 'antd';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';

interface ThemeTokenObserverProps {
  onTokenChange?: (token: ThemeConfig['token']) => void;
}

export const ThemeTokenObserver = ({ onTokenChange }: ThemeTokenObserverProps) => {
  const { token } = useThemeToken();

  useEffect(() => {
    onTokenChange?.(token);
  }, [token, onTokenChange]);

  return null;
};
