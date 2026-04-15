import { z } from 'zod';
import path from 'path';
import { loadEnv } from 'vite';
import envSchema from './env-schema';
import { envPrefix, prepareEnv } from './common';

export const envDir = path.join(process.cwd(), '..');

export type Env = z.infer<typeof envSchema>;

export function loadValidEnv(mode: string) {
  const env = loadEnv(mode, envDir, envPrefix);
  const preparedEnv = prepareEnv(env);

  const envValidation = envSchema.safeParse(preparedEnv);
  if (!envValidation.success) {
    throw new Error(`Env variables was setted incorrect. Error: \n ${envValidation.error}`);
  }
  return envValidation.data;
}
