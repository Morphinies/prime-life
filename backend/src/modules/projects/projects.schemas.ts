import { nullToUndefined } from '@/shared/utils/zod';
import z from 'zod';

export const projectListFiltersSchema = z.object({
  project: z.string().optional(),
  status: z.enum(['active', 'archived']).optional().default('active'),
});

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const projectDBSchema = projectSchema
  .omit({
    isArchived: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    is_archived: projectSchema.shape.isArchived,
    created_at: projectSchema.shape.createdAt,
    updated_at: projectSchema.shape.updatedAt,
  });

export const projectCreateSchema = projectSchema.omit({
  id: true,
  isArchived: true,
  createdAt: true,
  updatedAt: true,
});

export const projectUpdateSchema = projectCreateSchema
  .extend({
    isArchived: projectSchema.shape.isArchived.optional(),
  })
  .partial();

export const projectPublicSchema = projectSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    description: nullToUndefined(z.string()),
  });

export const projectPublicArraySchema = z.array(projectPublicSchema);
