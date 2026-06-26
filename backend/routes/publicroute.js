// routes/publicRoutes.js
// PURPOSE: Provides public data that doesn't require authentication

import express from 'express';
import { City, Subcity, ServiceType } from '../models/indexs.js';

const router = express.Router();

// PURPOSE: Get all cities with their subcities
// USE: For registration form, search filters
router.get('/cities', async (req, res) => {
  try {
    const cities = await City.findAll({
      where: { isActive: true },
      include: [{ 
        model: Subcity, 
        as: 'Subcities', 
        where: { isActive: true }, 
        required: false 
      }]
    });
    res.json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PURPOSE: Get all service types
// USE: For registration form, post creation, filters
router.get('/service-types', async (req, res) => {
  try {
    const serviceTypes = await ServiceType.findAll({ 
      where: { isActive: true } 
    });
    res.json({ success: true, data: serviceTypes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PURPOSE: Get all subcities for a city
// USE: For registration form subcity dropdown and optional filter support
router.get('/subcities/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const subcities = await Subcity.findAll({
      where: {
        cityId,
        isActive: true
      }
    });
    res.json({ success: true, data: subcities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;