import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// Always register as a regular user; doctors must be created by an admin.
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'user',
    });

    const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiry }
    );

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiry }
    );

    res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
    });
});