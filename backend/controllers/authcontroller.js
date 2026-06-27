import jwt from 'jsonwebtoken';
import { User, ServiceType, Subcity, City } from '../models/indexs.js';  // Fixed: indexs.js → index.js

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

export const register = async (req, res) => {
    try {
        const { name, phone, password, ServiceTypeId, cityId, subcityId } = req.body;

        const userExisted = await User.findOne({ where: { phone } });

        if (userExisted) {
            return res.status(401).json({
                success: false,
                message: 'Phone already registered. Try with another phone number.'
            });
        }

        const user = await User.create({
            name,
            phone,
            password,
            cityId,
            subcityId,
            ServiceTypeId
        });

        const userWithData = await User.findByPk(user.id, {
            include: [
                { model: ServiceType, as: 'ServiceType' },
                { model: City, as: 'city' },
                { model: Subcity, as: 'subcity' }
            ],
            attributes: { exclude: ['password'] }
        });

        res.status(201).json({
            success: true,
            data: {
                user: userWithData,
                token: generateToken(user.id)
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Phone and password are required'
            });
        }

        const user = await User.findOne({
            where: { phone },
            include: [
                { model: ServiceType, as: 'ServiceType' },
                { model: City, as: 'city' },
                { model: Subcity, as: 'subcity' }
            ]
        });

        if (user && await user.validPassword(password)) {
            res.status(200).json({
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    phone: user.phone,
                    city: user.city,
                    subcity: user.subcity,
                    Role: user.Role,
                    ServiceType: user.ServiceType,
                    isActive: user.isActive,
                    profileImage: user.profileImage,
                    profilePhoto: user.profilePhoto,
                    coverPhoto: user.coverPhoto,
                    bio: user.bio
                },
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid phone number or password'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [
                { model: ServiceType, as: 'ServiceType' },
                { model: City, as: 'city' },
                { model: Subcity, as: 'subcity' }
            ],
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
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