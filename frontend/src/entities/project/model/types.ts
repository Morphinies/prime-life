export type ProjectListView = 'list';
export type ProjectListStatus = 'active' | 'archived';

export type Project = {
  id: string;
  title: string;
  description?: string;
  isArchived: boolean;
};

export type CreateProjectDto = Pick<Project, 'title' | 'description'>;
export type UpdateProjectDto = Partial<Project>;
export type ProjectEdit = Partial<Project>;

export type ProjectListFilters = {
  view: ProjectListView;
  status: ProjectListStatus;
  project?: string;
};
