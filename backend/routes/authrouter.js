import express from 'express';
import * as authController from '../controllers/authcontroller.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', protect, authController.getProfile);  // Fixed: using getProfile
router.post('/logout', protect, authController.logout);

export default router;