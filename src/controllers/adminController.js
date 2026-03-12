import { asyncHandler } from '../middleware/asyncHandler.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
    const [doctorCount, patientCount, appointmentCount, pendingCount] = await Promise.all([
        Doctor.countDocuments(),
        Patient.countDocuments(),
        Appointment.countDocuments(),
        Appointment.countDocuments({ status: 'pending' })
    ]);

    res.status(200).json({
        success: true,
        data: {
            doctors: doctorCount,
            patients: patientCount,
            appointments: appointmentCount,
            pendingAppointments: pendingCount
        }
    });
});
