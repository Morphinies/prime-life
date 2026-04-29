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
    };
  }

  transformProjectFromDB({ created_at, updated_at, is_archived, ...project }: ProjectDB): Project {
    return {
      ...project,
      createdAt: created_at,
      updatedAt: updated_at,
      isArchived: is_archived,
    };
  }

  async findAll(filters: ProjectListFilters): Promise<Project[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];

    conditions.push(filters.status === 'archived' ? 'is_archived = true' : 'is_archived = false');

    if (filters.project) {
      values.push(filters.project);
      conditions.push(`title = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query<ProjectDB>(
      `SELECT * FROM projects ${whereClause} ORDER BY title ASC`,
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
    const result = await pool.query<ProjectDB>(
      `INSERT INTO projects (title, description)
       VALUES ($1, $2)
       RETURNING *`,
      [project.title, project.description]
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

        const updateFields: (keyof Project)[] = ['title', 'description', 'isArchived'];

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
