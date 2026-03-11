import express from 'express';
import protect from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import { validate, addPatientRules, idParamRules } from '../middleware/validators.js';
import {
    getPatients,
    getPatientById,
    addPatient,
    getPatientAppointments
} from '../controllers/patientController.js';

const router = express.Router();

// All patient routes are admin-only
router.get('/', protect, authorize('admin'), getPatients);
router.post('/', protect, authorize('admin'), validate(addPatientRules), addPatient);
router.get('/:id', protect, authorize('admin'), validate(idParamRules), getPatientById);
router.get(
    '/:id/appointments',
    protect,
    authorize('admin'),
    validate(idParamRules),
    getPatientAppointments
);

export default router;
