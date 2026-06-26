import jwt from 'jsonwebtoken';
import { User, ServiceType, Subcity, City } from '../models/indexs.js';

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
            return res
                .status(401)
                .json({ 
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

        // Fetch the registered user with relations
        const userWithData = await User.findByPk(user.id, {
            include: [
                { model: ServiceType, as: 'ServiceType' },
                { model: City, as: 'city' },
                { model: Subcity, as: 'subcity' }
            ],
            attributes: { exclude: ['password'] }
        });

        res.status(201).json({  // ← Changed from 202 to 201 (Created)
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
            res.status(200).json({  // ← Changed from 201 to 200 (OK)
                success: true,  // ← Fixed: was 'sucess'
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

        res.status(200).json({  // ← Changed from 202 to 200
            success: true,  // ← Fixed: was 'sucess'
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
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Additional useful functions
export const updateProfile = async (req, res) => {
    try {
        const { name, phone, bio, profileImage, profilePhoto, coverPhoto } = req.body;

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.update({
            name: name || user.name,
            phone: phone || user.phone,
            bio: bio !== undefined ? bio : user.bio,
            profileImage: profileImage !== undefined ? profileImage : user.profileImage,
            profilePhoto: profilePhoto !== undefined ? profilePhoto : user.profilePhoto,
            coverPhoto: coverPhoto !== undefined ? coverPhoto : user.coverPhoto
        });

        const updatedUser = await User.findByPk(user.id, {
            include: [
                { model: ServiceType, as: 'ServiceType' },
                { model: City, as: 'city' },
                { model: Subcity, as: 'subcity' }
            ],
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!await user.validPassword(currentPassword)) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
