import pool from '@/core/database/postgres.config';
import { toSnakeCase } from '@/shared/utils';
import type {
  Project,
  ProjectCreate,
  ProjectDB,
  ProjectListFilters,
  ProjectUpdate,
} from './projects.types';

export class ProjectsRepository {
  transformProjectToDB({ createdAt, updatedAt, isArchived, ...project }: Project): ProjectDB {
    return {
      ...project,
      created_at: createdAt,
      updated_at: updatedAt,
      is_archived: isArchived,
      sort_order: project.sortOrder,
    };
  }

  transformProjectFromDB({
    created_at,
    updated_at,
    is_archived,
    sort_order,
    ...project
  }: ProjectDB): Project {
    return {
      ...project,
      createdAt: created_at,
      updatedAt: updated_at,
      isArchived: is_archived,
      sortOrder: sort_order,
    };
  }

  async findAll(filters: ProjectListFilters): Promise<Project[]> {
    const { project, search, status } = filters;
    const conditions: string[] = [];
    const values: unknown[] = [];

    conditions.push(status === 'archived' ? 'is_archived = true' : 'is_archived = false');

    if (project) {
      values.push(project);
      conditions.push(`title = $${values.length}`);
    }

    if (search) {
      values.push(`%${search}%`);
      conditions.push(
        `(title ILIKE $${values.length} OR COALESCE(description, '') ILIKE $${values.length})`
      );
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query<ProjectDB>(
      `SELECT * FROM projects ${whereClause} ORDER BY sort_order DESC, created_at ASC, title ASC`,
      values
    );

    return result.rows.map((row) => this.transformProjectFromDB(row));
  }

  async findById(id: string): Promise<Project | null> {
    const result = await pool.query<ProjectDB>('SELECT * FROM projects WHERE id = $1', [id]);
    const data = result.rows[0];
    return data ? this.transformProjectFromDB(data) : null;
  }

  async checkIsExist(id: string): Promise<boolean> {
    const result = await pool.query<{ exists: boolean }>(
      'SELECT EXISTS(SELECT 1 FROM projects WHERE id = $1) as exists',
      [id]
    );
    return result.rows[0].exists;
  }

  async create(project: ProjectCreate): Promise<Project> {
    const maxOrder = await pool.query<{ max: number }>(
      'SELECT COALESCE(MAX(sort_order), -1) as max FROM projects'
    );
    const max = Number(maxOrder.rows[0].max);
    const newSortOrder = max > 0 ? max + 1 : 1;

    const result = await pool.query<ProjectDB>(
      `INSERT INTO projects (title, description, sort_order)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [project.title, project.description, newSortOrder]
    );

    return this.transformProjectFromDB(result.rows[0]);
  }

  async update(id: string, project: ProjectUpdate): Promise<Project | null> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const currentProjectResult = await client.query<ProjectDB>(
        'SELECT * FROM projects WHERE id = $1 FOR UPDATE',
        [id]
      );
      const currentProject = currentProjectResult.rows[0];

      if (!currentProject) {
        await client.query('ROLLBACK');
        return null;
      }

      const fields: string[] = [];
      const values: unknown[] = [];
      let index = 1;

      for (const projectKey of Object.keys(project) as (keyof ProjectUpdate)[]) {
        const value = project[projectKey];

        if (value === undefined) continue;

        const updateFields: (keyof Project)[] = ['title', 'description', 'isArchived', 'sortOrder'];

        if (updateFields.includes(projectKey as keyof Project)) {
          fields.push(`${toSnakeCase(projectKey)} = $${index++}`);
          values.push(value);
        }
      }

      let updatedProjectRow = currentProject;

      if (fields.length > 0) {
        values.push(id);
        const updatedProjectResult = await client.query<ProjectDB>(
          `UPDATE projects SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
          values
        );
        updatedProjectRow = updatedProjectResult.rows[0];
      }

      if (project.title && project.title !== currentProject.title) {
        await client.query('UPDATE tasks SET project = $1 WHERE project = $2', [
          project.title,
          currentProject.title,
        ]);
      }

      await client.query('COMMIT');

      return this.transformProjectFromDB(updatedProjectRow);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async moveProject(projectId: string, newSortOrder: number): Promise<void> {
    await pool.query<ProjectDB>('UPDATE projects SET sort_order = $1 WHERE id = $2', [
      newSortOrder,
      projectId,
    ]);
  }

  async delete(id: string): Promise<boolean> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const projectResult = await client.query<{ title: string }>(
        'SELECT title FROM projects WHERE id = $1 FOR UPDATE',
        [id]
      );
      const project = projectResult.rows[0];

      if (!project) {
        await client.query('ROLLBACK');
        return false;
      }

      await client.query('DELETE FROM tasks WHERE project = $1', [project.title]);
      const result = await client.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);

      await client.query('COMMIT');

      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
