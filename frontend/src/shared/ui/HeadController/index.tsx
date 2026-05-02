import { Button, Flex, Input, Select, Typography } from 'antd';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Icon, { type IconName } from '@/shared/ui/Icon';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';

const { Title } = Typography;

export type HeadControllerOption = {
  label: string;
  value: string;
  iconName?: IconName;
};

export type HeadControllerButtonFilter = HeadControllerOption & {
  active: boolean;
  onClick: () => void;
};

export type HeadControllerSelectFilter = {
  allowClear?: boolean;
  className?: string;
  minWidth?: number;
  options: HeadControllerOption[];
  placeholder?: string;
  value?: string;
  onChange: (value?: string) => void;
};

export type HeadControllerViewSelect = {
  options: HeadControllerOption[];
  value: string;
  onChange: (value: string) => void;
};

export type HeadControllerAction = {
  label: string;
  onClick: () => void;
};

export type HeadControllerSearchFilter = {
  className?: string;
  minWidth?: number;
  placeholder?: string;
  value?: string;
  onChange: (value?: string) => void;
};

export interface HeadControllerProps {
  title: string;
  titleAction?: HeadControllerAction;
  buttonFilters?: HeadControllerButtonFilter[];
  searchFilter?: HeadControllerSearchFilter;
  leftControls?: ReactNode[];
  leftSelectFilters?: HeadControllerSelectFilter[];
  rightControls?: ReactNode[];
  viewSelect: HeadControllerViewSelect;
}

export function HeadController({
  title,
  titleAction,
  buttonFilters = [],
  searchFilter,
  leftControls = [],
  leftSelectFilters = [],
  rightControls = [],
  viewSelect,
}: HeadControllerProps) {
  const { token } = useThemeToken();
  const [searchValue, setSearchValue] = useState(searchFilter?.value || '');
  const searchTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setSearchValue(searchFilter?.value || '');
  }, [searchFilter?.value]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        window.clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    if (!searchFilter) return;

    if (searchTimerRef.current) {
      window.clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = window.setTimeout(() => {
      searchFilter.onChange(value.trim() || undefined);
    }, 300);
  };

  return (
    <Flex vertical gap="middle" className="head-controller-sticky">
      <Flex justify="space-between" gap="middle" align="center" wrap={false}>
        <Flex gap="small" wrap={false} style={{ minWidth: 0, overflowX: 'auto' }}>
          {searchFilter && (
            <Input
              allowClear
              prefix={<Icon name="SearchOutlined" />}
              value={searchValue}
              placeholder={searchFilter.placeholder || 'Поиск'}
              className={searchFilter.className}
              style={{
                borderRadius: token.borderRadius,
                width: searchFilter.minWidth || 250,
                minWidth: searchFilter.minWidth || 250,
              }}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          )}

          {leftSelectFilters.map((filter, index) => (
            <Select
              key={index}
              allowClear={filter.allowClear}
              value={filter.value}
              placeholder={filter.placeholder}
              className={filter.className}
              style={{ minWidth: filter.minWidth || 140 }}
              placement="bottomLeft"
              popupMatchSelectWidth={false}
              options={filter.options.map(({ label, value }) => ({
                label,
                value,
              }))}
              onChange={filter.onChange}
            />
          ))}

          {leftControls.map((control, index) => (
            <div key={index}>{control}</div>
          ))}

          {buttonFilters.map(({ label, value, iconName, active, onClick }) => (
            <Button
              key={value}
              variant="filled"
              color={active ? 'blue' : 'default'}
              icon={iconName ? <Icon name={iconName} /> : undefined}
              onClick={onClick}
            >
              {label}
            </Button>
          ))}
        </Flex>

        <Flex gap="small" wrap={false}>
          {rightControls.map((control, index) => (
            <div key={index}>{control}</div>
          ))}

          <Select
            value={viewSelect.value}
            style={{ width: 56 }}
            placement="bottomRight"
            popupMatchSelectWidth={false}
            optionLabelProp="label"
            onChange={viewSelect.onChange}
          >
            {viewSelect.options.map(({ label, value, iconName }) => (
              <Select.Option
                key={value}
                value={value}
                label={iconName ? <Icon name={iconName} /> : label}
              >
                <Flex gap="small" align="center">
                  {iconName ? <Icon name={iconName} /> : null}
                  <span>{label}</span>
                </Flex>
              </Select.Option>
            ))}
          </Select>
        </Flex>
      </Flex>

      <Flex justify="space-between" align="center" gap="middle">
        <Title type="secondary" level={5}>
          {title}
        </Title>

        {titleAction && (
          <Button
            type="link"
            onClick={titleAction.onClick}
            styles={{ root: { width: 'fit-content', padding: 0 } }}
          >
            {titleAction.label}
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
