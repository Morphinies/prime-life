import z from 'zod';

export const nullToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  schema.nullable().transform((v) => v ?? undefined);
