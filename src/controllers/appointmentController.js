import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

// Book an appointment
export const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date } = req.body;
        const userId = req.user; // Retrieved from auth middleware

        if (!doctorId || !date) {
            return res.status(400).json({ message: "Doctor ID and Date are required" });
        }

        // --- NEW: Availability Check (Day & Time) ---
        // Find the doctor
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // 1. Convert requested date to Day (e.g., 'Monday')
        // Using UTC to handle ISO strings correctly, assuming user sends UTC or ISO
        const appointmentDate = new Date(date);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[appointmentDate.getUTCDay()];

        // 2. Extract Time (HH:MM)
        const hours = appointmentDate.getUTCHours().toString().padStart(2, '0');
        const minutes = appointmentDate.getUTCMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        // 3. Find if doctor works on this day
        const dayAvailability = doctor.availability.find(d => d.day === dayName);

        if (!dayAvailability) {
            return res.status(400).json({ message: `Doctor is not available on ${dayName}` });
        }

        // 4. Check if time is within range
        if (timeString < dayAvailability.from || timeString > dayAvailability.to) {
            return res.status(400).json({
                message: `Doctor is only available from ${dayAvailability.from} to ${dayAvailability.to} on ${dayName}`
            });
        }
        // ---------------------------------------------

        const existingAppointment = await Appointment.findOne({ doctorId, date });
        if (existingAppointment) {
            return res.status(400).json({ message: "Doctor is not available at this time" });
        }

        const newAppointment = await Appointment.create({
            userId,
            doctorId,
            date,
            status: 'pending',
            paymentStatus: 'pending' // Initialize payment
        });

        res.status(201).json({
            message: "Appointment booked successfully",
            appointment: newAppointment
        });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get user's appointments
export const getMyAppointments = async (req, res) => {
    try {
        const userId = req.user;
        const appointments = await Appointment.find({ userId }).populate('doctorId', 'name specialization');

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update Appointment Status (Doctor/Admin)
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // pending, approved, cancelled

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({
            message: "Appointment status updated",
            data: appointment
        });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get Doctor's Appointments
export const getDoctorAppointments = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // Populate user details (name, email) from the 'userId' field
        const appointments = await Appointment.find({ doctorId }).populate('userId', 'name email');

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        console.error("Error fetching doctor appointments:", error);
        res.status(500).json({ message: "Server error" });
    }
};
