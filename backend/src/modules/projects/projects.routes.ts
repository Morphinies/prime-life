import projectsController from './projects.controller';
import { Router } from '@/core/router/router-factory';

const projectsRouter = new Router('/projects');

projectsRouter.addRoute('GET', '/', projectsController.getAllProjects);
projectsRouter.addRoute('GET', '/:id', projectsController.getProjectById);
projectsRouter.addRoute('POST', '/', projectsController.createProject);
projectsRouter.addRoute('PUT', '/:id', projectsController.updateProject);
projectsRouter.addRoute('DELETE', '/:id', projectsController.deleteProject);

export default projectsRouter;
