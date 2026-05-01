import Icon from '@/shared/ui/Icon';
import { Link } from 'react-router';
import { useLocation } from 'react-router';
import content from '@/shared/content/common';
import Logo from '@/widgets/Header/Logo';
import { Avatar, Button, Flex, Layout, Menu, Tooltip, Typography } from 'antd';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import { useEffect, useState } from 'react';
import type { MenuProps } from 'antd/lib/menu';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const { menuItems } = content;
  const { token } = useThemeToken();
  const { pathname } = useLocation();
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<MenuProps['selectedKeys']>([]);

  useEffect(() => {
    const activeMenuKey = menuItems.find((item) => item.href === pathname)?.key as string;
    setSelectedMenuKeys(activeMenuKey ? [activeMenuKey] : []);
  }, [pathname]);

  return (
    <Layout.Sider
      collapsible
      trigger={null}
      collapsedWidth={80}
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        background: token.colorBgContainer,
      }}
    >
      <Flex vertical={true} style={{ height: '100%' }}>
        <Flex
          align="center"
          justify="space-between"
          style={{
            position: 'relative',
            minHeight: 56,
            paddingBlock: token.paddingXS,
          }}
        >
          <Logo collapsed={collapsed} />

          <Tooltip title={collapsed ? 'Развернуть меню' : 'Свернуть меню'} placement="right">
            <Button
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Развернуть меню' : 'Свернуть меню'}
              style={{
                flexShrink: 0,
                position: 'absolute',
                top: token.paddingXS,
                bottom: token.paddingXS,
                left: 0,
                padding: 0,
                width: '10px',
                borderLeft: 0,
                borderRadius: 0,
                borderTopRightRadius: token.borderRadius,
                borderBottomRightRadius: token.borderRadius,
                height: `calc(100% - 2 * ${token.paddingXS}px)`,
              }}
            />
          </Tooltip>
        </Flex>

        <Menu
          mode="inline"
          items={menuItems}
          selectedKeys={selectedMenuKeys}
          style={{
            flex: 1,
            border: 'none',
          }}
        />
        <Link to={'/profile'} className="ant-menu-item">
          <Flex
            gap={'small'}
            style={{
              marginTop: 'auto',
              alignItems: 'center',
              padding: `${token.padding}px ${token.paddingLG}px`,
            }}
          >
            <Avatar style={{ flexShrink: 0 }} icon={<Icon name="UserOutlined" />} />
            <Title
              style={{
                margin: 0,
                lineHeight: 1,
                whiteSpace: 'nowrap',
                opacity: collapsed ? 0 : 1,
                transition: `opacity ${token.motionDurationMid} ${token.motionEaseInOut}`,
              }}
              level={5}
              children={'Profile'}
            />
          </Flex>
        </Link>
      </Flex>
    </Layout.Sider>
  );
};

export default Sidebar;
