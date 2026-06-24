import sequelize  from "./database.js";

const checker = async () =>{
  try{
        await sequelize.authenticate();
        console.log('database connected');
    }
    catch(error){
        console.log('error is happen');
    }}
    export default checker;

