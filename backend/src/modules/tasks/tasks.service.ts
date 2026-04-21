import { TasksRepository } from './tasks.repository';
import type { ReorderTasksProps, Task, TaskCreate, TaskListFilters, TaskUpdate } from './tasks.types';

export class TasksService {
  private repository: TasksRepository;

  constructor() {
    this.repository = new TasksRepository();
  }

  async getAllTasks(filters: TaskListFilters): Promise<Task[]> {
    return this.repository.findAll(filters);
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.repository.findById(id);
  }

  async checkTaskIsExist(id: string): Promise<boolean> {
    return this.repository.checkIsExist(id);
  }

  async createTask(task: TaskCreate): Promise<Task> {
    return this.repository.create(task);
  }

  async updateTask(id: string, task: TaskUpdate): Promise<Task | null> {
    return this.repository.update(id, task);
  }

  async moveTask(id: string, newSortOrder: number): Promise<void> {
    return this.repository.moveTask(id, newSortOrder);
  }

  async reorderTasks(items: ReorderTasksProps): Promise<void> {
    return this.repository.reorderTasks(items);
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
