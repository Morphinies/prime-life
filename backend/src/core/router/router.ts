import { Router } from './router-factory';
import authRouter from '@/modules/auth/auth.routes';
import tasksRouter from '@/modules/tasks/tasks.routes';

export const router = new Router('/', [authRouter, tasksRouter]);

export default router;
