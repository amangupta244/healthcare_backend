import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import bcrypt from 'bcryptjs';

export async function getPatients() {
    return User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
}

export async function getPatientById(id) {
    const patient = await User.findOne({ _id: id, role: 'user' }).select('-password');
    if (!patient) {
        const err = new Error('Patient not found');
        err.statusCode = 404;
        throw err;
    }
    return patient;
}

export async function addPatient(data) {
    const { name, email, password } = data;

    const existing = await User.findOne({ email });
    if (existing) {
        const err = new Error('User with this email already exists');
        err.statusCode = 400;
        throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const patient = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'user'
    });

    return {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        role: patient.role,
        createdAt: patient.createdAt
    };
}

export async function getPatientAppointments(patientId) {
    const patient = await User.findOne({ _id: patientId, role: 'user' });
    if (!patient) {
        const err = new Error('Patient not found');
        err.statusCode = 404;
        throw err;
    }
    return Appointment.find({ userId: patientId })
        .populate('doctorId', 'name specialization consultationFee')
        .sort({ date: -1 });
}
