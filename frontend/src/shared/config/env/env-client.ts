import envSchema from './env-schema';
import { prepareEnv } from './common';

export const clientEnv = envSchema.safeParse(prepareEnv(import.meta.env)).data!;
