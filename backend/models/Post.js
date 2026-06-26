import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';


const Post = sequelize.define('Post', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Title:{
        type: DataTypes.STRING,
        allowNull: false,
validate:{
    notEmpty: true,
    len:[5,121]
}
    },
    Description:{
type: DataTypes.STRING,
allowNull: false,
validate:{
    len:[10, 1000],
    notEmpty:true
}

    },
    Price:{
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate:{
            min: 2
        }
    },/* if the property is for sell the payment type will be as one time and negotiable and 
if the serviceType is renting is is just for monthly   */
    Pricetype:{
        type: DataTypes.ENUM('monthly', 'one time', 'negotiable', 'yearly'),
        defaultValue: 'one time'
    },
Posttype:{
    type: DataTypes.ENUM('sell', 'rent'),
    allowNull: false
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
 ServicetypeId: {
     type: DataTypes.INTEGER,
     allowNull: false,
    references:{
             model: 'ServiceTypes',
             key: 'id'
         }  
 },
  // dynamic field which allow to 
  customAttribute:{
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'brand detail'
  },
  contactPhone:{
    type: DataTypes.STRING,
    allowNull: false
  },
  contactName:{
    type: DataTypes.STRING,
     allowNull: true
  },
  specificLocation:{
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'add location of rental or property'
  },
  Image:{
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
   featuredImage:{
    type: DataTypes.STRING,
    allowNull: true,
  },

  Status: {
    type: DataTypes.ENUM('sold', 'rented', 'active' ,'inactive'),
    defaultValue: 'active'
  },
  userId:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
        model: 'Users',  // ← Changed from 'users' to 'Users'
        key: 'id'
    }
},
  Views:{
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
    timestamps: true  // add updateAt and createAt automatically
}

);
export default Post;