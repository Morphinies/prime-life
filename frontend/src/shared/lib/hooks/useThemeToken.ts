import { useAppSelector } from '@/app/store/hooks';
import { selectIsDarkTheme } from '@/app/store/theme/theme.selectors';
import { theme } from 'antd';

const { useToken } = theme;

export const useThemeToken = () => {
  const isDark = useAppSelector(selectIsDarkTheme);
  const token = useToken();
  return { ...token, isDark };
};
