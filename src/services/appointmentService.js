import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import FollowUp from '../models/FollowUp.js';

export async function bookAppointment(userId, doctorId, date) {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        const err = new Error('Doctor not found');
        err.statusCode = 404;
        throw err;
    }

    const appointmentDate = new Date(date);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[appointmentDate.getUTCDay()];
    const hours = appointmentDate.getUTCHours().toString().padStart(2, '0');
    const minutes = appointmentDate.getUTCMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    const dayAvailability = doctor.availability.find(d => d.day === dayName);

    if (!dayAvailability) {
        const err = new Error(`Doctor not available on ${dayName}`);
        err.statusCode = 400;
        throw err;
    }

    if (timeString < dayAvailability.from || timeString > dayAvailability.to) {
        const err = new Error(`Doctor is only available from ${dayAvailability.from} to ${dayAvailability.to} on ${dayName}`);
        err.statusCode = 400;
        throw err;
    }

    const existingAppointment = await Appointment.findOne({ doctorId, date });
    if (existingAppointment) {
        const err = new Error('Doctor is not available at this time');
        err.statusCode = 400;
        throw err;
    }

    let patient = await Patient.findOneAndUpdate(
        { userId },
        { userId },
        { upsert: true, new: true }
    );

    const newAppointment = await Appointment.create({
        patientId: patient._id,
        doctorId,
        date,
        status: 'pending',
        paymentStatus: 'pending'
    });

    return newAppointment;
}

export async function getAppointmentsByUser(userId) {
    const patient = await Patient.findOne({ userId });
    if (!patient) return [];
    return Appointment.find({ patientId: patient._id })
        .populate('doctorId', 'name specialization consultationFee');
}

export async function getAppointmentById(id) {
    const appointment = await Appointment.findById(id)
        .populate('doctorId', 'name specialization consultationFee')
        .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } });
    if (!appointment) {
        const err = new Error('Appointment not found');
        err.statusCode = 404;
        throw err;
    }
    return appointment;
}

export async function updateAppointmentStatus(id, status) {
    const appointment = await Appointment.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    if (!appointment) {
        const err = new Error('Appointment not found');
        err.statusCode = 404;
        throw err;
    }

    return appointment;
}

export async function addNotes(id, notes) {
    const appointment = await Appointment.findByIdAndUpdate(
        id,
        { notes },
        { new: true }
    );
    if (!appointment) {
        const err = new Error('Appointment not found');
        err.statusCode = 404;
        throw err;
    }
    return appointment;
}

export async function getAppointmentsByDoctor(doctorId) {
    return Appointment.find({ doctorId })
        .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
        .sort({ date: -1 });
}

export async function getCompletedAppointmentsByDoctor(doctorId) {
    return Appointment.find({ doctorId, status: 'completed' })
        .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
        .sort({ date: -1 });
}

export async function getAppointmentsByPatientId(patientId) {
    return Appointment.find({ patientId })
        .populate('doctorId', 'name specialization consultationFee')
        .sort({ date: -1 });
}

export async function createFollowUp(appointmentId, date, notes) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        const err = new Error('Appointment not found');
        err.statusCode = 404;
        throw err;
    }

    const followUp = await FollowUp.create({
        appointmentId,
        date: new Date(date),
        notes: notes || ''
    });

    return followUp;
}
