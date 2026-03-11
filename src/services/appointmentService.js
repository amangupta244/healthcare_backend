import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

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

    const newAppointment = await Appointment.create({
        userId,
        doctorId,
        date,
        status: 'pending',
        paymentStatus: 'pending'
    });

    return newAppointment;
}

export async function getAppointmentsByUser(userId) {
    return Appointment.find({ userId })
        .populate('doctorId', 'name specialization consultationFee');
}

export async function getAppointmentById(id) {
    const appointment = await Appointment.findById(id)
        .populate('doctorId', 'name specialization consultationFee')
        .populate('userId', 'name email');
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
        .populate('userId', 'name email')
        .sort({ date: -1 });
}

export async function createFollowUp(parentAppointmentId, doctorId, date) {
    const parent = await Appointment.findById(parentAppointmentId);
    if (!parent) {
        const err = new Error('Parent appointment not found');
        err.statusCode = 404;
        throw err;
    }

    const resolvedDoctorId = doctorId || parent.doctorId;
    const doctor = await Doctor.findById(resolvedDoctorId);
    if (!doctor) {
        const err = new Error('Doctor not found');
        err.statusCode = 404;
        throw err;
    }

    const existingAppointment = await Appointment.findOne({ doctorId: resolvedDoctorId, date });
    if (existingAppointment) {
        const err = new Error('Doctor is not available at this time');
        err.statusCode = 400;
        throw err;
    }

    const followUp = await Appointment.create({
        userId: parent.userId,
        doctorId: resolvedDoctorId,
        date,
        status: 'pending',
        paymentStatus: 'pending',
        isFollowUp: true,
        parentAppointmentId
    });

    return followUp;
}
