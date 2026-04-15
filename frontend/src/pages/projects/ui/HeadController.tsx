import { useState } from 'react';
import { Button, Flex } from 'antd';
import type { ButtonProps } from 'antd/lib/button';
import Icon, { type IconName } from '@/shared/ui/Icon';

export interface HeadControllerProps {
  periodFilters: (ButtonProps & { iconName?: IconName })[];
  viewSettings: (ButtonProps & { iconName?: IconName })[];
}

const HeadController = ({ periodFilters, viewSettings }: HeadControllerProps) => {
  const [filters, setFilters] = useState({ periodId: periodFilters[0].id });
  const [settings, setSettings] = useState({ viewId: viewSettings[0].id });

  return (
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
  );
};

export default HeadController;
