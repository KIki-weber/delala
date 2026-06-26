import sequelize from '../config/database.js';
import City from './city.js';
import Subcity from './subcity.js';
import ServiceType from './ServiceType.js';
import User from './Users.js';
import Post from './Post.js';

// comment written by kiki tutor
// lets create relationship like basic
City.hasMany(Subcity, {foreignKey:'cityId', as:'Subcities'});
Subcity.belongsTo(City, {foreignKey: 'cityId', as: 'city'});


// service relationship

ServiceType.hasMany(User, {foreignKey: 'ServiceTypeId', as: 'users'});
User.belongsTo(ServiceType, {foreignKey:'ServiceTypeId', as: 'ServiceType'});
 

// lets create relationship in bn servicetype and post
ServiceType.hasMany(Post, {foreignKey:'ServiceTypeId', as: 'posts'});
Post.belongsTo(ServiceType, {foreignKey: 'ServiceTypeId', as: 'ServiceType'});


//lets create relationship in bn user and city
City.hasMany(User, {foreignKey:'cityId', as: 'users'});
User.belongsTo(City, {foreignKey: 'cityId', as: 'city'});

 // lets create relationship between city and post

 City.hasMany(Post, {foreignKey: 'cityId', as:'posts'});
 Post.belongsTo(City, {foreignKey: 'cityId', as: 'city'});

 // let create subcity and post in addition subcity with user
Subcity.hasMany(User, {foreignKey:'subcityId', as: 'users'});
User.belongsTo(Subcity, {foreignKey: 'subcityId', as: 'subcity'});

Subcity.hasMany(Post, {foreignKey: 'subcityId', as:'posts'});
 Post.belongsTo(Subcity, {foreignKey: 'subcityId', as: 'subcity'});

 // user and post 
 // a single user can create many posts so ..

 User.hasMany(Post, {foreignKey: 'userId', as: 'posts'});
 Post.belongsTo(User, {foreignKey: 'userId', as: 'owner'});


const syncModels = async (force = false) => {
  try {
    if (force) {
      await sequelize.sync({ force: true });
      console.log('Models synced with force');
    } else {
      try {
        await sequelize.sync({ alter: true });
        console.log('Models synced with alter');
      } catch (error) {
        if (String(error.message || '').includes('Duplicate foreign key constraint name')) {
          console.warn('Foreign key conflict detected. Dropping existing foreign keys and retrying sync.');

          const managedTables = ['Cities', 'Subcities', 'ServiceTypes', 'Users', 'Posts'];
          const [constraints] = await sequelize.query(
            `
              SELECT TABLE_NAME, CONSTRAINT_NAME
              FROM information_schema.TABLE_CONSTRAINTS
              WHERE CONSTRAINT_SCHEMA = DATABASE()
                AND TABLE_NAME IN (:tables)
                AND CONSTRAINT_TYPE = 'FOREIGN KEY'
            `,
            { replacements: { tables: managedTables } }
          );

          for (const constraint of constraints) {
            await sequelize.query(
              `ALTER TABLE \`${constraint.TABLE_NAME}\` DROP FOREIGN KEY \`${constraint.CONSTRAINT_NAME}\`;`
            );
          }

          await sequelize.sync({ alter: true });
          console.log('Models synced after foreign key repair');
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('Model sync failed:', error.message);
    if (error?.original?.sqlMessage) {
      console.error('Database error:', error.original.sqlMessage);
    } else if (error?.original?.message) {
      console.error('Database error:', error.original.message);
    }
    throw error;
  }
};

 export {
sequelize,
  City,
  Subcity,
  ServiceType,
  User,
  Post, 
  syncModels
 };
