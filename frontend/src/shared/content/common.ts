import prepareMenuItems, { type PreparedMenuItem } from '@/shared/utils/prepareMenuItems';

const common: {
  menuItems: PreparedMenuItem[];
} = {
  menuItems: prepareMenuItems([
    {
      key: '1',
      icon: 'LineChartOutlined',
      href: '/dashboard',
      label: 'Дашборд',
    },
    {
      key: '2',
      icon: 'CheckSquareOutlined',
      href: '/tasks',
      label: 'Задачи',
    },
    {
      key: '3',
      icon: 'FolderOpenOutlined',
      href: '/projects',
      label: 'Проекты',
    },
    {
      key: '4',
      icon: 'CreditCardOutlined',
      href: '/finance',
      label: 'Финансы',
    },
    {
      key: '5',
      icon: 'SmileOutlined',
      href: '/habits',
      label: 'Привычки',
    },
    {
      key: '6',
      icon: 'SettingOutlined',
      href: '/settings',
      label: 'Настройки',
    },
  ]),
};

export default common;
