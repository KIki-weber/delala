import express from 'express';
import { User, Post, City, Subcity, Servicetype } from '../models/indexs.js';
import { protect } from '../middleware/authmiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';
import { Op } from 'sequelize';

const router = express.Router();

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
                { model: Servicetype, as: 'Servicetype' },
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

// Update user profile (profile photo, cover photo, bio)
router.put('/:userId/profile', protect, uploadSingle, async (req, res) => {
    try {
        const { userId } = req.params;
        const { bio } = req.body;
        
        // Check if user owns the profile
        if (parseInt(userId) !== req.user.id && req.user.Role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update bio if provided
        if (bio) {
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

        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            data: user 
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
