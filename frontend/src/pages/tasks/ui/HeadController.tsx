import { Button, Flex, Select, Typography } from 'antd';
import type { TaskListFilters, TaskListPeriod, TaskListView } from '@/entities/task';
import Icon, { type IconName } from '@/shared/ui/Icon';

const { Title } = Typography;

type FilterOption = {
  label: string;
  value: string;
  iconName?: IconName;
};

export interface HeadControllerConfigProps {
  title: string;
  periodFilters: FilterOption[];
  extraFilters: FilterOption[];
  projectFilters: FilterOption[];
  viewSettings: FilterOption[];
}

export interface HeadControllerProps extends HeadControllerConfigProps {
  filters: TaskListFilters;
  onFiltersChange: (filters: TaskListFilters) => void;
}

const HeadController = ({
  filters,
  title,
  periodFilters,
  extraFilters,
  projectFilters,
  viewSettings,
  onFiltersChange,
}: HeadControllerProps) => {
  const activeExtraFilter = extraFilters.find(({ value }) => value === filters.period);

  return (
    <Flex vertical gap="large">
      <Flex justify="space-between" gap="middle" wrap>
        <Flex gap="small" wrap>
          {periodFilters.map(({ label, value, iconName }) => (
            <Button
              key={value}
              variant="filled"
              color={filters.period === (value as TaskListPeriod) ? 'blue' : 'default'}
              icon={iconName ? <Icon name={iconName} /> : undefined}
              onClick={() => onFiltersChange({ ...filters, period: value as TaskListPeriod })}
            >
              {label}
            </Button>
          ))}

          <Select
            value={activeExtraFilter?.value}
            placeholder="Ещё"
            className={
              activeExtraFilter ? 'tasks-more-filter tasks-more-filter-active' : 'tasks-more-filter'
            }
            style={{ minWidth: 96 }}
            placement="bottomLeft"
            popupMatchSelectWidth={false}
            options={extraFilters.map(({ label, value }) => ({
              label,
              value,
            }))}
            onChange={(period) => onFiltersChange({ ...filters, period: period as TaskListPeriod })}
          />
        </Flex>

        <Flex gap="small" wrap>
          <Select
            allowClear
            value={filters.project}
            placeholder="Проект"
            style={{ minWidth: 180 }}
            options={projectFilters.map(({ label, value }) => ({
              label,
              value,
            }))}
            onChange={(project) => onFiltersChange({ ...filters, project })}
          />

          <Select
            value={filters.view}
            style={{ width: 56 }}
            placement="bottomRight"
            popupMatchSelectWidth={false}
            optionLabelProp="label"
            onChange={(view) => onFiltersChange({ ...filters, view: view as TaskListView })}
          >
            {viewSettings.map(({ label, value, iconName }) => (
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

      <Title type="secondary" level={5}>
        {title}
      </Title>
    </Flex>
  );
};

export default HeadController;
