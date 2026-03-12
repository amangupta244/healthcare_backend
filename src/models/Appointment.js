import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
        index: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    notes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// ensure a doctor can't have two appointments at same date/time
appointmentSchema.index({ doctorId: 1, date: 1 }, { unique: true });

export default mongoose.model('Appointment', appointmentSchema);
