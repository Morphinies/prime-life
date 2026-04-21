"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = initDatabase;
const postgres_config_1 = __importDefault(require("./postgres.config"));
async function initDatabase() {
    const client = await postgres_config_1.default.connect();
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        section VARCHAR(100),
        project VARCHAR(100),
        priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')),
        deadline TIMESTAMP,
        sort_order DECIMAL(10, 4) DEFAULT 0,
        is_completed BOOLEAN DEFAULT FALSE,
        is_archived BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
        await client.query(`
      DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
      CREATE TRIGGER update_tasks_updated_at
        BEFORE UPDATE ON tasks
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
        console.log('✅ Database initialized successfully');
    }
    catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
