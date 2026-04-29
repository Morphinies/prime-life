import type { TaskListProps } from '../../widgets/TaskList';
import type { HeadControllerConfigProps } from './ui/HeadController';

const content: {
  tasks: Pick<TaskListProps, 'modalTask'>;
  headController: Omit<HeadControllerConfigProps, 'projectFilters' | 'title'>;
} = {
  headController: {
    periodFilters: [
      { label: 'Все', value: 'all' },
      { label: 'Сегодня', value: 'day' },
      { label: 'Неделя', value: 'week' },
      { label: 'Месяц', value: 'month' },
    ],
    extraFilters: [
      { label: 'Просроченные', value: 'overdue' },
      { label: 'Завершённые', value: 'completed' },
      { label: 'Архив', value: 'archived' },
    ],
    viewSettings: [{ label: 'Список', value: 'list', iconName: 'BarsOutlined' }],
  },
  tasks: {
    modalTask: {
      fields: [
        {
          name: 'title',
          placeholder: 'Название задачи',
          rules: [{ required: true, message: 'Пожалуйста, укажите название задачи' }],
        },
        {
          type: 'textarea',
          name: 'description',
          placeholder: 'Описание',
        },
      ],
      bottomFields: [
        {
          type: 'select',
          name: 'priority',
          placeholder: 'Приоритет',
          options: [
            { label: 'Низкий', value: 'low' },
            { label: 'Средний', value: 'medium' },
            { label: 'Высокий', value: 'high' },
          ],
        },
        {
          type: 'select',
          name: 'project',
          placeholder: 'Проект',
          options: [],
        },
        {
          type: 'date',
          name: 'deadline',
          placeholder: 'Дедлайн',
        },
      ],
    },
  },
};

export default content;
