import express from 'express';
import { register, login, getProfile, logout } from '../controllers/authcontroller.js';
import { protect } from '../middleware/authmiddleware.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/logout', protect, logout);
export default router;
