import {
  taskCreateSchema,
  taskPublicSchema,
  taskUpdateSchema,
  taskPublicArraySchema,
  reorderTasksSchema,
} from './tasks.schemas';
import { TasksService } from './tasks.service';
import { RouteHandlerProps } from '@/core/router';

export class TasksController {
  private tasksService: TasksService;

  constructor() {
    this.tasksService = new TasksService();
  }

  getAllTasks = async ({ res }: RouteHandlerProps) => {
    const tasks = await this.tasksService.getAllTasks();
    const publicTasks = taskPublicArraySchema.parse(tasks);
    res.json(publicTasks);
  };

  getTaskById = async ({ res, params }: RouteHandlerProps) => {
    const id = params?.id;
    if (!id) return res.json({ error: 'id parameter must be specified' }, 400);
    const task = await this.tasksService.getTaskById(id);
    const publicTask = taskPublicSchema.parse(task);
    res.json(publicTask);
  };

  createTask = async ({ req, res }: RouteHandlerProps) => {
    const validatedData = taskCreateSchema.parse(req.body);
    const task = await this.tasksService.createTask(validatedData);
    const publicTask = taskPublicSchema.parse(task);
    res.json(publicTask);
  };

  updateTask = async ({ req, res, params }: RouteHandlerProps) => {
    const id = params?.id;
    if (!id) return res.json({ error: 'id parameter must be specified' }, 400);
    const taskIsExist = await this.tasksService.checkTaskIsExist(id);
    if (!taskIsExist) return res.json({ error: `Task with id "${id}" is not found` }, 400);

    const validatedData = taskUpdateSchema.parse(req.body);
    const task = await this.tasksService.updateTask(id, validatedData);
    const publicTask = taskPublicSchema.parse(task);
    res.json(publicTask);
  };

  moveTask = async ({ req, res, params }: RouteHandlerProps) => {
    const id = params?.id;
    if (!id) return res.json({ error: 'id parameter must be specified' }, 400);

    const { sortOrder } = req.body as { sortOrder: number };
    if (sortOrder === undefined) {
      return res.json({ error: 'sortOrder is required' }, 400);
    }

    await this.tasksService.moveTask(id, sortOrder);
    res.json({ success: true });
  };

  reorderTasks = async ({ req, res }: RouteHandlerProps) => {
    const validatedData = reorderTasksSchema.parse(req.body);
    await this.tasksService.reorderTasks(validatedData);
    res.json({ success: true });
  };

  deleteTask = async ({ res, params }: RouteHandlerProps) => {
    const id = params?.id;
    if (!id) return res.json({ error: 'id parameter must be specified' }, 400);
    const taskIsExist = await this.tasksService.checkTaskIsExist(id);
    if (!taskIsExist) return res.json({ error: `Task with id "${id}" is not found` }, 400);

    const isDeleted = await this.tasksService.deleteTask(id);
    res.json({ success: isDeleted });
  };
}

const tasksController = new TasksController();
export default tasksController;
