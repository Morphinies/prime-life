import { type ThemeConfig } from 'antd';

export const lightTheme: ThemeConfig = {
  token: {
    // colorPrimary: '#1890ff',
    // colorSuccess: '#52c41a',
    // colorWarning: '#faad14',
    // colorError: '#f5222d',
    // colorInfo: '#1890ff',
    // colorBgBase: '#ffffff',
    // colorTextBase: '#000000',
  },
};

export const darkTheme: ThemeConfig = {
  token: {
    // colorPrimary: '#177ddc',
    // colorSuccess: '#49aa19',
    // colorWarning: '#d89614',
    // colorError: '#d32029',
    // colorInfo: '#177ddc',
    // colorBgBase: '#141414',
    // colorTextBase: '#ffffff',
  },
};

export const getThemeConfig = (isDark: boolean): ThemeConfig => {
  return isDark ? darkTheme : lightTheme;
};
