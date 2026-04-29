import { ProjectsRepository } from './projects.repository';
import type { Project, ProjectCreate, ProjectListFilters, ProjectUpdate } from './projects.types';

export class ProjectsService {
  private repository: ProjectsRepository;

  constructor() {
    this.repository = new ProjectsRepository();
  }

  async getAllProjects(filters: ProjectListFilters): Promise<Project[]> {
    return this.repository.findAll(filters);
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.repository.findById(id);
  }

  async checkProjectIsExist(id: string): Promise<boolean> {
    return this.repository.checkIsExist(id);
  }

  async createProject(project: ProjectCreate): Promise<Project> {
    return this.repository.create(project);
  }

  async updateProject(id: string, project: ProjectUpdate): Promise<Project | null> {
    return this.repository.update(id, project);
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
