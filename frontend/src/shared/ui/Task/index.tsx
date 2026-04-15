import dayjs from 'dayjs';
import Icon from '../Icon';
import { SortableItem } from '../SortableItem';
import { useSortable } from '@dnd-kit/sortable';
import { COLORS, type Color } from '@/app/constants';
import ActionMenu from '@/pages/tasks/ui/ActionMenu';
import type { CheckboxProps } from 'antd/lib/checkbox';
import { Checkbox, Divider, Flex, Tag, Typography } from 'antd';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
const { Title, Text } = Typography;

type PriorityKey = 'high' | 'medium' | 'low';

export type TaskProps = CheckboxProps &
  Task & {
    withSort?: boolean;
    handleEdit?: () => void;
    handleDelete?: () => void;
    handleArchive?: () => void;
    handleCompleted: () => void;
  };

export type Task = {
  id: string;
  title?: string;
  section?: string;
  project?: string;
  deadline?: string;
  description?: string;
  priority?: PriorityKey;
  isCompleted?: boolean;
  isArchived?: boolean;
  sortOrder: number;
  withBottomDivider?: boolean;
};

export type TaskEdit = Partial<Task>;

const PRIORITY_MAP: Record<PriorityKey, { content: string; color: Color }> = {
  high: { color: 'red', content: 'Высокий приоритет' },
  medium: { color: 'yellow', content: 'Средний приоритет' },
  low: { color: 'green', content: 'Низкий приоритет' },
};

export default function Task({
  title,
  project,
  section,
  deadline,
  priority,
  description,
  withSort = false,
  isCompleted = false,
  withBottomDivider = false,
  handleEdit,
  handleDelete,
  handleArchive,
  handleCompleted,
  ...rest
}: TaskProps) {
  const sortable = withSort ? useSortable({ id: rest.id }) : undefined;
  const { cssVar } = useThemeToken();

  return (
    <SortableItem id={rest.id} isOff={!withSort} sortable={sortable}>
      <Flex gap="small" align="flex-start">
        <Checkbox
          checked={isCompleted}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCompleted();
          }}
          styles={{
            label: { width: '100%', display: 'flex' },
            icon: { alignSelf: 'flex-start', marginTop: '0.3em' },
          }}
          {...rest}
        ></Checkbox>
        <Flex
          flex={1}
          align="flex-start"
          onClick={handleEdit}
          justify="space-between"
          {...(sortable ? sortable.listeners : {})}
          style={{ cursor: sortable?.isDragging ? 'grabbing' : 'pointer' }}
        >
          <Flex vertical align="flex-start" gap="small">
            {title && <Title level={5} children={title} />}

            {description && <Text type="secondary" children={description} />}

            {(project || deadline) && (
              <Flex gap="medium">
                {project && <Tag children={project} />}
                {deadline && (
                  <Flex gap="0.2rem">
                    <Icon color="grey" name="CalendarOutlined" />
                    <Text children={dayjs(deadline).format('MMM D')} type="secondary" />
                  </Flex>
                )}
                {priority && (
                  <Icon
                    name="UpCircleOutlined"
                    title={PRIORITY_MAP[priority].content}
                    color={COLORS[PRIORITY_MAP[priority].color]}
                  />
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
        <ActionMenu
          onArchive={() => handleArchive?.()}
          onDelete={() => handleDelete?.()}
          onEdit={() => handleEdit?.()}
        />
      </Flex>

      {withBottomDivider && (
        <Divider
          style={{
            borderColor: cssVar.colorFillTertiary,
          }}
        />
      )}
    </SortableItem>
  );
}
