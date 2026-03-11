import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import bcrypt from 'bcryptjs';

export async function createDoctor(data) {
    const { name, email, password, specialization, experience, consultationFee, availability } = data;
    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
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
        role: 'doctor'
    });

    const doctor = await Doctor.create({
        userId: newUser._id,
        name,
        specialization,
        experience,
        consultationFee,
        availability
    });

    return { doctor, user: { id: newUser._id, email: newUser.email, role: newUser.role } };
}

export async function getDoctors() {
    // include basic user info linked to doctor
    return Doctor.find({}).populate('userId', 'name email');
}

export async function updateDoctor(id, update) {
    const doctor = await Doctor.findByIdAndUpdate(id, update, { new: true });
    if (!doctor) {
        const err = new Error('Doctor not found');
        err.statusCode = 404;
        throw err;
    }
    return doctor;
}

export async function deleteDoctor(id) {
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
        const err = new Error('Doctor not found');
        err.statusCode = 404;
        throw err;
    }
    return doctor;
}

export async function getDoctorById(id) {
    const doctor = await Doctor.findById(id).populate('userId', 'name email');
    if (!doctor) {
        const err = new Error('Doctor not found');
        err.statusCode = 404;
        throw err;
    }
    return doctor;
}
export async function getDoctorByUserId(userId) {
    const doctor = await Doctor.findOne({ userId }).populate('userId', 'name email');
    if (!doctor) {
        const err = new Error('Doctor profile not found');
        err.statusCode = 404;
        throw err;
    }
    return doctor;
}

export async function getDoctorPatients(doctorId) {
    const patientIds = await Appointment.find({ doctorId }).distinct('userId');
    const patients = await User.find({ _id: { $in: patientIds } }).select('-password');
    return patients;
}
