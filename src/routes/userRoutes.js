import express from 'express';
const router = express.Router();
import protect from '../middleware/authMiddleware.js';

router.get('/profile', protect, (req, res) => {
    res.status(200).json({ message: `Welcome user ${req.user}, this is your profile.` });
});

export default router;