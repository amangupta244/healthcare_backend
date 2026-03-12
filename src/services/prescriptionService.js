import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';

export async function createPrescription(doctorUserId, data) {
    const { appointmentId, patientId, diagnosis, notes, medicines, followUpDate } = data;

    // Verify the appointment exists and belongs to this doctor
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        const err = new Error('Appointment not found');
        err.statusCode = 404;
        throw err;
    }

    // Find the doctor document by the doctor's userId
    const doctor = await Doctor.findOne({ userId: doctorUserId });
    if (!doctor) {
        const err = new Error('Doctor profile not found');
        err.statusCode = 404;
        throw err;
    }

    if (appointment.doctorId.toString() !== doctor._id.toString()) {
        const err = new Error('Not authorized to create prescription for this appointment');
        err.statusCode = 403;
        throw err;
    }

    const prescription = await Prescription.create({
        appointmentId,
        doctorId: doctor._id,
        patientId,
        diagnosis,
        notes: notes || '',
        medicines: medicines || [],
        followUpDate: followUpDate || null
    });

    return prescription;
}

export async function getPrescriptionsByPatient(patientId) {
    return Prescription.find({ patientId })
        .populate('doctorId', 'name specialization')
        .populate('appointmentId', 'date status')
        .sort({ createdAt: -1 });
}

export async function getPrescriptionsByPatientUserId(userId) {
    const patient = await Patient.findOne({ userId });
    if (!patient) return [];
    return getPrescriptionsByPatient(patient._id);
}

export async function getPrescriptionsByDoctor(doctorUserId) {
    const doctor = await Doctor.findOne({ userId: doctorUserId });
    if (!doctor) {
        const err = new Error('Doctor profile not found');
        err.statusCode = 404;
        throw err;
    }
    return Prescription.find({ doctorId: doctor._id })
        .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
        .populate('appointmentId', 'date status')
        .sort({ createdAt: -1 });
}

export async function getPrescriptionById(id) {
    const prescription = await Prescription.findById(id)
        .populate('doctorId', 'name specialization consultationFee')
        .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
        .populate('appointmentId', 'date status notes');
    if (!prescription) {
        const err = new Error('Prescription not found');
        err.statusCode = 404;
        throw err;
    }
    return prescription;
}

export async function getPrescriptionByAppointment(appointmentId) {
    return Prescription.findOne({ appointmentId })
        .populate('doctorId', 'name specialization consultationFee')
        .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
        .populate('appointmentId', 'date status notes');
}
