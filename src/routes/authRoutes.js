import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validate, registerRules, loginRules } from '../middleware/validators.js';

const router = express.Router();
router.post('/register', validate(registerRules), register);
router.post('/login', validate(loginRules), login);

export default router;