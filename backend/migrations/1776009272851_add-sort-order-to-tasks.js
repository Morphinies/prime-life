/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.addColumns('tasks', {
    sort_order: { type: 'integer', default: 0, notNull: true },
  });

  pgm.createIndex('tasks', 'sort_order', {
    name: 'idx_tasks_sort_order',
    ifNotExists: true,
  });

  pgm.sql(`
    WITH numbered AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 as row_num
      FROM tasks
    )
    UPDATE tasks 
    SET sort_order = numbered.row_num
    FROM numbered
    WHERE tasks.id = numbered.id
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropIndex('tasks', 'sort_order', {
    name: 'idx_tasks_sort_order',
    ifExists: true,
  });

  pgm.dropColumns('tasks', ['sort_order']);
};
