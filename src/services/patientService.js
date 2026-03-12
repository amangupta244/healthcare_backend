import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import bcrypt from 'bcryptjs';

export async function getPatients() {
    return Patient.find().populate('userId', '-password').sort({ createdAt: -1 });
}

export async function getPatientById(id) {
    const patient = await Patient.findById(id).populate('userId', '-password');
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

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'user'
    });

    let patient;
    try {
        patient = await Patient.create({ userId: newUser._id });
    } catch (err) {
        await User.findByIdAndDelete(newUser._id);
        const createErr = new Error('Failed to create patient profile');
        createErr.statusCode = 500;
        throw createErr;
    }

    return {
        id: patient._id,
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: patient.createdAt
    };
}

export async function getPatientAppointments(patientId) {
    const patient = await Patient.findById(patientId);
    if (!patient) {
        const err = new Error('Patient not found');
        err.statusCode = 404;
        throw err;
    }
    return Appointment.find({ patientId })
        .populate('doctorId', 'name specialization consultationFee')
        .sort({ date: -1 });
}
