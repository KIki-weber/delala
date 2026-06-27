import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const cleanEnv = (value, fallback = undefined) => {
    if (value === undefined || value === null) return fallback;
    const trimmed = String(value).trim();
    return trimmed === '' ? fallback : trimmed;
};

const sequelize = new Sequelize(
    cleanEnv(process.env.DB_NAME, 'delala'),
    cleanEnv(process.env.DB_USER, 'roots'),
    cleanEnv(process.env.DB_PASS, ''),
    {
        host: cleanEnv(process.env.DB_HOST, 'localhost'),
        dialect : 'mysql',
        logging: false,
        port: cleanEnv(process.env.DB_PORT, 3306)
    }
);
export default sequelize;
