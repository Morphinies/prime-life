import { type RouteConfig, index, route } from '@react-router/dev/routes';

const routes: RouteConfig = [
  index('pages/home.tsx'),
  route('dashboard', 'pages/dashboard/index.tsx'),
  route('tasks', 'pages/tasks/index.tsx'),
  route('projects', 'pages/projects/index.tsx'),

  // route('tasks', 'pages/tasks.tsx'),
  // route('projects', 'pages/projects.tsx'),
  // route('finances', 'pages/finances.tsx'),
  // route('habits', 'pages/habits.tsx'),
  // route('settings', 'pages/settings.tsx'),
];

export default routes;
