'use client';

import Logo from './Logo';
import Icon from '@/shared/ui/Icon';
import { toggleTheme } from '@/app/store/theme/theme.slice';
import { Badge, Button, Flex, Layout, Input, theme } from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { selectIsDarkTheme } from '@/app/store/theme/theme.selectors';

interface HeaderProps {
  collapsed: boolean;
}

const Header = ({ collapsed }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const isDarkTheme = useAppSelector(selectIsDarkTheme);

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

          <Button
            onClick={() => dispatch(toggleTheme())}
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
        </Flex>
      </Flex>
    </Layout.Header>
  );
};

export default Header;
