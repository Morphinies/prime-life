"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const tasks_repository_1 = require("./tasks.repository");
class TasksService {
    repository;
    constructor() {
        this.repository = new tasks_repository_1.TasksRepository();
    }
    async getAllTasks(filters) {
        return this.repository.findAll(filters);
    }
    async getTaskById(id) {
        return this.repository.findById(id);
    }
    async checkTaskIsExist(id) {
        return this.repository.checkIsExist(id);
    }
    async createTask(task) {
        return this.repository.create(task);
    }
    async updateTask(id, task) {
        return this.repository.update(id, task);
    }
    async moveTask(id, newSortOrder) {
        return this.repository.moveTask(id, newSortOrder);
    }
    async reorderTasks(items) {
        return this.repository.reorderTasks(items);
    }
    async deleteTask(id) {
        return this.repository.delete(id);
    }
}
exports.TasksService = TasksService;
