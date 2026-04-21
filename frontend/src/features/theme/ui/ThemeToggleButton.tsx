import Icon from '@/shared/ui/Icon';
import { Button } from 'antd';
import { useThemeMode } from '../model/useThemeMode';

export function ThemeToggleButton() {
  const { isDarkTheme, toggleTheme } = useThemeMode();

  return (
    <Button
      onClick={toggleTheme}
      icon={
        <Icon
          name={isDarkTheme ? 'SunOutlined' : 'MoonOutlined'}
          style={{
            fontSize: 18,
          }}
        />
      }
      type="text"
    />
  );
}
