import 'dayjs/locale/ru';
import dayjs from 'dayjs';
import Sidebar from '../Sidebar';
import { Flex, Layout } from 'antd';
import Header from '@/widgets/Header';
import { useState, type ReactNode } from 'react';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';

const RootLayout = ({ children }: { children: ReactNode }) => {
  dayjs.locale('ru');

  const { token } = useThemeToken();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header collapsed={collapsed} />
      <Flex flex={1}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout>
          <Layout.Content
            style={{
              minHeight: 280,
              margin: token.marginMD,
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
