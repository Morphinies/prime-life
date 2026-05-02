import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes';

const routes: RouteConfig = [
  index('pages/home.tsx'),
  route('dashboard', 'pages/dashboard/index.tsx'),
  route('tasks', 'pages/tasks/index.tsx'),
  ...prefix('projects', [
    index('pages/projects/index.tsx'),
    route(':id', 'pages/projects/project/index.tsx'),
  ]),

  // route('finances', 'pages/finances.tsx'),
  // route('habits', 'pages/habits.tsx'),
  // route('settings', 'pages/settings.tsx'),
];

export default routes;
