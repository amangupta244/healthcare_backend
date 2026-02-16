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
    type: String,
    required: true
  },
  consultationFee: {
    type: String,
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

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;