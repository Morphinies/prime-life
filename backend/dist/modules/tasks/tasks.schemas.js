"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskPublicArraySchema = exports.reorderTasksSchema = exports.taskPublicSchema = exports.taskUpdateSchema = exports.taskCreateSchema = exports.taskDBSchema = exports.taskSchema = exports.taskListFiltersSchema = exports.taskListPeriodSchema = void 0;
const zod_1 = require("../../shared/utils/zod");
const zod_2 = __importDefault(require("zod"));
exports.taskListPeriodSchema = zod_2.default.enum(['day', 'week', 'month', 'overdue', 'all']);
exports.taskListFiltersSchema = zod_2.default.object({
    period: exports.taskListPeriodSchema.optional().default('day'),
    project: zod_2.default.string().optional(),
});
exports.taskSchema = zod_2.default.object({
    id: zod_2.default.string(),
    title: zod_2.default.string(),
    description: zod_2.default.string().nullable().optional(),
    section: zod_2.default.string().nullable().optional(),
    project: zod_2.default.string().nullable().optional(),
    priority: zod_2.default.enum(['low', 'medium', 'high']).nullable().optional(),
    deadline: zod_2.default.date().nullable().optional(),
    isCompleted: zod_2.default.boolean(),
    isArchived: zod_2.default.boolean(),
    createdAt: zod_2.default.date(),
    updatedAt: zod_2.default.date(),
    sortOrder: zod_2.default.coerce.number(),
});
exports.taskDBSchema = exports.taskSchema
    .omit({
    isCompleted: true,
    isArchived: true,
    createdAt: true,
    updatedAt: true,
    sortOrder: true,
})
    .extend({
    is_completed: exports.taskSchema.shape.isCompleted,
    is_archived: exports.taskSchema.shape.isArchived,
    created_at: exports.taskSchema.shape.createdAt,
    updated_at: exports.taskSchema.shape.updatedAt,
    sort_order: exports.taskSchema.shape.sortOrder,
});
exports.taskCreateSchema = exports.taskSchema
    .omit({
    id: true,
    isCompleted: true,
    isArchived: true,
    createdAt: true,
    updatedAt: true,
    deadline: true,
    sortOrder: true,
})
    .extend({
    deadline: zod_2.default.preprocess((val) => {
        return typeof val === 'string' ? new Date(val) : undefined;
    }, zod_2.default.date().optional()),
});
exports.taskUpdateSchema = exports.taskCreateSchema
    .extend({
    isCompleted: exports.taskSchema.shape.isCompleted.optional(),
    isArchived: exports.taskSchema.shape.isArchived.optional(),
    sortOrder: exports.taskSchema.shape.isArchived.optional(),
})
    .partial();
exports.taskPublicSchema = exports.taskSchema
    .omit({
    updatedAt: true,
    createdAt: true,
})
    .extend({
    section: (0, zod_1.nullToUndefined)(zod_2.default.string()),
    project: (0, zod_1.nullToUndefined)(zod_2.default.string()),
    priority: (0, zod_1.nullToUndefined)(zod_2.default.string()),
    deadline: (0, zod_1.nullToUndefined)(zod_2.default.coerce.string()),
    description: (0, zod_1.nullToUndefined)(zod_2.default.string()),
});
exports.reorderTasksSchema = zod_2.default.array(exports.taskSchema.pick({
    id: true,
    sortOrder: true,
}));
exports.taskPublicArraySchema = zod_2.default.array(exports.taskPublicSchema);
