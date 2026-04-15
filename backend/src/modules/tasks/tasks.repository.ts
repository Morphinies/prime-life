import { toSnakeCase } from '@/shared/utils';
import pool from '@/core/database/postgres.config';
import type { ReorderTasksProps, Task, TaskCreate, TaskDB, TaskUpdate } from './tasks.types';

export class TasksRepository {
  transformTaskToDB({
    createdAt,
    updatedAt,
    isCompleted,
    isArchived,
    sortOrder,
    ...task
  }: Task): TaskDB {
    return {
      ...task,
      created_at: createdAt,
      updated_at: updatedAt,
      is_completed: isCompleted,
      is_archived: isArchived,
      sort_order: sortOrder,
    };
  }

  transformTaskFromDB({
    created_at,
    updated_at,
    is_completed,
    is_archived,
    sort_order,
    ...task
  }: TaskDB): Task {
    return {
      ...task,
      createdAt: created_at,
      updatedAt: updated_at,
      isCompleted: is_completed,
      isArchived: is_archived,
      sortOrder: sort_order,
    };
  }

  async findAll(): Promise<Task[]> {
    const result = await pool.query<TaskDB>('SELECT * FROM tasks ORDER BY sort_order DESC');
    return result.rows.map((row) => this.transformTaskFromDB(row));
  }

  async findById(id: string): Promise<Task | null> {
    const result = await pool.query<TaskDB>('SELECT * FROM tasks WHERE id = $1', [id]);
    const data = result.rows[0];
    return data ? this.transformTaskFromDB(data) : null;
  }

  async checkIsExist(id: string): Promise<boolean> {
    const result = await pool.query<{ exists: boolean }>(
      'SELECT EXISTS(SELECT 1 FROM tasks WHERE id = $1) as exists',
      [id]
    );
    return result.rows[0].exists;
  }

  async create(task: TaskCreate): Promise<Task> {
    const { title, description, section, project, priority, deadline } = task;
    const maxOrder = await pool.query<{ max: number }>(
      'SELECT COALESCE(MAX(sort_order), -1) as max FROM tasks'
    );
    const newSortOrder = maxOrder.rows[0].max + 1;

    const result = await pool.query<TaskDB>(
      `INSERT INTO tasks (title, description, section, project, priority, deadline, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, section, project, priority, deadline, newSortOrder]
    );
    const data = result.rows[0];
    return this.transformTaskFromDB(data);
  }

  async update(id: string, task: TaskUpdate): Promise<Task | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (let taskKey of Object.keys(task) as [keyof typeof task]) {
      const updateFields: (keyof Partial<Task>)[] = [
        'title',
        'section',
        'project',
        'priority',
        'deadline',
        'isCompleted',
        'isArchived',
        'description',
        'sortOrder',
      ];
      if (updateFields.includes(taskKey)) {
        fields.push(`${toSnakeCase(taskKey)} = $${index++}`);
        values.push(task[taskKey]);
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query<TaskDB>(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
      values
    );
    const data = result.rows[0];
    return data ? this.transformTaskFromDB(data) : null;
  }

  // Перемещение задачи в новую позицию
  async moveTask(taskId: string, newSortOrder: number): Promise<void> {
    await pool.query<TaskDB>('UPDATE tasks SET sort_order = $1 WHERE id = $2', [
      newSortOrder,
      taskId,
    ]);
  }

  async reorderTasks(items: ReorderTasksProps): Promise<void> {
    console.log('todo');
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
