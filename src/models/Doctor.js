import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true
  },
  consultationFee: {
    type: Number,
    required: true
  },
  availability: [
    {
      day: { type: String, required: true },
      from: { type: String, required: true },
      to: { type: String, required: true }
    }
  ]
},
  { timestamps: true }
);

doctorSchema.index({ userId: 1 });

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;