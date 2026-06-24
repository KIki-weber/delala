// this helps to identify user as 
import jwt from 'jsonwebtoken';
import { User } from '../models/indexs.js';

export const protect = async(req, res, next) =>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try { //split the bearer prefix
            token = req.headers.authorization.split(' ')[1];
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            //THEN FIND THE USER BY ID

            req.user = await User.findByPk(decode.id, {
                attributes:{exclude: ['password']}
            });
            next();
        }catch(error){
        res.status(401).json({message:'unauthorized access'})
    } 
    } if(!token){
        res.status(401).json({message:'token not found'})
    }
};
export const adminOnly = (req, res, next) => {
    const role = (req.user?.Role || req.user?.role || '').toString().toLowerCase();
    if (role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'admin access req' });
    }
}