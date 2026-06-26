// sync-db.js - database sync helper
import { sequelize, syncModels } from './models/indexs.js';

const isForeignKeyConflict = (error) =>
  String(error?.message || '').includes('Duplicate foreign key constraint name') ||
  String(error?.original?.sqlMessage || '').includes('Duplicate foreign key constraint name');

const resetSchema = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  const tableNames = tables.map((table) => {
    if (typeof table === 'string') return table;
    if (table?.tableName) return table.tableName;
    if (table?.name) return table.name;
    return String(table);
  });

  console.warn('Resetting schema by dropping all existing tables.');
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  try {
    for (const tableName of tableNames) {
      if (tableName) {
        await queryInterface.dropTable(tableName);
      }
    }
  } finally {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
};

const sync = async () => {
  try {
    console.log('Syncing database...');

    await sequelize.authenticate();
    console.log('Database connected');

    const forceSync = process.argv.includes('--force') || process.env.DB_SYNC_FORCE === 'true';
    const resetOnConflict = process.argv.includes('--reset-on-conflict') || process.env.DB_RESET_ON_CONFLICT !== 'false';

    try {
      await syncModels(forceSync);
    } catch (error) {
      if (!forceSync && resetOnConflict && isForeignKeyConflict(error)) {
        console.warn('Foreign key conflict detected. Rebuilding schema from scratch.');
        await resetSchema();
        await syncModels(true);
      } else {
        throw error;
      }
    }

    console.log('Database sync completed');
    process.exit(0);
  } catch (error) {
    console.error('Sync failed:', error.message);

    if (error?.original?.sqlMessage) {
      console.error('Database error:', error.original.sqlMessage);
    } else if (error?.original?.message) {
      console.error('Database error:', error.original.message);
    }

    process.exit(1);
  }
};

sync();
