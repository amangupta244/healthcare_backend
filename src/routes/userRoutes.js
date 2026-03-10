import express from 'express';
const router = express.Router();
import protect from '../middleware/authMiddleware.js';
import { getProfile } from '../controllers/userController.js';

router.get('/profile', protect, getProfile);

export default router;