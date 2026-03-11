import { asyncHandler } from '../middleware/asyncHandler.js';
import * as patientService from '../services/patientService.js';

export const getPatients = asyncHandler(async (req, res) => {
    const patients = await patientService.getPatients();
    res.status(200).json({ success: true, count: patients.length, data: patients });
});

export const getPatientById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const patient = await patientService.getPatientById(id);
    res.status(200).json({ success: true, data: patient });
});

export const addPatient = asyncHandler(async (req, res) => {
    const patient = await patientService.addPatient(req.body);
    res.status(201).json({
        success: true,
        message: 'Patient added successfully',
        data: patient
    });
});

export const getPatientAppointments = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const appointments = await patientService.getPatientAppointments(id);
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
});
