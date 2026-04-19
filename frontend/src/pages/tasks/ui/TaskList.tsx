import { Button, Flex } from 'antd';
import React, { useEffect, useState } from 'react';
import { SortContext } from '@/shared/ui/SortContext';
import ModalTask, { type ModalTaskProps } from './ModalTask';
import { getEditedObject } from '@/shared/utils/transformer';
import { arrayMove } from '@dnd-kit/sortable';
import TaskCard from '@/shared/ui/TaskCard';
import { useTaskList, type Task, type UpdateTaskDto } from '@/entities/task';

export interface TaskListProps {
  defaultList?: Task[];
  modalTask: Pick<ModalTaskProps, 'fields' | 'bottomFields'>;
}

const TaskList = ({ defaultList = [], modalTask }: TaskListProps) => {
  const { data: list = [] } = useTaskList({ initialData: defaultList });

  const [defaultTask] = useState<UpdateTaskDto>({
    title: '',
    description: '',
    project: undefined,
    isCompleted: false,
    deadline: undefined,
    priority: undefined,
  });
  const [taskEdit, setTaskEdit] = useState<UpdateTaskDto | null>(null);
  const [modalTaskError, setModalTaskError] = useState<string>();
  const [, setList] = useState(defaultList);

  useEffect(() => {
    setList(defaultList);
  }, [defaultList]);

  const handleSubmit = async (task: UpdateTaskDto) => {
    if (task.id) return handleArchive(task.id, true);

    try {
      if (!taskEdit) throw new Error('taskEdit is not found');
      const isTaskEditing = !!task.id;

      const body = JSON.stringify(
        isTaskEditing ? getEditedObject(taskEdit, task) : task,
        (_, val) => (isTaskEditing ? (val === undefined ? null : val) : val)
      );

      const res = await fetch(`http://localhost:5000/tasks${isTaskEditing ? `/${task.id}` : ''}`, {
        body: body,
        method: isTaskEditing ? 'PUT' : 'POST',
        headers: {
          'content-type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error[0].message);
      }
      setList((prev) =>
        task.id ? prev.map((item) => (item.id === data.id ? data : item)) : [data, ...prev]
      );
      setTaskEdit(null);
    } catch (err) {
      console.error(err);
      setModalTaskError('Ошибка! Не удалось обновить задачу.');
    }
  };

  const handleDelete = async (taskId: Task['id']) => {
    try {
      const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error[0].message);
      }
      setList((prev) => prev.filter((item) => item.id !== taskId));
    } catch (err) {
      console.error(err);
      setModalTaskError('Ошибка! Не удалось обновить задачу.');
    }
  };

  const handleCompleted = async (taskId: Task['id'], val: boolean) => {
    try {
      const body = JSON.stringify({ isCompleted: val });
      const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'PUT',
        body: body,
        headers: {
          'content-type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error[0].message);
      }
      setList((prev) => prev.map((item) => (item.id === data.id ? data : item)));
    } catch (err) {
      console.error(err);
      setModalTaskError('Ошибка! Не удалось обновить задачу.');
    }
  };

  const handleArchive = async (taskId: Task['id'], val: boolean) => {
    try {
      const body = JSON.stringify({ isArchived: val });
      const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'PUT',
        body: body,
        headers: {
          'content-type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error[0].message);
      }
      setList((prev) => prev.map((item) => (item.id === data.id ? data : item)));
    } catch (err) {
      console.error(err);
      setModalTaskError('Ошибка! Не удалось обновить задачу.');
    }
  };

  const handleReorder = async (
    list: Pick<Task, 'id' | 'sortOrder'>[],
    oldIndex: number,
    newIndex: number
  ) => {
    try {
      if (oldIndex === newIndex) return;
      const targetItemId = list[oldIndex].id;
      if (!targetItemId) throw new Error('targetItemId not found');

      const IS_ORDER_DESC = true;
      const inc = IS_ORDER_DESC ? 1 : -1;

      let newSortOrder: number;
      if (newIndex === 0) {
        newSortOrder = list[0].sortOrder + inc;
      } else if (newIndex === list.length - 1) {
        newSortOrder = list[list.length - 1].sortOrder - inc;
      } else {
        newSortOrder = Number(
          ((list[newIndex - 1].sortOrder + list[newIndex].sortOrder) / 2).toFixed(4)
        );
      }

      const reorderedItems = list.map((item) =>
        item.id === targetItemId ? { ...item, sortOrder: newSortOrder } : item
      );
      setList(arrayMove(reorderedItems, oldIndex, newIndex));

      const body = JSON.stringify({ sortOrder: newSortOrder });
      const res = await fetch(`http://localhost:5000/tasks/${targetItemId}/move`, {
        method: 'PUT',
        body: body,
        headers: {
          'content-type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error[0].message);
      }
    } catch (err) {
      console.error(err);
      setModalTaskError('Ошибка! Не удалось обновить задачу.');
    }
  };

  const hideModal = () => {
    setTaskEdit(null);
  };

  const showModal = (task?: Task) => {
    if (!task) {
      setTaskEdit(defaultTask);
    } else {
      const taskEdit: UpdateTaskDto = {
        id: task.id,
        title: task.title,
        section: task.section,
        project: task.project,
        priority: task.priority,
        description: task.description,
        isCompleted: task.isCompleted,
        deadline: task.deadline,
      };
      setTaskEdit(taskEdit);
    }
  };

  return (
    <Flex vertical gap="large">
      <SortContext list={list} handleReorder={handleReorder}>
        <Flex vertical>
          {list.map((task) => (
            <React.Fragment key={task.id}>
              <TaskCard
                {...task}
                withSort={true}
                withBottomDivider={true}
                handleEdit={() => showModal(task)}
                handleDelete={() => handleDelete(task.id)}
                handleArchive={() => handleArchive(task.id, !task.isArchived)}
                handleCompleted={() => handleCompleted(task.id, !task.isCompleted)}
              />
            </React.Fragment>
          ))}
        </Flex>
      </SortContext>

      <Button
        type="link"
        onClick={() => showModal()}
        children="+ Добавить задачу"
        styles={{ root: { width: 'fit-content', padding: 0 } }}
      />

      <ModalTask
        error={modalTaskError}
        taskEdit={taskEdit}
        modal={{
          open: !!taskEdit,
          onCancel: hideModal,
          toggle: () => (taskEdit ? showModal() : hideModal()),
        }}
        handleSubmit={handleSubmit}
        {...modalTask}
      />
    </Flex>
  );
};

export default TaskList;
