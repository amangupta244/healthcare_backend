import express from 'express';
import {
    bookAppointment,
    getMyAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    addNotes,
    getDoctorAppointments,
    createFollowUp
} from '../controllers/appointmentController.js';
import protect from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import {
    validate,
    bookAppointmentRules,
    updateStatusRules,
    notesRules,
    followUpRules,
    idParamRules
} from '../middleware/validators.js';

const router = express.Router();

// Patient: book appointment
router.post('/book', protect, validate(bookAppointmentRules), bookAppointment);

// Patient: view own appointments (history + bills)
router.get('/my-appointments', protect, getMyAppointments);

// Doctor/Admin: view appointments for a specific doctor
router.get(
    '/doctor/:doctorId',
    protect,
    authorize('doctor', 'admin'),
    getDoctorAppointments
);

// Doctor/Admin: create a follow-up appointment
router.post(
    '/follow-up',
    protect,
    authorize('doctor', 'admin'),
    validate(followUpRules),
    createFollowUp
);

// Doctor/Admin: update appointment status
router.put(
    '/:id/status',
    protect,
    authorize('doctor', 'admin'),
    validate(updateStatusRules),
    updateAppointmentStatus
);

// Doctor: add notes to an appointment
router.put(
    '/:id/notes',
    protect,
    authorize('doctor'),
    validate(notesRules),
    addNotes
);

// Get single appointment details
router.get('/:id', protect, validate(idParamRules), getAppointmentById);

export default router;
