import type { TasksSectionsProps } from './ui/TasksSections';
import type { HeadControllerProps } from './ui/HeadController';

const content: {
  headController: HeadControllerProps;
  tasksSections: TasksSectionsProps;
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
  },
  tasksSections: {
    sections: [
      {
        title: 'Веб-разработка',
        tasks: [
          {
            id: '1',
            title: 'Разработка API для пользователей',
            description: 'Создать REST API для управления пользователями с аутентификацией',
            priority: 'high',
            deadline: '25 дек',
          },
          {
            id: '2',
            title: 'Настройка базы данных',
            description: 'Настроить PostgreSQL и создать схему БД',
            priority: 'medium',
            deadline: '24 дек',
          },
        ],
      },
      {
        title: 'Мобильное приложение',
        tasks: [
          {
            id: '3',
            title: 'Дизайн главного экрана',
            description: 'Создать макет главного экрана приложения',
            priority: 'high',
            deadline: '25 дек',
          },
          {
            id: '4',
            title: 'Интеграция с API',
            description: 'Подключить мобильное приложение к серверному API',
            priority: 'medium',
            deadline: '24 дек',
          },
        ],
      },
    ],
  },
};

export default content;
