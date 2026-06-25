import jwt from 'jsonwebtoken';
import { User, Servicetype, Subcity, City} from '../models/indexs.js';

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};


export const register = async (req, res) => {
    try {
        const {name, phone, password, ServicetypeId, cityId, subcityId}= req.body;
         

        const userExisted = await User.findOne({where: {phone}});

        if(userExisted){
            return res
            .status(401)
            .json({message:'phone already registered try with other phon'});
        }
const user = await User.create({
    name,
    phone, 
    password,
    cityId,
    subcityId,
    ServicetypeId
});

// new fetch the registered with its reation dta 
const userWithData = await User.findByPk(user.id, 
    {include: [
        {model: Servicetype, as:'Servicetype'},
        {model: City, as: 'city'},
        {model: Subcity, as: 'subcity'}
    ],   attributes: { exclude: ['password'] } },


);
res.status(202).json({
    success: true,
    data: {
        user: userWithData,
        token: generateToken(user.id)
    }
});
    } catch(error)  {
        res.status(500).json({message: error.message});
    }
};

export const login = async (req, res) => {
    try{
    const{phone, password} = req.body;
    

    const user = await User.findOne({
        where:{ phone },
        include: [
            { model: Servicetype, as: 'Servicetype' },
            { model: City, as: 'city' },
            { model: Subcity, as: 'subcity' }
        ]
    });

    if (user && await user.validPassword(password)) {
        res.status(201).json({
            sucess: true,
            data: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                city: user.city,
                subcity: user.subcity,
                role: user.Role,
                Role: user.Role,
                Servicetype: user.Servicetype,
                isActive: user.isActive
                
            } , token: generateToken(user.id)
        
        });
    
} else {
    res.status(401).json({message:'invalid email or password'});
}


    }
catch(error){
    res.json({message: error.message})
}
};

export const  getprofile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id,
             {include: [
        {model: Servicetype, as:'Servicetype'},
        {model: City, as: 'city'},
        {model: Subcity, as: 'subcity'}
    ],   attributes: { exclude: ['password'] } },


        ); res.status(202).json({sucess:true, 
            data:user})
    } catch(error){
        res.json({message:error.message});
    }
};

export const logout = async (req, res) => {
    try {
        
        res.status(200).json({ 
            success: true, 
            message: 'Logged out successfully' 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
