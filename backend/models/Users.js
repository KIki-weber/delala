import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';
import { DataTypes } from 'sequelize';


const User = sequelize.define('User',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    name:{
        type: DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty: true,
         
        }
    },
    cityId:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: 'Cities',
            key: 'id'
        }
    },
      subcityId:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: 'Subcities',
            key: 'id'
        }},
ServiceTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
   references:{
            model: 'ServiceTypes',
            key: 'id'
        }  
},
        password:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
                len:[6,21]
            }
        },
        phone:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true,
                
            }
        },
        Role:{
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user'
        },
        profileImage:{
            type: DataTypes.STRING,
            allowNull: true
        },
        profilePhoto:{
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'User profile picture'
        },
        coverPhoto:{
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'User cover/banner photo'
        },
        bio:{
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'User bio/description'
        },
        isActive:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }

},
{
    timestamps: true,
    hooks:{
        beforeCreate: async(user) =>{
            if(user.password){
                const salt = await bcrypt.genSalt(10);
                user.password= await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async(user) => {
            if(user.password && user.changed('password')){
                const salt = await bcrypt.genSalt(10);
                user.password= await bcrypt.hash(user.password, salt);
            }
            }
        }
    }
);


User.prototype.validPassword = async function (password) {

    return await bcrypt.compare(password, this.password);
    
}



export default User;






