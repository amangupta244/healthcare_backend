import express from 'express';
import {
    createFollowUp,
    getFollowUpsByPatient,
    getFollowUpsByDoctor
} from '../controllers/followupController.js';
import protect from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import {
    validate,
    followUpRules,
    patientIdParamRules,
    doctorIdParamRules
} from '../middleware/validators.js';

const router = express.Router();

// Doctor creates a follow-up recommendation linked to an appointment
router.post('/', protect, authorize('doctor', 'admin'), validate(followUpRules), createFollowUp);

// Patient (or doctor/admin) views follow-up suggestions for a patient
router.get('/patient/:patientId', protect, validate(patientIdParamRules), getFollowUpsByPatient);

// Doctor (or admin) views follow-ups they have created
router.get('/doctor/:doctorId', protect, authorize('doctor', 'admin'), validate(doctorIdParamRules), getFollowUpsByDoctor);

export default router;
