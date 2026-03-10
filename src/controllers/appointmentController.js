import { asyncHandler } from '../middleware/asyncHandler.js';
import * as appointmentService from '../services/appointmentService.js';

// Book an appointment
export const bookAppointment = asyncHandler(async (req, res) => {
    const { doctorId, date, time } = req.body;
    const userId = req.user.id;

    // Combine date + time into an ISO date-time (UTC)
    const dateTime = new Date(`${date}T${time}:00Z`);

    const newAppointment = await appointmentService.bookAppointment(userId, doctorId, dateTime);

    res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        appointment: newAppointment
    });
});

// Get user's appointments
export const getMyAppointments = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const appointments = await appointmentService.getAppointmentsByUser(userId);

    res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
    });
});

// Update Appointment Status (Doctor/Admin)
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await appointmentService.updateAppointmentStatus(id, status);

    res.status(200).json({
        success: true,
        message: 'Appointment status updated',
        data: appointment
    });
});

// Get Doctor's Appointments
export const getDoctorAppointments = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    const appointments = await appointmentService.getAppointmentsByDoctor(doctorId);

    res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
    });
});
