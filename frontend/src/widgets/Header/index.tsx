'use client';

import Logo from './Logo';
import Icon from '@/shared/ui/Icon';
import { ThemeToggleButton } from '@/features/theme';
import { Badge, Button, Flex, Layout, Input, theme } from 'antd';

interface HeaderProps {
  collapsed: boolean;
}

const Header = ({ collapsed }: HeaderProps) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout.Header
      style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center' }}
    >
      <Logo collapsed={collapsed} />

      <Flex flex={1} justify="space-between" style={{ padding: '0 16px' }}>
        <Input.Search placeholder="Поиск..." style={{ width: 300 }} />

        <Flex gap={'medium'}>
          <Badge count={1} size="small">
            <Button
              icon={
                <Icon
                  name="MessageOutlined"
                  style={{
                    fontSize: 18,
                  }}
                />
              }
              type="text"
            />
          </Badge>

          <ThemeToggleButton />
        </Flex>
      </Flex>
    </Layout.Header>
  );
};

export default Header;
