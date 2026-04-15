import Icon from '@/shared/ui/Icon';
import { Link } from 'react-router';
import { useLocation } from 'react-router';
import content from '@/shared/content/common';
import { Avatar, Flex, Layout, Menu, Typography } from 'antd';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import { useEffect, useState } from 'react';
import type { MenuProps } from 'antd/lib/menu';

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
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        background: token.colorBgContainer,
      }}
    >
      <div className="sidebar-corner"></div>
      <Flex vertical={true} style={{ height: '100%' }}>
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
              padding: token.paddingXS,
              paddingInline: token.paddingLG,
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
