import { asyncHandler } from '../middleware/asyncHandler.js';
import * as followupService from '../services/followupService.js';
import Patient from '../models/Patient.js';

export const createFollowUp = asyncHandler(async (req, res) => {
    const followUp = await followupService.createFollowUp(req.user.id, req.body);
    res.status(201).json({
        success: true,
        message: 'Follow-up created successfully',
        data: followUp
    });
});

export const getFollowUpsByPatient = asyncHandler(async (req, res) => {
    // Patients can only view their own follow-ups; doctors and admins can view any
    if (req.user.role === 'user') {
        const patientRecord = await Patient.findOne({ userId: req.user.id });
        if (!patientRecord || patientRecord._id.toString() !== req.params.patientId) {
            const err = new Error('Not authorized to view follow-ups for this patient');
            err.statusCode = 403;
            throw err;
        }
    }
    const followUps = await followupService.getFollowUpsByPatient(req.params.patientId);
    res.status(200).json({
        success: true,
        count: followUps.length,
        data: followUps
    });
});

export const getFollowUpsByDoctor = asyncHandler(async (req, res) => {
    const followUps = await followupService.getFollowUpsByDoctor(req.params.doctorId);
    res.status(200).json({
        success: true,
        count: followUps.length,
        data: followUps
    });
});
