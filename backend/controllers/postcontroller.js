import {Post, User, City, Subcity, Servicetype} from '../models/indexs.js';
import { Op } from 'sequelize';

export const createpost = async (req, res) =>{
    try{
        const postdata = {...req.body,
            userId: req.user.id,
            contactPhone: req.user.contactPhone || req.user.phone};
            

            const post = await Post.create(postdata);

            const postwithrelations = await Post.findByPk(post.id, {
                include: [
                     {model: User, as: 'owner', attributes: ['id', 'name', 'phone']},
                     {model: Servicetype, as:'Servicetype'},
                     {model: City, as: 'city'},
                     {model: Subcity, as: 'subcity'}
                ]
            }); res.status(201).json({success: true,
                data: postwithrelations
            });
            
        } catch(error){
             res.status(500).json({message: error.message});
        }
    } ;

    export const gallpost = async (req,res) => {
       
       try{
        const{
            search,
            minprice,
            maxprice,
            subcityId,
            cityId,
            ServicetypeId,
            postType
        } = req.query;
        // Show all statuses EXCEPT inactive (shows active, sold, rented)
        const where = { Status: { [Op.ne]: 'inactive' } };

        // apply filtering if they exist
        if (postType) where.Posttype = postType;
        if (ServicetypeId) where.ServicetypeId = ServicetypeId;
        if (cityId) where.cityId = cityId;
        if (subcityId) where.subcityId = subcityId;
    
        if (minprice || maxprice) {
            where.Price = {};
            if (minprice) where.Price[Op.gte] = parseFloat(minprice);
            if (maxprice) where.Price[Op.lte] = parseFloat(maxprice);
        }

        if (search) {
        where[Op.or] = [
            { Title: {[Op.like]: `%${search}%`}},
            { Description: {[Op.like]: `%${search}%`}},

        ];
    }
    //fetch post from database 
    const posts = await Post.findAndCountAll({
            where,
            include: [
                { model: User, as: 'owner', attributes: ['id', 'name', 'phone'] },
                { model: Servicetype, as: 'Servicetype' },
                { model: City, as: 'city' },
                { model: Subcity, as: 'subcity' }
            ],
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        res.json({ success: true, data: posts.rows, count: posts.count });
}
 catch(error){
    res.json({message: error.message});
}};

export const gpostbyid = async (req, res) => {
    try{
        const post = await Post.findByPk(req.params.id, {
            include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'phone'] },
        { model: Servicetype, as: 'Servicetype' },
        { model: City, as: 'city' },
        { model: Subcity, as: 'subcity' }
            ]
        });
        if(!post){
            return res.status(404).json({message: 'post not found'})
        }
        post.Views +=1;
        await post.save();
        res.json({success: true, data: post})
    } catch(error){
        res.status(500).json({message: error.message});
    }
};

// get all my post or the post creator 

export const gmypost = async(req, res) =>{
    try{
        const posts = await Post.findAll({
            where:{userId: req.user.id},
              include: [
        { model: Servicetype, as: 'Servicetype' },
        { model: City, as: 'city' },
        { model: Subcity, as: 'subcity' }
      ],
      order: [['createdAt', 'DESC']]
        });
        res
        .json({ success: true,
             count: posts.length, 
             data: posts });
    }
    catch (error) {
    res.status(500).json({ message: error.message });
}};


export const updatepost = async (req, res) =>{
    try{
        const post = await Post.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
            }
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found or unauthorized' });
        }
        await Post.update(req.body, {
            where: {
                id: req.params.id,
                userId: req.user.id,
            }
        });
        const updatedPost = await Post.findByPk(req.params.id, {
            include: [
                { model: User, as: 'owner', attributes: ['id', 'name', 'phone'] },
                { model: Servicetype, as: 'Servicetype' },
                { model: City, as: 'city' },
                { model: Subcity, as: 'subcity' }
            ]
        });
        res.json({ success: true, data: updatedPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }
    
    // Soft delete - just change status, don't remove from database
    post.Status = 'inactive';
    await post.save();
    
    res.json({ success: true, message: 'Post deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload images for a post
export const uploadPostImages = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Fixed: Changed req.user.role to req.user.Role (capital R)
        if (post.userId !== req.user.id && req.user.Role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images provided' });
        }

        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

        let currentImages = post.Image || [];
        currentImages = [...currentImages, ...imageUrls].slice(0, 4);

        const featured = post.featuredImage || (currentImages[0] || null);

        await post.update({ Image: currentImages, featuredImage: featured });

        res.json({ success: true, data: { images: currentImages, featuredImage: featured }, message: 'Images uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an image from post
export const deletePostImage = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { imageUrl } = req.body;
        let currentImages = post.Image || [];
        currentImages = currentImages.filter(img => img !== imageUrl);

        const featured = currentImages[0] || null;
        await post.update({ Image: currentImages, featuredImage: featured });

        res.json({ success: true, data: { images: currentImages, featuredImage: featured }, message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
