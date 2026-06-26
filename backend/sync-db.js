// sync-db.js - database sync helper
import { sequelize, syncModels } from './models/indexs.js';

const sync = async () => {
  try {
    console.log('Syncing database...');

    await sequelize.authenticate();
    console.log('Database connected');

    const forceSync = process.argv.includes('--force') || process.env.DB_SYNC_FORCE === 'true';
    await syncModels(forceSync);

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
