import express from 'express';
import {
    bookAppointment,
    getMyAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    addNotes,
    getDoctorAppointments,
    getDoctorAppointmentHistory,
    getPatientAppointments,
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
    idParamRules,
    doctorIdParamRules,
    patientIdParamRules
} from '../middleware/validators.js';

const router = express.Router();

// Patient: book appointment
router.post('/', protect, validate(bookAppointmentRules), bookAppointment);
router.post('/book', protect, validate(bookAppointmentRules), bookAppointment);

// Patient: view own appointments (history + bills)
router.get('/my-appointments', protect, getMyAppointments);

// Patient: view appointments by patientId
router.get(
    '/patient/:patientId',
    protect,
    authorize('doctor', 'admin'),
    validate(patientIdParamRules),
    getPatientAppointments
);

// Doctor/Admin: view appointments for a specific doctor
router.get(
    '/doctor/:doctorId',
    protect,
    authorize('doctor', 'admin'),
    validate(doctorIdParamRules),
    getDoctorAppointments
);

// Doctor/Admin: view completed appointment history for a specific doctor
router.get(
    '/history/:doctorId',
    protect,
    authorize('doctor', 'admin'),
    validate(doctorIdParamRules),
    getDoctorAppointmentHistory
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
