import { CorsOptions } from '@/core/middleware/cors';
import { env } from './env';

export const corsConfig: CorsOptions = {
  origin: env.ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Rate-Limit'],
  credentials: true,
  maxAge: 86400,
};
