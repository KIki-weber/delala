import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ServiceType = sequelize.define('serviceType', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Category:{
        type: DataTypes.ENUM('rent', 'sell', 'both'),
        defaultValue: 'both'
    },
    isActive:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});
export default ServiceType;