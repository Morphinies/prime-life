import { useState } from 'react';
import { Button, Flex, Typography } from 'antd';
import type { ButtonProps } from 'antd/lib/button';
import Icon, { type IconName } from '@/shared/ui/Icon';
const { Title } = Typography;

export interface HeadControllerProps {
  title: string;
  periodFilters: (ButtonProps & { iconName?: IconName })[];
  viewSettings: (ButtonProps & { iconName?: IconName })[];
}

const HeadController = ({ periodFilters, viewSettings, title }: HeadControllerProps) => {
  const [filters, setFilters] = useState({ periodId: periodFilters[0].id });
  const [settings, setSettings] = useState({ viewId: viewSettings[0].id });

  return (
    <Flex vertical gap="large">
      <Flex justify="space-between">
        <Flex gap="small">
          {periodFilters.map(({ children, id, iconName, ...rest }) => (
            <Button
              key={id}
              variant="filled"
              children={children}
              icon={iconName ? <Icon name={iconName} /> : undefined}
              color={filters.periodId === id ? 'blue' : 'default'}
              onClick={() => setFilters((p) => ({ ...p, periodId: id }))}
              {...rest}
            />
          ))}
        </Flex>
        <Flex gap="small">
          {viewSettings.map(({ children, id, iconName, ...rest }) => (
            <Button
              key={id}
              variant="link"
              children={children}
              icon={iconName ? <Icon name={iconName} /> : undefined}
              color={settings.viewId === id ? 'blue' : 'default'}
              onClick={() => setSettings((p) => ({ ...p, viewId: id }))}
              {...rest}
            />
          ))}
        </Flex>
      </Flex>
      <Title type="secondary" children={title} level={5} />
    </Flex>
  );
};

export default HeadController;
