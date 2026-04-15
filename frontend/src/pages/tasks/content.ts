import type { TaskListProps } from './ui/TaskList';
import type { HeadControllerProps } from './ui/HeadController';

const content: {
  tasks: TaskListProps;
  headController: HeadControllerProps;
} = {
  headController: {
    periodFilters: [
      { children: 'Сегодня', id: 'day' },
      { children: 'Неделя', id: 'week' },
      { children: 'Месяц', id: 'month' },
      { children: 'Все', id: 'all' },
    ],
    viewSettings: [
      { children: 'Список', id: 'day', iconName: 'BarsOutlined' },
      //   { children: 'Ячейки', id: 'week', iconName: 'AppstoreOutlined' },
    ],
    title: '4 апр ‧ Сегодня ‧ Суббота',
  },
  tasks: {
    list: [
      {
        id: '1',
        title: 'Разработка API для пользователей',
        description: 'Создать REST API для управления пользователями с аутентификацией',
        priority: 'high',
        deadline: '25 дек',
        project: 'Проект 1',
      },
      {
        id: '2',
        title: 'Настройка базы данных',
        description: 'Настроить PostgreSQL и создать схему БД',
        priority: 'medium',
        deadline: '24 дек',
        project: 'Проект 1',
      },
      {
        id: '3',
        title: 'Дизайн главного экрана',
        description: 'Создать макет главного экрана приложения',
        priority: 'high',
        deadline: '25 дек',
        project: 'Проект 1',
      },
      {
        id: '4',
        title: 'Интеграция с API',
        description: 'Подключить мобильное приложение к серверному API',
        priority: 'medium',
        deadline: '24 дек',
        project: 'Проект 1',
      },
    ],
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
          options: [
            { label: 'проект 1', value: 'pro 1' },
            { label: 'проект 2', value: 'pro 2' },
            { label: 'проект 3', value: 'pro 3' },
          ],
        },
        {
          type: 'date',
          name: 'deadline',
          placeholder: 'Дата',
        },
      ],
    },
  },
};

export default content;
