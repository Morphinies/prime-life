import { Flex, Modal } from 'antd';
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
  const isActiveList = filters.status === 'active';
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
  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    if (createTaskSignal > handledCreateTaskSignal.current) {
      handledCreateTaskSignal.current = createTaskSignal;
      showModal();
    }
  }, [createTaskSignal, showModal]);

  const confirmDeleteTask = (taskId: Task['id']) => {
    modal.confirm({
      title: 'Удалить задачу?',
      content: 'Задача будет удалена безвозвратно.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: () => handleDelete(taskId),
    });
  };

  return (
    <Flex vertical gap="large">
      {contextHolder}

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
              handleDelete={() => confirmDeleteTask(task.id)}
              handleArchive={() => handleArchive(task.id, !task.isArchived)}
              handleComplete={() => handleComplete(task.id, !task.isCompleted)}
              completeTooltip={isActiveList ? 'Завершить задачу' : 'Вернуть в активные'}
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
          confirmDeleteTask(task.id);
          hideModal();
        }}
        handleSubmit={handleSubmit}
        {...modalTask}
      />
    </Flex>
  );
};

export default TaskList;
