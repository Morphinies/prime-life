"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const tasks_schemas_1 = require("./tasks.schemas");
const tasks_service_1 = require("./tasks.service");
class TasksController {
    tasksService;
    constructor() {
        this.tasksService = new tasks_service_1.TasksService();
    }
    getAllTasks = async ({ res, query }) => {
        const filters = tasks_schemas_1.taskListFiltersSchema.parse(query || {});
        const tasks = await this.tasksService.getAllTasks(filters);
        const publicTasks = tasks_schemas_1.taskPublicArraySchema.parse(tasks);
        res.json(publicTasks);
    };
    getTaskById = async ({ res, params }) => {
        const id = params?.id;
        if (!id)
            return res.json({ error: 'id parameter must be specified' }, 400);
        const task = await this.tasksService.getTaskById(id);
        const publicTask = tasks_schemas_1.taskPublicSchema.parse(task);
        res.json(publicTask);
    };
    createTask = async ({ req, res }) => {
        const validatedData = tasks_schemas_1.taskCreateSchema.parse(req.body);
        const task = await this.tasksService.createTask(validatedData);
        const publicTask = tasks_schemas_1.taskPublicSchema.parse(task);
        res.json(publicTask);
    };
    updateTask = async ({ req, res, params }) => {
        const id = params?.id;
        if (!id)
            return res.json({ error: 'id parameter must be specified' }, 400);
        const taskIsExist = await this.tasksService.checkTaskIsExist(id);
        if (!taskIsExist)
            return res.json({ error: `Task with id "${id}" is not found` }, 400);
        const validatedData = tasks_schemas_1.taskUpdateSchema.parse(req.body);
        const task = await this.tasksService.updateTask(id, validatedData);
        const publicTask = tasks_schemas_1.taskPublicSchema.parse(task);
        res.json(publicTask);
    };
    moveTask = async ({ req, res, params }) => {
        const id = params?.id;
        if (!id)
            return res.json({ error: 'id parameter must be specified' }, 400);
        const { sortOrder } = req.body;
        if (sortOrder === undefined) {
            return res.json({ error: 'sortOrder is required' }, 400);
        }
        await this.tasksService.moveTask(id, sortOrder);
        res.json({ success: true });
    };
    reorderTasks = async ({ req, res }) => {
        const validatedData = tasks_schemas_1.reorderTasksSchema.parse(req.body);
        await this.tasksService.reorderTasks(validatedData);
        res.json({ success: true });
    };
    deleteTask = async ({ res, params }) => {
        const id = params?.id;
        if (!id)
            return res.json({ error: 'id parameter must be specified' }, 400);
        const taskIsExist = await this.tasksService.checkTaskIsExist(id);
        if (!taskIsExist)
            return res.json({ error: `Task with id "${id}" is not found` }, 400);
        const isDeleted = await this.tasksService.deleteTask(id);
        res.json({ success: isDeleted });
    };
}
exports.TasksController = TasksController;
const tasksController = new TasksController();
exports.default = tasksController;
