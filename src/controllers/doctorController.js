import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


export const createDoctor = async (req, res) => {
  const { name, email, password, specialization, experience, consultationFee, availability } = req.body;
  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create User (Role: Doctor)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'doctor'
    });

    // 4. Create Doctor Profile (Linked to User)
    const doctor = await Doctor.create({
      userId: newUser._id,
      name,
      specialization,
      experience,
      consultationFee,
      availability
    });

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      doctor,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const dpctors = await Doctor.find({}); // Get all doctors with their full availabilities

    res.status(200).json({
      success: true,
      data: dpctors
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error" });
  }


};

// Update Doctor
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndUpdate(id, req.body, { new: true });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Doctor
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
};
