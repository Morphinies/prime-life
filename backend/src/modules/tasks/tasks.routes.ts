import tasksController from './tasks.controller';
import { Router } from '@/core/router/router-factory';

const tasksRouter = new Router('/tasks');

tasksRouter.addRoute('GET', '/', tasksController.getAllTasks);
tasksRouter.addRoute('GET', '/:id', tasksController.getTaskById);
tasksRouter.addRoute('POST', '/', tasksController.createTask);
tasksRouter.addRoute('PUT', '/:id/move', tasksController.moveTask);
tasksRouter.addRoute('PUT', '/reorder', tasksController.reorderTasks);
tasksRouter.addRoute('PUT', '/:id', tasksController.updateTask);
tasksRouter.addRoute('DELETE', '/:id', tasksController.deleteTask);

export default tasksRouter;
