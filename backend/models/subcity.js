import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';

const Subcity = sequelize.define('Subcity', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Name:{
        type:DataTypes.STRING,
        allowNull:false, 
        unique: true
    },
    isActive:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
}
);
export default Subcity;