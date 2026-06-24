import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const sequelize = new Sequelize(
    process.env.DB_NAME || 'delala',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'kiflommamo',
    {
        host: process.env.DB_HOST,
        dialect : 'mysql',
        logging: false,
          port: process.env.DB_PORT
    }
);
export default sequelize;