import dayjs from 'dayjs';
import Icon from '@/shared/ui/Icon';
import { ClientOnly } from '@/shared/ui/ClientOnly';
import { SortableItem } from '@/shared/ui/SortableItem';
import { useSortable } from '@dnd-kit/sortable';
import { COLORS, type Color } from '@/shared/config/colors';
import ActionMenu from '@/shared/ui/ActionMenu';
import type { CheckboxProps } from 'antd/lib/checkbox';
import type { Task, TaskPriority } from '@/entities/task';
import { Checkbox, Divider, Flex, Tag, Typography } from 'antd';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';

const { Title, Text } = Typography;

type TaskCardData = Pick<Task, 'id'> &
  Partial<Omit<Task, 'id' | 'sortOrder' | 'withBottomDivider'>> & {
    sortOrder?: Task['sortOrder'];
  };

export type TaskProps = CheckboxProps &
  TaskCardData & {
    withSort?: boolean;
    handleEdit?: () => void;
    handleDelete?: () => void;
    handleArchive?: () => void;
    handleComplete?: () => void;
    withBottomDivider?: boolean;
  };

type TaskCheckboxProps = Pick<CheckboxProps, 'disabled'>;

const PRIORITY_MAP: Record<TaskPriority, { content: string; color: Color }> = {
  high: { color: 'red', content: 'Высокий приоритет' },
  medium: { color: 'yellow', content: 'Средний приоритет' },
  low: { color: 'green', content: 'Низкий приоритет' },
};

function TaskCheckboxFallback({
  checked,
  disabled,
}: TaskCheckboxProps & {
  checked: boolean;
}) {
  return (
    <span
      style={{
        width: 16,
        height: 16,
        marginTop: '0.3em',
        display: 'inline-flex',
        flex: '0 0 auto',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        readOnly
        aria-hidden
        tabIndex={-1}
        style={{ margin: 0 }}
      />
    </span>
  );
}

export default function TaskCard({
  id,
  title,
  project,
  section,
  deadline,
  priority,
  sortOrder,
  description,
  withSort = false,
  isArchived = false,
  isCompleted = false,
  withBottomDivider = false,
  handleEdit,
  handleDelete,
  handleArchive,
  handleComplete,
  ...rest
}: TaskProps) {
  const sortable = withSort ? useSortable({ id }) : undefined;
  const { cssVar } = useThemeToken();
  const checkboxProps: TaskCheckboxProps = {
    disabled: rest.disabled,
  };

  return (
    <SortableItem id={id} isOff={!withSort} sortable={sortable}>
      <Flex gap="small" align="flex-start">
        <ClientOnly fallback={<TaskCheckboxFallback checked={isCompleted} {...checkboxProps} />}>
          <Checkbox
            {...rest}
            checked={isCompleted}
            onChange={(e) => {
              e.stopPropagation();
              handleComplete?.();
            }}
            onClick={(e) => e.stopPropagation()}
            styles={{
              label: { width: '100%', display: 'flex' },
              icon: { alignSelf: 'flex-start', marginTop: '0.3em' },
            }}
          ></Checkbox>
        </ClientOnly>
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
