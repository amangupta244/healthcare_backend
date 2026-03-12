import express from 'express';
import protect from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import { validate, prescriptionCreateRules, idParamRules, patientIdParamRules, doctorIdParamRules } from '../middleware/validators.js';
import {
    createPrescription,
    getMyPrescriptions,
    getPrescriptionsForPatient,
    getPrescriptionsForDoctor,
    getMyDoctorPrescriptions,
    getPrescriptionById,
    getByAppointment,
    downloadPrescription
} from '../controllers/prescriptionController.js';

const router = express.Router();

// Doctor creates a prescription
router.post(
    '/',
    protect,
    authorize('doctor'),
    validate(prescriptionCreateRules),
    createPrescription
);

// Patient views their own prescriptions
router.get('/my-prescriptions', protect, authorize('user'), getMyPrescriptions);

// Doctor views all prescriptions they created
router.get('/my-doctor-prescriptions', protect, authorize('doctor'), getMyDoctorPrescriptions);

// Get prescription by appointment ID
router.get(
    '/appointment/:appointmentId',
    protect,
    authorize('doctor', 'admin'),
    getByAppointment
);

// Patient/Doctor/Admin: view prescriptions for a specific patient
router.get(
    '/patient/:patientId',
    protect,
    authorize('user', 'doctor', 'admin'),
    validate(patientIdParamRules),
    getPrescriptionsForPatient
);

// Doctor/Admin: view prescription history for a specific doctor
router.get(
    '/doctor/:doctorId',
    protect,
    authorize('doctor', 'admin'),
    validate(doctorIdParamRules),
    getPrescriptionsForDoctor
);

// Get prescription by ID (doctor, patient who owns it, admin)
router.get('/:id/download', protect, validate(idParamRules), downloadPrescription);
router.get('/:id', protect, validate(idParamRules), getPrescriptionById);

export default router;
