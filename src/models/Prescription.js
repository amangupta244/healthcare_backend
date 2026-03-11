import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true }
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
        index: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
        index: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    medicines: {
        type: [medicineSchema],
        default: []
    },
    followUpDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export default mongoose.model('Prescription', prescriptionSchema);
