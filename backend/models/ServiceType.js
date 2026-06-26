import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ServiceType = sequelize.define('ServiceType', {  // ← Changed from 'serviceType' to 'ServiceType'
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Category: {
        type: DataTypes.ENUM('rent', 'sell', 'both'),
        defaultValue: 'both'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'ServiceTypes',  // ← ADD THIS - Explicit table name
    timestamps: true
});

export default ServiceType;