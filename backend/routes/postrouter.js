import express from 'express';
import { getMyPosts,
     getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    uploadPostImages,
    deletePostImage } from '../controllers/postcontroller.js';

import { protect } from '../middleware/authmiddleware.js';
import { uploadImages } from '../middleware/uploadMiddleware.js';
import { Post } from '../models/indexs.js';

// Error handler for multer/file upload errors
const handleUploadError = (err, req, res, next) => {
    if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum 5MB allowed.' });
        }
        if (err.message.includes('Only images are allowed')) {
            return res.status(400).json({ message: 'Only images are allowed (jpeg, jpg, png, gif, webp)' });
        }
        return res.status(400).json({ message: err.message || 'File upload error' });
    }
    next();
};

// no needed authentication and identity checking 

    const  router = express.Router();

    router.get('/allpost', getAllPosts);
    router.get('/:id', getPostById);
    // we access these end points when we logged in or registed
    router.post('/', protect, createPost);
    // image upload routes with error handling
    router.post('/:id/upload-images', protect, uploadImages, handleUploadError, uploadPostImages);
    router.delete('/:id/delete-image', protect, deletePostImage);
    router.get('/my/posts', protect, getMyPosts);
    router.put('/:id', protect, updatePost);
    // Post status update (flexible endpoint supporting any status)
    router.put('/:id/status', protect, async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            if (!status) {
                return res.status(400).json({ message: 'Status is required' });
            }
            
            const validStatuses = ['active', 'inactive', 'sold', 'rented'];
            if (!validStatuses.includes(status.toLowerCase())) {
                return res.status(400).json({ message: 'Invalid status' });
            }
            
            const post = await Post.findByPk(id);
            if (!post) return res.status(404).json({ message: 'Post not found' });
            if (post.userId !== req.user.id && req.user.Role !== 'admin') {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            post.Status = status;
            await post.save();
            res.json({ success: true, data: post });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // Post activation/deactivation (kept for backward compatibility)
    router.put('/:id/activate', protect, async (req, res) => {
        try {
            const { id } = req.params;
            const post = await Post.findByPk(id);
            if (!post) return res.status(404).json({ message: 'Post not found' });
            if (post.userId !== req.user.id && req.user.Role !== 'admin') {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            post.Status = 'active';
            await post.save();
            res.json({ success: true, data: post });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    router.put('/:id/deactivate', protect, async (req, res) => {
        try {
            const { id } = req.params;
            const post = await Post.findByPk(id);
            if (!post) return res.status(404).json({ message: 'Post not found' });
            if (post.userId !== req.user.id && req.user.Role !== 'admin') {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            post.Status = 'inactive';
            await post.save();
            res.json({ success: true, data: post });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    router.delete('/:id', protect, deletePost);

    export default router;
