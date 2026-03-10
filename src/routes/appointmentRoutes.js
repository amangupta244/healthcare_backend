import express from 'express';
import { bookAppointment, getMyAppointments, updateAppointmentStatus, getDoctorAppointments } from '../controllers/appointmentController.js';
import protect from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import { validate, bookAppointmentRules, updateStatusRules } from '../middleware/validators.js';

const router = express.Router();

router.post('/book', protect, validate(bookAppointmentRules), bookAppointment);
router.get('/my-appointments', protect, getMyAppointments);

router.put(
    '/:id/status',
    protect,
    authorize('doctor', 'admin'),
    validate(updateStatusRules),
    updateAppointmentStatus
);

router.get(
    '/doctor/:doctorId',
    protect,
    authorize('doctor', 'admin'),
    getDoctorAppointments
);

export default router;
