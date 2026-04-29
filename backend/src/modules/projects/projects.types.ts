import z from 'zod';
import {
  projectCreateSchema,
  projectDBSchema,
  projectListFiltersSchema,
  projectSchema,
  projectUpdateSchema,
} from './projects.schemas';

export type Project = z.infer<typeof projectSchema>;
export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
export type ProjectDB = z.infer<typeof projectDBSchema>;
export type ProjectListFilters = z.infer<typeof projectListFiltersSchema>;
