import express from 'express';
import { User, Post, City, Subcity, ServiceType } from '../models/indexs.js';
import { protect } from '../middleware/authmiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';
import { Op } from 'sequelize';

const router = express.Router();

const getUserWithRelations = async (userId) => User.findByPk(userId, {
    include: [
        { model: ServiceType, as: 'ServiceType' },
        { model: City, as: 'city' },
        { model: Subcity, as: 'subcity' }
    ],
    attributes: { exclude: ['password'] }
});

// Get single user profile with their posts
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [
                { model: City, as: 'city' },
                { model: Subcity, as: 'subcity' }
            ]
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's active posts
        const posts = await Post.findAll({
            where: {
                userId: userId,
                Status: { [Op.ne]: 'inactive' } // Show all except inactive
            },
            include: [
                { model: ServiceType, as: 'ServiceType' },
                { model: City, as: 'city' },
                { model: Subcity, as: 'subcity' }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({ 
            success: true, 
            data: {
                user,
                posts,
                postsCount: posts.length
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile (name, phone, bio, profile photo, cover photo)
router.put('/:userId/profile', protect, uploadSingle, async (req, res) => {
    try {
        const { userId } = req.params;
        const { bio, name, phone } = req.body;
        
        // Check if user owns the profile
        if (parseInt(userId) !== req.user.id && req.user.Role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (phone && phone !== user.phone) {
            const existingPhone = await User.findOne({
                where: {
                    phone,
                    id: { [Op.ne]: user.id }
                }
            });

            if (existingPhone) {
                return res.status(409).json({
                    success: false,
                    message: 'Phone number is already in use'
                });
            }
        }

        if (name !== undefined) {
            user.name = name;
        }

        if (phone !== undefined) {
            user.phone = phone;
        }

        // Update bio if provided
        if (bio !== undefined) {
            user.bio = bio;
        }

        // Update profile or cover photo based on field
        if (req.file) {
            const imageType = req.body.imageType || 'profilePhoto'; // 'profilePhoto' or 'coverPhoto'
            const imagePath = `/uploads/${req.file.filename}`;
            
            if (imageType === 'profilePhoto') {
                user.profilePhoto = imagePath;
            } else if (imageType === 'coverPhoto') {
                user.coverPhoto = imagePath;
            }
        }

        await user.save();

        const updatedUser = await getUserWithRelations(user.id);

        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            data: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:userId/password', protect, async (req, res) => {
    try {
        const { userId } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (parseInt(userId) !== req.user.id && req.user.Role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.validPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's posts stats
router.get('/:userId/stats', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const totalPosts = await Post.count({ where: { userId } });
        const activePosts = await Post.count({ 
            where: { 
                userId,
                Status: 'active'
            } 
        });
        const soldPosts = await Post.count({ 
            where: { 
                userId,
                Status: 'sold'
            } 
        });
        const rentedPosts = await Post.count({ 
            where: { 
                userId,
                Status: 'rented'
            } 
        });

        res.json({ 
            success: true, 
            data: {
                totalPosts,
                activePosts,
                soldPosts,
                rentedPosts
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
