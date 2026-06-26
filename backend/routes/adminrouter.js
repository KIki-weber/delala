import express from 'express';
import { User, ServiceType, City, Subcity, Post } from '../models/indexs.js';
import { protect, adminOnly } from '../middleware/authmiddleware.js';

const router = express.Router();

// Get all users (admin)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        { model: ServiceType, as: 'ServiceType' },
        { model: City, as: 'city' },
        { model: Subcity, as: 'subcity' }
      ]
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role
router.put('/users/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { Role } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.Role = Role;
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Soft-delete user (deactivate)
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = false;
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Activate user
router.put('/users/:id/activate', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = true;
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard stats
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const totalPosts = await Post.count();
    const activePosts = await Post.count({ where: { Status: 'active' } });

    res.json({ success: true, data: {
      users: { total: totalUsers, active: activeUsers },
      posts: { total: totalPosts, active: activePosts }
    }});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cities CRUD
router.get('/cities', protect, adminOnly, async (req, res) => {
  try {
    const cities = await City.findAll({ include:  [{ model: Subcity, as: 'Subcities' }] });
    res.json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/cities', protect, adminOnly, async (req, res) => {
  try {
    const { Name } = req.body;
    const city = await City.create({ Name });
    res.status(201).json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/cities/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { Name } = req.body;
    const city = await City.findByPk(id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    city.Name = Name;
    await city.save();
    res.json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/cities/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const city = await City.findByPk(id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    await city.destroy();
    res.json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Subcities CRUD
router.get('/subcities/:cityId', protect, adminOnly, async (req, res) => {
  try {
    const { cityId } = req.params;
    const subcities = await Subcity.findAll({ where: { cityId } });
    res.json({ success: true, data: subcities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/subcities', protect, adminOnly, async (req, res) => {
  try {
    const { Name, cityId, CityId } = req.body;
    const subcity = await Subcity.create({ Name, cityId: cityId ?? CityId });
    res.status(201).json({ success: true, data: subcity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/subcities/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { Name } = req.body;
    const subcity = await Subcity.findByPk(id);
    if (!subcity) return res.status(404).json({ message: 'Subcity not found' });
    subcity.Name = Name;
    await subcity.save();
    res.json({ success: true, data: subcity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/subcities/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const subcity = await Subcity.findByPk(id);
    if (!subcity) return res.status(404).json({ message: 'Subcity not found' });
    await subcity.destroy();
    res.json({ success: true, data: subcity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Service types CRUD
router.get('/service-types', protect, adminOnly, async (req, res) => {
  try {
    const serviceTypes = await ServiceType.findAll();
    res.json({ success: true, data: serviceTypes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/service-types', protect, adminOnly, async (req, res) => {
  try {
    const { Name, Category } = req.body;
    const serviceType = await ServiceType.create({ Name, Category });
    res.status(201).json({ success: true, data: serviceType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/service-types/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Category } = req.body;
    const serviceType = await ServiceType.findByPk(id);
    if (!serviceType) return res.status(404).json({ message: 'Service type not found' });
    serviceType.Name = Name;
    serviceType.Category = Category;
    await serviceType.save();
    res.json({ success: true, data: serviceType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/service-types/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const serviceType = await ServiceType.findByPk(id);
    if (!serviceType) return res.status(404).json({ message: 'Service type not found' });
    await serviceType.destroy();
    res.json({ success: true, data: serviceType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Posts Management CRUD
router.get('/posts', protect, adminOnly, async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'phone'] }
      ]
    });
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/posts/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await post.destroy();
    res.json({ success: true, message: 'Post deleted successfully', data: post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/posts/:id/activate', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.Status = 'active';
    await post.save();
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/posts/:id/deactivate', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.Status = 'inactive';
    await post.save();
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
 
