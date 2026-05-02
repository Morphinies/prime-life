import { useMemo } from 'react';
import { Divider, Empty, Flex, Typography } from 'antd';
import type { Task } from '@/entities/task';
import TaskCard from '@/entities/task/ui/TaskCard';
import { SortContext } from '@/shared/ui/SortContext';

const { Text } = Typography;

type TaskSection = {
  title?: string;
  tasks: Task[];
};

export interface TaskSectionsListProps {
  tasks: Task[];
  groupBySection?: (task: Task) => string | undefined;
  emptyDescription?: string;
  withSort?: boolean;
  withActions?: boolean;
  withDoneStateDecoration?: boolean;
  completeTooltip?: string;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onArchiveTask?: (task: Task) => void;
  onCompleteTask?: (task: Task) => void;
  onReorder?: (list: Task[], oldIndex: number, newIndex: number) => void;
}

function groupTasks(tasks: Task[], groupBySection?: TaskSectionsListProps['groupBySection']) {
  if (!groupBySection) {
    if (!tasks.length) {
      return [];
    }

    return [{ tasks } satisfies TaskSection];
  }

  const sectionsMap = new Map<string, Task[]>();

  tasks.forEach((task) => {
    const sectionTitle = groupBySection(task) || '';
    const currentSectionTasks = sectionsMap.get(sectionTitle) || [];
    currentSectionTasks.push(task);
    sectionsMap.set(sectionTitle, currentSectionTasks);
  });

  return [...sectionsMap.entries()].map(([title, sectionTasks]) => ({
    title: title || undefined,
    tasks: sectionTasks,
  }));
}

function TaskSectionsContent({
  sections,
  emptyDescription,
  withSort = false,
  withActions = true,
  withDoneStateDecoration = true,
  completeTooltip,
  onEditTask,
  onDeleteTask,
  onArchiveTask,
  onCompleteTask,
}: {
  sections: TaskSection[];
  emptyDescription?: string;
  withSort?: boolean;
  withActions?: boolean;
  withDoneStateDecoration?: boolean;
  completeTooltip?: string;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onArchiveTask?: (task: Task) => void;
  onCompleteTask?: (task: Task) => void;
}) {
  if (!sections.length) {
    return emptyDescription ? (
      <Empty description={emptyDescription} image={Empty.PRESENTED_IMAGE_SIMPLE} />
    ) : null;
  }

  return (
    <Flex vertical gap="medium">
      {sections.map((section, sectionIndex) => (
        <Flex key={`${section.title || 'default'}-${sectionIndex}`} vertical>
          {(sections.length > 1 || section.title) && (
            <Flex align="center" gap="small">
              <Divider
                style={{
                  marginTop: sectionIndex ? undefined : 0,
                  marginBottom: 16,
                  flex: 1,
                }}
              />
              <Text type="secondary">{section.title || 'Без секции'}</Text>
              <Divider
                style={{
                  marginTop: sectionIndex ? undefined : 0,
                  marginBottom: 16,
                  flex: 1,
                }}
              />
            </Flex>
          )}

          <Flex vertical>
            {section.tasks.map((task, taskIndex) => (
              <TaskCard
                {...task}
                key={task.id}
                withSort={withSort}
                withActions={withActions}
                withDoneStateDecoration={withDoneStateDecoration}
                withBottomDivider={taskIndex < section.tasks.length - 1}
                handleEdit={() => onEditTask?.(task)}
                handleDelete={() => onDeleteTask?.(task)}
                handleArchive={() => onArchiveTask?.(task)}
                handleComplete={() => onCompleteTask?.(task)}
                completeTooltip={completeTooltip}
              />
            ))}
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
}

export default function TaskSectionsList({
  tasks,
  groupBySection,
  emptyDescription,
  withSort = false,
  withActions = true,
  withDoneStateDecoration = true,
  completeTooltip,
  onEditTask,
  onDeleteTask,
  onArchiveTask,
  onCompleteTask,
  onReorder,
}: TaskSectionsListProps) {
  const sections = useMemo(() => groupTasks(tasks, groupBySection), [groupBySection, tasks]);

  if (!tasks.length && !emptyDescription) {
    return null;
  }

  const content = (
    <TaskSectionsContent
      sections={sections}
      emptyDescription={emptyDescription}
      withSort={withSort}
      withActions={withActions}
      withDoneStateDecoration={withDoneStateDecoration}
      completeTooltip={completeTooltip}
      onEditTask={onEditTask}
      onDeleteTask={onDeleteTask}
      onArchiveTask={onArchiveTask}
      onCompleteTask={onCompleteTask}
    />
  );

  if (!withSort || !onReorder) {
    return content;
  }

  return (
    <SortContext list={tasks} handleReorder={onReorder}>
      {content}
    </SortContext>
  );
}
