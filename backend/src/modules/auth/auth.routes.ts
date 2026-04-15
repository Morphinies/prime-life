import authController from './auth.controller';
import { Router } from '@/core/router/router-factory';

const authRouter = new Router('/auth');

authRouter.addRoute('GET', '/login', authController.login);

export default authRouter;
