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

export const updateProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(
        req.user.id,
        updates,
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
});
