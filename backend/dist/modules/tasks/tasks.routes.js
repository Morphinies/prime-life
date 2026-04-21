"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_controller_1 = __importDefault(require("./tasks.controller"));
const router_factory_1 = require("../../core/router/router-factory");
const tasksRouter = new router_factory_1.Router('/tasks');
tasksRouter.addRoute('GET', '/', tasks_controller_1.default.getAllTasks);
tasksRouter.addRoute('GET', '/:id', tasks_controller_1.default.getTaskById);
tasksRouter.addRoute('POST', '/', tasks_controller_1.default.createTask);
tasksRouter.addRoute('PUT', '/:id/move', tasks_controller_1.default.moveTask);
tasksRouter.addRoute('PUT', '/reorder', tasks_controller_1.default.reorderTasks);
tasksRouter.addRoute('PUT', '/:id', tasks_controller_1.default.updateTask);
tasksRouter.addRoute('DELETE', '/:id', tasks_controller_1.default.deleteTask);
exports.default = tasksRouter;
