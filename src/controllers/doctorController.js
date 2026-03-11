import { asyncHandler } from '../middleware/asyncHandler.js';
import * as doctorService from '../services/doctorService.js';

export const createDoctor = asyncHandler(async (req, res) => {
  const result = await doctorService.createDoctor(req.body);
  res.status(201).json({
    success: true,
    message: 'Doctor created successfully',
    doctor: result.doctor,
    user: result.user
  });
});

export const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await doctorService.getDoctors();
  res.status(200).json({ success: true, data: doctors });
});

export const updateDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doctor = await doctorService.updateDoctor(id, req.body);
  res.status(200).json({
    success: true,
    message: 'Doctor updated successfully',
    data: doctor
  });
});

export const deleteDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await doctorService.deleteDoctor(id);
  res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
});

export const getDoctorById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doctor = await doctorService.getDoctorById(id);
  res.status(200).json({ success: true, data: doctor });
});

// Doctor views their own profile using the userId from JWT
export const getDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await doctorService.getDoctorByUserId(req.user.id);
  res.status(200).json({ success: true, data: doctor });
});

// Get list of patients (distinct users) who have booked with this doctor
export const getDoctorPatients = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const patients = await doctorService.getDoctorPatients(id);
  res.status(200).json({ success: true, count: patients.length, data: patients });
});
