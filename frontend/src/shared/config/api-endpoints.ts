import type { Task } from '../ui/TaskCard';

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    check: '/auth/check',
  },
  tasks: {
    list: '/tasks',
    detail: (id: Task['id']) => `/tasks/${id}`,
    create: '/tasks',
    update: (id: Task['id']) => `/tasks/${id}`,
    delete: (id: Task['id']) => `/tasks/${id}`,
  },
} as const;
