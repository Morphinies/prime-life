import { nullToUndefined } from '@/shared/utils/zod';
import z from 'zod';

export const taskListPeriodSchema = z.enum([
  'day',
  'week',
  'month',
  'overdue',
  'completed',
  'archived',
  'all',
]);

export const taskListFiltersSchema = z.object({
  period: taskListPeriodSchema.optional().default('all'),
  project: z.string().optional(),
});

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  section: z.string().nullable().optional(),
  project: z.string().nullable().optional(),
  priority: z.enum(['low', 'medium', 'high']).nullable().optional(),
  deadline: z.date().nullable().optional(),
  isCompleted: z.boolean(),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  sortOrder: z.coerce.number(),
});

export const taskDBSchema = taskSchema
  .omit({
    isCompleted: true,
    isArchived: true,
    createdAt: true,
    updatedAt: true,
    sortOrder: true,
  })
  .extend({
    is_completed: taskSchema.shape.isCompleted,
    is_archived: taskSchema.shape.isArchived,
    created_at: taskSchema.shape.createdAt,
    updated_at: taskSchema.shape.updatedAt,
    sort_order: taskSchema.shape.sortOrder,
  });

export const taskCreateSchema = taskSchema
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
    deadline: z.preprocess((val) => {
      return typeof val === 'string' ? new Date(val) : undefined;
    }, z.date().optional()),
  });

export const taskUpdateSchema = taskCreateSchema
  .extend({
    isCompleted: taskSchema.shape.isCompleted.optional(),
    isArchived: taskSchema.shape.isArchived.optional(),
    sortOrder: taskSchema.shape.isArchived.optional(),
  })
  .partial();

export const taskPublicSchema = taskSchema
  .omit({
    updatedAt: true,
    createdAt: true,
  })
  .extend({
    section: nullToUndefined(z.string()),
    project: nullToUndefined(z.string()),
    priority: nullToUndefined(z.string()),
    deadline: nullToUndefined(z.coerce.string()),
    description: nullToUndefined(z.string()),
  });

export const reorderTasksSchema = z.array(
  taskSchema.pick({
    id: true,
    sortOrder: true,
  })
);

export const taskPublicArraySchema = z.array(taskPublicSchema);
