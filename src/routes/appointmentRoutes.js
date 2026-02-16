import express from 'express';
import { bookAppointment, getMyAppointments, updateAppointmentStatus, getDoctorAppointments } from '../controllers/appointmentController.js';
import protect from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/book', protect, bookAppointment);
router.get('/my-appointments', protect, getMyAppointments);

router.put(
    '/:id/status',
    protect,
    authorize('doctor', 'admin'),
    updateAppointmentStatus
);

// Doctor viewing their appointments (passing doctorId for simplicity given current schema)
router.get(
    '/doctor/:doctorId',
    protect,
    authorize('doctor', 'admin'),
    getDoctorAppointments
);

export default router;
