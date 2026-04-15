import path from 'path';
import { z } from 'zod';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config({
  path: path.resolve('../.env'),
});

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  CLIENT_PORT: z.coerce.number(),
  ALLOWED_ORIGINS: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        if (val.trim().startsWith('[')) return JSON.parse(val);
        else return val.trim();
      }
    },
    z.string().or(z.array(z.string()))
  ),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
