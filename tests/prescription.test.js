import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Doctor from '../src/models/Doctor.js';
import Patient from '../src/models/Patient.js';
import Appointment from '../src/models/Appointment.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let doctorToken, patientToken, doctorId, patientId, patientRecord, appointmentId, prescriptionId;

describe('Prescription routes', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.db.dropDatabase();

    const salt = await bcrypt.genSalt(10);

    // Create patient user and patient profile
    const patient = await User.create({
      name: 'Patient Test',
      email: 'patient@example.com',
      password: await bcrypt.hash('Patient123', salt),
      role: 'user'
    });
    patientId = patient._id;
    patientRecord = await Patient.create({ userId: patient._id });
    patientToken = jwt.sign({ id: patient._id, role: patient.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create doctor user + doctor profile
    const docUser = await User.create({
      name: 'Dr. Test',
      email: 'drtest@example.com',
      password: await bcrypt.hash('Doctor123', salt),
      role: 'doctor'
    });
    const doctor = await Doctor.create({
      userId: docUser._id,
      name: 'Dr. Test',
      specialization: 'General',
      experience: 5,
      consultationFee: 100,
      availability: [{ day: 'Monday', from: '08:00', to: '18:00' }]
    });
    doctorId = doctor._id;
    doctorToken = jwt.sign({ id: docUser._id, role: docUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // find next Monday at 10:00 UTC
    let appointmentDate = new Date();
    while (appointmentDate.getUTCDay() !== 1) {
      appointmentDate.setDate(appointmentDate.getDate() + 1);
    }
    appointmentDate.setUTCHours(10, 0, 0, 0);

    const appointment = await Appointment.create({
      patientId: patientRecord._id,
      doctorId,
      date: appointmentDate,
      status: 'completed',
      paymentStatus: 'paid'
    });
    appointmentId = appointment._id;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  test('doctor can create a prescription', async () => {
    const res = await request(app)
      .post('/api/prescriptions')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        appointmentId: appointmentId.toString(),
        patientId: patientRecord._id.toString(),
        diagnosis: 'Common cold',
        notes: 'Rest well',
        medicines: [
          { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice a day', duration: '5 days' }
        ]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.diagnosis).toBe('Common cold');
    prescriptionId = res.body.data._id;
  });

  test('patient can view their prescriptions', async () => {
    const res = await request(app)
      .get('/api/prescriptions/my-prescriptions')
      .set('Authorization', `Bearer ${patientToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  test('doctor can view their created prescriptions', async () => {
    const res = await request(app)
      .get('/api/prescriptions/my-doctor-prescriptions')
      .set('Authorization', `Bearer ${doctorToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('get prescription by ID', async () => {
    expect(prescriptionId).toBeDefined();
    const res = await request(app)
      .get(`/api/prescriptions/${prescriptionId}`)
      .set('Authorization', `Bearer ${doctorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(prescriptionId);
  });

  test('download prescription returns HTML', async () => {
    expect(prescriptionId).toBeDefined();
    const res = await request(app)
      .get(`/api/prescriptions/${prescriptionId}/download`)
      .set('Authorization', `Bearer ${doctorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
    expect(res.text).toContain('Prescription');
  });
});
