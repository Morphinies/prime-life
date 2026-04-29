"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksRepository = void 0;
const utils_1 = require("../../shared/utils");
const postgres_config_1 = __importDefault(require("../../core/database/postgres.config"));
class TasksRepository {
    transformTaskToDB({ createdAt, updatedAt, isCompleted, isArchived, sortOrder, ...task }) {
        return {
            ...task,
            created_at: createdAt,
            updated_at: updatedAt,
            is_completed: isCompleted,
            is_archived: isArchived,
            sort_order: sortOrder,
        };
    }
    transformTaskFromDB({ created_at, updated_at, is_completed, is_archived, sort_order, ...task }) {
        return {
            ...task,
            createdAt: created_at,
            updatedAt: updated_at,
            isCompleted: is_completed,
            isArchived: is_archived,
            sortOrder: sort_order,
        };
    }
    async findAll(filters) {
        const { period, project } = filters;
        const whereByPeriod = {
            day: "deadline >= date_trunc('day', CURRENT_TIMESTAMP) AND deadline < date_trunc('day', CURRENT_TIMESTAMP) + interval '1 day'",
            week: "deadline >= date_trunc('week', CURRENT_TIMESTAMP) AND deadline < date_trunc('week', CURRENT_TIMESTAMP) + interval '1 week'",
            month: "deadline >= date_trunc('month', CURRENT_TIMESTAMP) AND deadline < date_trunc('month', CURRENT_TIMESTAMP) + interval '1 month'",
            overdue: "deadline IS NOT NULL AND deadline < date_trunc('day', CURRENT_TIMESTAMP)",
            completed: 'is_completed = true AND is_archived = false',
            archived: 'is_archived = true',
        };
        const conditions = [];
        const values = [];
        if (period === 'completed') {
            conditions.push(whereByPeriod.completed);
        }
        else if (period === 'archived') {
            conditions.push(whereByPeriod.archived);
        }
        else {
            conditions.push('is_completed = false');
            conditions.push('is_archived = false');
            if (period === 'overdue') {
                conditions.push(whereByPeriod.overdue);
            }
            else if (period !== 'all') {
                conditions.push(`deadline IS NOT NULL AND ${whereByPeriod[period]}`);
            }
        }
        if (project) {
            values.push(project);
            conditions.push(`project = $${values.length}`);
        }
        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const result = await postgres_config_1.default.query(`SELECT * FROM tasks ${whereClause} ORDER BY sort_order DESC`, values);
        return result.rows.map((row) => this.transformTaskFromDB(row));
    }
    async findById(id) {
        const result = await postgres_config_1.default.query('SELECT * FROM tasks WHERE id = $1', [id]);
        const data = result.rows[0];
        return data ? this.transformTaskFromDB(data) : null;
    }
    async checkIsExist(id) {
        const result = await postgres_config_1.default.query('SELECT EXISTS(SELECT 1 FROM tasks WHERE id = $1) as exists', [id]);
        return result.rows[0].exists;
    }
    async create(task) {
        const { title, description, section, project, priority, deadline } = task;
        const maxOrder = await postgres_config_1.default.query('SELECT COALESCE(MAX(sort_order), -1) as max FROM tasks');
        const max = Number(maxOrder.rows[0].max);
        const newSortOrder = max > 0 ? max + 1 : 1;
        const result = await postgres_config_1.default.query(`INSERT INTO tasks (title, description, section, project, priority, deadline, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`, [title, description, section, project, priority, deadline, newSortOrder]);
        const data = result.rows[0];
        return this.transformTaskFromDB(data);
    }
    async update(id, task) {
        const fields = [];
        const values = [];
        let index = 1;
        for (const taskKey of Object.keys(task)) {
            const updateFields = [
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
                fields.push(`${(0, utils_1.toSnakeCase)(taskKey)} = $${index++}`);
                values.push(task[taskKey]);
            }
        }
        if (fields.length === 0)
            return null;
        values.push(id);
        const result = await postgres_config_1.default.query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`, values);
        const data = result.rows[0];
        return data ? this.transformTaskFromDB(data) : null;
    }
    async moveTask(taskId, newSortOrder) {
        await postgres_config_1.default.query('UPDATE tasks SET sort_order = $1 WHERE id = $2', [
            newSortOrder,
            taskId,
        ]);
    }
    async reorderTasks(_items) {
        console.log('todo');
    }
    async delete(id) {
        const result = await postgres_config_1.default.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }
}
exports.TasksRepository = TasksRepository;
