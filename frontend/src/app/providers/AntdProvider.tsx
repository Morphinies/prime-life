import ruRU from 'antd/locale/ru_RU';
import type { ThemeConfig } from 'antd';
import { useEffect, useState } from 'react';
// import { StyleProvider } from '@ant-design/cssinjs';
import { initTheme } from '../store/theme/theme.slice';
import { ThemeTokenObserver } from './ThemeTokenObserver';
import { lightTheme, darkTheme } from '@/shared/lib/theme';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectIsDarkTheme } from '@/app/store/theme/theme.selectors';
import { ConfigProvider, App as AntdApp, theme as antdTheme } from 'antd';

interface AntdProviderProps {
  children: React.ReactNode;
}

export const AntdProvider = ({ children }: AntdProviderProps) => {
  const [token, setToken] = useState<ThemeConfig['token'] | undefined>(undefined);
  const dispatch = useAppDispatch();
  const isDarkTheme = useAppSelector(selectIsDarkTheme);
  const customToken = isDarkTheme ? darkTheme.token : lightTheme.token;

  useEffect(() => {
    dispatch(initTheme());
  }, []);

  const themeConfig: ThemeConfig = {
    algorithm: isDarkTheme ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      ...customToken,
    },
    components: {
      Button: {
        borderRadius: 4,
        controlHeight: 32,
      },
      Input: {
        borderRadius: 4,
        controlHeight: 32,
      },
      Card: {
        borderRadiusLG: 8,
      },
      Layout: {
        triggerBg: token?.colorBgContainer,
        triggerColor: token?.colorText,
      },
      Typography: {
        titleMarginTop: 0,
        titleMarginBottom: 0,
      },
    },
  };

  return (
    // <StyleProvider hashPriority="high">
    <ConfigProvider theme={themeConfig} locale={ruRU} componentSize="middle">
      <AntdApp style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <ThemeTokenObserver onTokenChange={setToken} />
        {children}
      </AntdApp>
    </ConfigProvider>
    // </StyleProvider>
  );
};
