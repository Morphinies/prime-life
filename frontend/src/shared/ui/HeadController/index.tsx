import { Button, Flex, Select, Typography } from 'antd';
import Icon, { type IconName } from '@/shared/ui/Icon';

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

export interface HeadControllerProps {
  title: string;
  titleAction?: HeadControllerAction;
  buttonFilters: HeadControllerButtonFilter[];
  extraFilter?: HeadControllerSelectFilter;
  projectFilter?: HeadControllerSelectFilter;
  viewSelect: HeadControllerViewSelect;
}

export function HeadController({
  title,
  titleAction,
  buttonFilters,
  extraFilter,
  projectFilter,
  viewSelect,
}: HeadControllerProps) {
  return (
    <Flex vertical gap="middle" className="head-controller-sticky">
      <Flex justify="space-between" gap="middle" wrap>
        <Flex gap="small" wrap>
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

          {extraFilter && (
            <Select
              value={extraFilter.value}
              placeholder={extraFilter.placeholder}
              className={extraFilter.className}
              style={{ minWidth: extraFilter.minWidth || 96 }}
              placement="bottomLeft"
              popupMatchSelectWidth={false}
              options={extraFilter.options.map(({ label, value }) => ({
                label,
                value,
              }))}
              onChange={extraFilter.onChange}
            />
          )}
        </Flex>

        <Flex gap="small" wrap>
          {projectFilter && (
            <Select
              allowClear={projectFilter.allowClear}
              value={projectFilter.value}
              placeholder={projectFilter.placeholder}
              style={{ minWidth: projectFilter.minWidth || 180 }}
              options={projectFilter.options.map(({ label, value }) => ({
                label,
                value,
              }))}
              onChange={projectFilter.onChange}
            />
          )}

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
