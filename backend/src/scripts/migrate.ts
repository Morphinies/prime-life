import { resolve } from 'path';
import pool from '@/core/database/postgres.config';

const runMigrations = async () => {
  try {
    // @ts-ignore
    const { runner } = await import('node-pg-migrate');

    await runner({
      dbClient: pool,
      direction: 'up',
      migrationsTable: 'migrations',
      dir: resolve('migrations'),
    });

    console.log('✅ Migrations completed');

    await pool.end(); // Закрываем соединение с БД
    process.exit(0); // Принудительно завершаем процесс
  } catch (err) {
    console.error(err);
  }
};

runMigrations();
