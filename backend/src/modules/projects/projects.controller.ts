import {
  projectCreateSchema,
  projectListFiltersSchema,
  projectPublicArraySchema,
  projectPublicSchema,
  projectUpdateSchema,
} from './projects.schemas';
import { ProjectsService } from './projects.service';
import { RouteHandlerProps } from '@/core/router';

export class ProjectsController {
  private projectsService: ProjectsService;

  constructor() {
    this.projectsService = new ProjectsService();
  }

  getAllProjects = async ({ res, query }: RouteHandlerProps) => {
    const filters = projectListFiltersSchema.parse(query || {});
    const projects = await this.projectsService.getAllProjects(filters);
    const publicProjects = projectPublicArraySchema.parse(projects);
    res.json(publicProjects);
  };

  getProjectById = async ({ res, params }: RouteHandlerProps) => {
    const id = params?.id;
    if (!id) return res.json({ error: 'id parameter must be specified' }, 400);

    const project = await this.projectsService.getProjectById(id);
    const publicProject = projectPublicSchema.parse(project);
    res.json(publicProject);
  };

  createProject = async ({ req, res }: RouteHandlerProps) => {
    const validatedData = projectCreateSchema.parse(req.body);
    const project = await this.projectsService.createProject(validatedData);
    const publicProject = projectPublicSchema.parse(project);
    res.json(publicProject);
  };

  updateProject = async ({ req, res, params }: RouteHandlerProps) => {
    const id = params?.id;
    if (!id) return res.json({ error: 'id parameter must be specified' }, 400);

    const projectIsExist = await this.projectsService.checkProjectIsExist(id);
    if (!projectIsExist) return res.json({ error: `Project with id "${id}" is not found` }, 400);

    const validatedData = projectUpdateSchema.parse(req.body);
    const project = await this.projectsService.updateProject(id, validatedData);
    const publicProject = projectPublicSchema.parse(project);
    res.json(publicProject);
  };

  deleteProject = async ({ res, params }: RouteHandlerProps) => {
    const id = params?.id;
    if (!id) return res.json({ error: 'id parameter must be specified' }, 400);

    const projectIsExist = await this.projectsService.checkProjectIsExist(id);
    if (!projectIsExist) return res.json({ error: `Project with id "${id}" is not found` }, 400);

    const isDeleted = await this.projectsService.deleteProject(id);
    res.json({ success: isDeleted });
  };
}

const projectsController = new ProjectsController();
export default projectsController;
