import express from 'express';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';

import userRoutes from './src/routes/userRoutes.js';
import doctorRoutes from './src/routes/doctorRoutes.js';
import appointmentRoutes from './src/routes/appointmentRoutes.js';




dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

connectDB();

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});