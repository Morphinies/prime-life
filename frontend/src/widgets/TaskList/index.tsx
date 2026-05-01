import { Flex } from 'antd';
import { useEffect, useRef } from 'react';
import { type Task, type TaskListFilters } from '@/entities/task';
import TaskCard from '@/entities/task/ui/TaskCard';
import { SortContext } from '@/shared/ui/SortContext';
import ModalTask, { type ModalTaskProps } from './ModalTask';
import { useTaskListController } from './useTaskListController';

export interface TaskListProps {
  filters: TaskListFilters;
  defaultList?: Task[];
  createTaskSignal?: number;
  modalTask: Pick<ModalTaskProps, 'fields' | 'fieldSets'>;
}

const TaskList = ({
  filters,
  defaultList = [],
  createTaskSignal = 0,
  modalTask,
}: TaskListProps) => {
  const isActiveList = filters.period !== 'completed' && filters.period !== 'archived';
  const handledCreateTaskSignal = useRef(createTaskSignal);
  const {
    taskEdit,
    filteredList,
    showModal,
    hideModal,
    handleSubmit,
    handleDelete,
    handleReorder,
    handleArchive,
    handleComplete,
    modalTaskError,
  } = useTaskListController({ defaultList, filters });

  useEffect(() => {
    if (createTaskSignal > handledCreateTaskSignal.current) {
      handledCreateTaskSignal.current = createTaskSignal;
      showModal();
    }
  }, [createTaskSignal, showModal]);

  return (
    <Flex vertical gap="large">
      <SortContext list={filteredList} handleReorder={handleReorder}>
        <Flex vertical>
          {filteredList.map((task) => (
            <TaskCard
              {...task}
              key={task.id}
              withSort={true}
              withBottomDivider={true}
              withDoneStateDecoration={isActiveList}
              handleEdit={() => showModal(task)}
              handleDelete={() => handleDelete(task.id)}
              handleArchive={() => handleArchive(task.id, !task.isArchived)}
              handleComplete={() => handleComplete(task.id, !task.isCompleted)}
            />
          ))}
        </Flex>
      </SortContext>

      <ModalTask
        taskEdit={taskEdit}
        error={modalTaskError}
        modal={{
          open: !!taskEdit,
          onCancel: hideModal,
          toggle: () => (taskEdit ? showModal() : hideModal()),
        }}
        handleArchive={(task) => {
          if (!task.id) return;
          handleArchive(task.id, !task.isArchived);
          hideModal();
        }}
        handleDelete={(task) => {
          if (!task.id) return;
          handleDelete(task.id);
          hideModal();
        }}
        handleSubmit={handleSubmit}
        {...modalTask}
      />
    </Flex>
  );
};

export default TaskList;
