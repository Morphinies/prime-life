export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    check: '/auth/check',
  },
  tasks: {
    list: '/tasks',
    detail: (id: string) => `/tasks/${id}`,
    create: '/tasks',
    update: (id: string) => `/tasks/${id}`,
    delete: (id: string) => `/tasks/${id}`,
    move: (id: string) => `/tasks/${id}/move`,
  },
} as const;
