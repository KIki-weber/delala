import sequelize from "./database.js";

const checker = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        return false;
    }
};

export default checker;