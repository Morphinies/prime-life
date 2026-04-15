import z from 'zod';
import {
  reorderTasksSchema,
  taskCreateSchema,
  taskDBSchema,
  taskSchema,
  taskUpdateSchema,
} from './tasks.schemas';

export type Task = z.infer<typeof taskSchema>;
export type TaskCreate = z.infer<typeof taskCreateSchema>;
export type TaskUpdate = z.infer<typeof taskUpdateSchema>;

export type TaskDB = z.infer<typeof taskDBSchema>;

export type ReorderTasksProps = z.infer<typeof reorderTasksSchema>;
