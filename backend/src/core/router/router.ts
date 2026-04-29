import { Router } from './router-factory';
import authRouter from '@/modules/auth/auth.routes';
import projectsRouter from '@/modules/projects/projects.routes';
import tasksRouter from '@/modules/tasks/tasks.routes';

export const router = new Router('/', [authRouter, tasksRouter, projectsRouter]);

export default router;
