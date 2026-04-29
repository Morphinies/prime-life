import { Flex, Select, Typography } from 'antd';
import type { ProjectListFilters, ProjectListView } from '@/entities/project';
import Icon, { type IconName } from '@/shared/ui/Icon';

const { Title } = Typography;

type FilterOption = {
  label: string;
  value: string;
  iconName?: IconName;
};

export interface HeadControllerConfigProps {
  title: string;
  projectFilters: FilterOption[];
  viewSettings: FilterOption[];
}

export interface HeadControllerProps extends HeadControllerConfigProps {
  filters: ProjectListFilters;
  onFiltersChange: (filters: ProjectListFilters) => void;
}

const HeadController = ({
  filters,
  title,
  projectFilters,
  viewSettings,
  onFiltersChange,
}: HeadControllerProps) => {
  return (
    <Flex vertical gap="large">
      <Flex justify="flex-end" gap="small" wrap>
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
          onChange={(view) => onFiltersChange({ ...filters, view: view as ProjectListView })}
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

      <Title type="secondary" level={5}>
        {title}
      </Title>
    </Flex>
  );
};

export default HeadController;
