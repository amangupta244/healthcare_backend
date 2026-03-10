import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
    // req.user is populated by auth middleware with { id, role }
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
});