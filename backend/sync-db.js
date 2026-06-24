// sync-db.js - Simple sync using your existing index.js
import { sequelize, syncModels } from './models/indexs.js';

const sync = async () => {
  try {
    console.log('🔄 Syncing database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync using your existing syncModels function from index.js
    await syncModels(true); // or false - whatever you need
    
    console.log('✅ Database sync completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
};

sync();
