import { Post, User, City, Subcity, ServiceType } from '../models/indexs.js';
import { Op } from 'sequelize';

export const createPost = async (req, res) => {
    try {
        const postData = {
            ...req.body,
            ServiceTypeId: req.body.ServiceTypeId,
            userId: req.user.id,
            contactPhone: req.body.contactPhone || req.user.phone
        };

        const post = await Post.create(postData);

        const postWithRelations = await Post.findByPk(post.id, {
            include: [
                { model: User, as: 'owner', attributes: ['id', 'name', 'phone'] },
                { model: ServiceType, as: 'ServiceType' },
                { model: City, as: 'city' },
                { model: Subcity, as: 'subcity' }
            ]
        });

        res.status(201).json({
            success: true,
            data: postWithRelations
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const {
            search,
            minPrice,
            maxPrice,
            subcityId,
            cityId,
            ServiceTypeId,
            postType
        } = req.query;

        // Show all statuses EXCEPT inactive (shows active, sold, rented)
        const where = { Status: { [Op.ne]: 'inactive' } };

        // Apply filtering if they exist
        if (postType) where.Posttype = postType;
        if (ServiceTypeId) where.ServiceTypeId = ServiceTypeId;
        if (cityId) where.cityId = cityId;
        if (subcityId) where.subcityId = subcityId;

        if (minPrice || maxPrice) {
            where.Price = {};
            if (minPrice) where.Price[Op.gte] = parseFloat(minPrice);
            if (maxPrice) where.Price[Op.lte] = parseFloat(maxPrice);
        }

        if (search) {
            where[Op.or] = [
                { Title: { [Op.like]: `%${search}%` } },
                { Description: { [Op.like]: `%${search}%` } }
            ];
        }

        // Fetch posts from database
        const posts = await Post.findAndCountAll({
            where,
            include: [
                { model: User, as: 'owner', attributes: ['id', 'name', 'phone'] },
                { model: ServiceType, as: 'ServiceType' },
                { model: City, as: 'city' },
                { model: Subcity, as: 'subcity' }
            ],
            order: [['createdAt', 'DESC']],
            limit: 20
        });

        res.json({
            success: true,
            data: posts.rows,
            count: posts.count
        });
    } catch (error) {
        console.error('Get all posts error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPostById = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [
                { model: User, as: 'owner', attributes: ['id', 'name', 'phone'] },
                { model: ServiceType, as: 'ServiceType' },
                { model: City, as: 'city' },
                { model: Subcity, as: 'subcity' }
            ]
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        post.Views += 1;
        await post.save();

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('Get post by ID error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all my posts
export const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { userId: req.user.id },
            include: [
                { model: ServiceType, as: 'ServiceType' },
                { model: City, as: 'city' },
                { model: Subcity, as: 'subcity' }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        console.error('Get my posts error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        const post = await Post.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found or unauthorized'
            });
        }

        // Prevent updating certain fields
        const { userId, Views, ...updateData } = req.body;

        await post.update(updateData);

        const updatedPost = await Post.findByPk(req.params.id, {
            include: [
                { model: User, as: 'owner', attributes: ['id', 'name', 'phone'] },
                { model: ServiceType, as: 'ServiceType' },
                { model: City, as: 'city' },
                { model: Subcity, as: 'subcity' }
            ]
        });

        res.json({
            success: true,
            data: updatedPost
        });
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found or unauthorized'
            });
        }

        // Soft delete - just change status, don't remove from database
        post.Status = 'inactive';
        await post.save();

        res.json({
            success: true,
            message: 'Post deactivated successfully'
        });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Upload images for a post
export const uploadPostImages = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check authorization
        if (post.userId !== req.user.id && req.user.Role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images provided'
            });
        }

        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

        let currentImages = post.Image || [];
        currentImages = [...currentImages, ...imageUrls].slice(0, 4);

        const featured = post.featuredImage || (currentImages[0] || null);

        await post.update({
            Image: currentImages,
            featuredImage: featured
        });

        res.json({
            success: true,
            data: {
                images: currentImages,
                featuredImage: featured
            },
            message: 'Images uploaded successfully'
        });
    } catch (error) {
        console.error('Upload images error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete an image from post
export const deletePostImage = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check authorization - Fixed: req.user.role to req.user.Role
        if (post.userId !== req.user.id && req.user.Role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const { imageUrl } = req.body;
        
        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        let currentImages = post.Image || [];
        currentImages = currentImages.filter(img => img !== imageUrl);

        const featured = currentImages[0] || null;
        await post.update({
            Image: currentImages,
            featuredImage: featured
        });

        res.json({
            success: true,
            data: {
                images: currentImages,
                featuredImage: featured
            },
            message: 'Image deleted successfully'
        });
    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
