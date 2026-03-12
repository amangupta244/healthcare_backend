import FollowUp from '../models/FollowUp.js';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

export async function createFollowUp(doctorUserId, data) {
    const { appointmentId, date, notes } = data;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        const err = new Error('Appointment not found');
        err.statusCode = 404;
        throw err;
    }

    const doctor = await Doctor.findOne({ userId: doctorUserId });
    if (!doctor) {
        const err = new Error('Doctor profile not found');
        err.statusCode = 404;
        throw err;
    }

    if (appointment.doctorId.toString() !== doctor._id.toString()) {
        const err = new Error('Not authorized to create a follow-up for this appointment');
        err.statusCode = 403;
        throw err;
    }

    const followUp = await FollowUp.create({
        appointmentId,
        patientId: appointment.patientId,
        doctorId: doctor._id,
        date: new Date(date),
        notes: notes || ''
    });

    return followUp;
}

export async function getFollowUpsByPatient(patientId) {
    return FollowUp.find({ patientId })
        .populate('appointmentId', 'date status notes')
        .populate('doctorId', 'name specialization')
        .sort({ date: -1 });
}

export async function getFollowUpsByDoctor(doctorId) {
    return FollowUp.find({ doctorId })
        .populate('appointmentId', 'date status notes')
        .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
        .sort({ date: -1 });
}
