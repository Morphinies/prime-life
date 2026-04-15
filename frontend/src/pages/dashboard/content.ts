import { COLORS } from '@/app/constants';
import type { TasksProps } from '@/pages/dashboard/ui/Tasks';
import type { ProgressProps } from '@/pages/dashboard/ui/Progress';
import type { StatisticsProps } from '@/pages/dashboard/ui/Statistics';
import type { FastActionsProps } from '@/pages/dashboard/ui/FastActions';
import type { ProjectsProps } from '@/pages/dashboard/ui/Projects';
import type { HabitsProps } from '@/pages/dashboard/ui/Habits';
import type { FinanceProps } from './ui/Finance';

const content: {
  progress: ProgressProps;
  statistics: StatisticsProps;
  fastActions: FastActionsProps;
  tasks: TasksProps;
  projects: ProjectsProps;
  habits: HabitsProps;
  finance: FinanceProps;
} = {
  progress: {
    percent: 75,
    title: 'Прогресс дня',
    desc: '6 из 8 задач',
    descRight: '+2 сегодня',
  },
  statistics: {
    title: 'Статистика',
    list: [
      {
        id: '1',
        percent: 100,
        status: 'success',
        label: 'Спринт задач | неделя',
      },
      {
        id: '2',
        percent: 60,
        color: COLORS.purple,
        label: 'Спринт задач | месяц',
      },
      {
        id: '3',
        percent: 40,
        color: COLORS.volcano,
        label: 'Спринт привычек | месяц',
      },
      {
        id: '4',
        percent: 30,
        color: COLORS.geekblue,
        label: 'Активные задачи',
      },
      {
        id: '5',
        percent: 40,
        color: COLORS.magenta,
        label: 'Финаносовая цель | Месяц',
      },
      {
        id: '5',
        percent: 40,
        color: COLORS.volcano,
        label: 'Финаносовая цель | Год',
      },
    ],
  },
  fastActions: {
    title: 'Быстрые действия',
    list: [
      { children: 'Новая задача', color: 'primary' },
      { children: 'Создать проект' },
      { children: 'Добавить Доход' },
      { children: 'Добавить расход' },
    ],
  },
  tasks: {
    title: 'Ближайшие задачи',
    list: [
      {
        id: '1',
        title: 'Завершить документацию',
        section: 'Работа',
        deadline: 'Сегодня, 18:00',
        priority: 'high',
      },
      {
        id: '2',
        title: 'Завершить документацию',
        section: 'Работа',
        deadline: 'Сегодня, 18:00',
        priority: 'medium',
      },
      {
        id: '3',
        title: 'Завершить документацию',
        section: 'Работа',
        deadline: 'Сегодня, 18:00',
        priority: 'low',
      },
    ],
  },
  projects: {
    title: 'Активные проекты',
    list: [
      {
        id: 'project-1',
        title: 'Редизайн веб-приложения',
        text: ['12 задач', 'Дедлайн: 25 марта'],
        progress: {
          percent: 68,
        },
        tag: {
          children: 'В процессе',
        },
      },
      {
        id: 'project-2',
        color: 'green',
        title: 'Маркетинговая кампания',
        text: ['8 задач', 'Дедлайн: 15 апреля'],
        progress: {
          percent: 50,
        },
        tag: {
          children: 'В процессе',
        },
      },
      {
        id: 'project-3',
        color: 'orange',
        title: 'Редизайн веб-приложения',
        text: ['12 задач', 'Дедлайн: 25 марта'],
        progress: {
          percent: 15,
        },
        tag: {
          children: 'В процессе',
        },
      },
    ],
  },
  habits: {
    title: 'Трекер привычек',
    list: [
      { icon: 'AimOutlined', title: 'Тренировка', done: true },
      { icon: 'ReadOutlined', title: 'Чтение', done: false },
      { icon: 'AimOutlined', title: 'Вода 2л', done: true },
      { icon: 'AimOutlined', title: 'Сон 8ч', done: true },
    ],
  },
  finance: {
    title: 'Финансовый обзор',
    cards: [
      {
        label: 'Доходы',
        title: '85 400 ₽',
        desc: '+12% к прошлому месяцу',
        color: 'green',
      },
      {
        label: 'Расходы',
        title: '42 150 ₽',
        desc: '-5% к прошлому месяцу',
        color: 'red',
      },
      {
        label: 'Баланс',
        title: '43 250 ₽',
        desc: 'Отлично!',
        color: 'blue',
      },
    ],
    list: [
      {
        title: 'Жильё',
        value: '20 000 ₽',
        color: 'purple',
      },
      {
        title: 'Еда',
        value: '20 000 ₽',
        color: 'volcano',
      },
      {
        title: 'Транспорт',
        value: '6 000 ₽',
        color: 'cyan',
      },
    ],
  },
};

export default content;
