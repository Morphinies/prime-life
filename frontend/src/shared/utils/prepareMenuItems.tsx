import { Link } from 'react-router';
import Icon, { type IconName } from '@/shared/ui/Icon';
import type { ItemType, MenuItemType } from 'antd/es/menu/interface';

export type UnprepareMenuItems = { key: string; icon: IconName; label: string; href: string };

export type PreparedMenuItem = ItemType<MenuItemType> & {
  href: string;
};

function prepareMenuItems(items: UnprepareMenuItems[]): PreparedMenuItem[] {
  return items.map(({ href, icon, key, label }) => ({
    key,
    href,
    icon: <Icon name={icon} />,
    label: <Link to={href}>{label}</Link>,
  }));
}

export default prepareMenuItems;
