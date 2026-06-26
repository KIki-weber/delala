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

ServiceType.hasMany(User, {foreignKey: 'ServicetypeId', as: 'users'});
User.belongsTo(ServiceType, {foreignKey:'ServicetypeId', as: 'ServiceType'});
 

// lets create relationship in bn servicetype and post
ServiceType.hasMany(Post, {foreignKey:'ServicetypeId', as: 'posts'});
Post.belongsTo(ServiceType, {foreignKey: 'ServicetypeId', as: 'ServiceType'});


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


 const syncModels = async(force = true) => {
    try{

  
    await sequelize.sync({force, alter: true});
    console.log('models are synced ');
    if(force){
        console.log('all tables were create');

    }}  
    catch (error) {
        console.log('error is happened on model creation');
 }  } ;

 export {
sequelize,
  City,
  Subcity,
  ServiceType,
  User,
  Post, 
  syncModels
 };