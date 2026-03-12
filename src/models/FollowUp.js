import mongoose from 'mongoose';

const followUpSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
        index: true
    },
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
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.model('FollowUp', followUpSchema);
