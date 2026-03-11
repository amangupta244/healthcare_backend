import express from 'express';
const router = express.Router();
import protect from '../middleware/authMiddleware.js';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { validate, updateProfileRules } from '../middleware/validators.js';

router.get('/profile', protect, getProfile);
router.put('/profile', protect, validate(updateProfileRules), updateProfile);

export default router;
