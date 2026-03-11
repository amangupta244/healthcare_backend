import express from 'express';
import protect from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import { getDashboardStats } from '../controllers/adminController.js';
import {
    adminBookAppointment,
    createFollowUp
} from '../controllers/appointmentController.js';
import { validate, adminBookAppointmentRules, followUpRules } from '../middleware/validators.js';

const router = express.Router();

// Admin dashboard stats
router.get('/dashboard', protect, authorize('admin'), getDashboardStats);

// Admin books appointment on behalf of a patient
router.post(
    '/appointments/book',
    protect,
    authorize('admin'),
    validate(adminBookAppointmentRules),
    adminBookAppointment
);

// Admin or doctor creates a follow-up appointment
router.post(
    '/appointments/follow-up',
    protect,
    authorize('admin', 'doctor'),
    validate(followUpRules),
    createFollowUp
);

export default router;
