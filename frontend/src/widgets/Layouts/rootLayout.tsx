import 'dayjs/locale/ru';
import dayjs from 'dayjs';
import Sidebar from '../Sidebar';
import { Flex, Layout } from 'antd';
// import Header from '@/widgets/Header';
import { useState, type ReactNode } from 'react';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';

const RootLayout = ({ children }: { children: ReactNode }) => {
  dayjs.locale('ru');

  const { token } = useThemeToken();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: token.colorBgContainer,
      }}
    >
      {/* <Header collapsed={collapsed} /> */}
      <Flex flex={1} style={{ minHeight: 0 }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout
          style={{
            minWidth: 0,
            minHeight: 0,
            margin: token.marginXS,
            marginLeft: 0,
            background: token.colorBgBase,
            borderRadius: token.borderRadiusLG,
          }}
        >
          <Layout.Content
            className="main-scroll"
            style={{
              minHeight: 280,
              marginRight: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              margin: token.marginMD,
              paddingRight: token.marginMD / 2,
              marginInlineEnd: token.marginMD / 2,
            }}
          >
            {children}
          </Layout.Content>
        </Layout>
      </Flex>
      {/* <Footer style={{ textAlign: 'center' }}>
        PrimeLife ©{new Date().getFullYear()} Created by Morphinies
      </Footer> */}
    </Layout>
  );
};

export default RootLayout;
