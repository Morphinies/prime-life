import type { HeadControllerConfigProps } from './ui/HeadController';
import type { ModalProjectProps } from './ui/ModalProject';
import type { TaskListProps } from '@/widgets/TaskList';

const content: {
  modalProject: Pick<ModalProjectProps, 'fields'>;
  modalTask: TaskListProps['modalTask'];
  headController: Omit<HeadControllerConfigProps, 'projectFilters' | 'title'>;
} = {
  headController: {
    statusFilters: [
      { label: 'Активные', value: 'active' },
      { label: 'Архив', value: 'archived' },
    ],
    viewSettings: [{ label: 'Список', value: 'list', iconName: 'BarsOutlined' }],
  },
  modalProject: {
    fields: [
      {
        name: 'title',
        placeholder: 'Название проекта',
        rules: [{ required: true, message: 'Пожалуйста, укажите название проекта' }],
      },
      {
        type: 'textarea',
        name: 'description',
        placeholder: 'Описание проекта',
      },
    ],
  },
  modalTask: {
    fieldSets: [
      {
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
          {
            type: 'select',
            name: 'project',
            placeholder: 'Проект',
            creatable: true,
            options: [],
          },
        ],
      },
      {
        vertical: false,
        fields: [
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
            type: 'date',
            name: 'deadline',
            placeholder: 'Дедлайн',
          },
        ],
      },
    ],
  },
};

export default content;
