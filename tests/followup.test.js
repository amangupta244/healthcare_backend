import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Doctor from '../src/models/Doctor.js';
import Patient from '../src/models/Patient.js';
import Appointment from '../src/models/Appointment.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let doctorToken, patientToken, doctorId, patientId, patientRecord, appointmentId, followupId;

describe('Follow-up routes', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.db.dropDatabase();

    const salt = await bcrypt.genSalt(10);

    // Create patient user and patient profile
    const patient = await User.create({
      name: 'Patient FollowUp',
      email: 'patientfollowup@example.com',
      password: await bcrypt.hash('Patient123', salt),
      role: 'user'
    });
    patientId = patient._id;
    patientRecord = await Patient.create({ userId: patient._id });
    patientToken = jwt.sign({ id: patient._id, role: patient.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create doctor user and doctor profile
    const docUser = await User.create({
      name: 'Dr. FollowUp',
      email: 'drfollowup@example.com',
      password: await bcrypt.hash('Doctor123', salt),
      role: 'doctor'
    });
    const doctor = await Doctor.create({
      userId: docUser._id,
      name: 'Dr. FollowUp',
      specialization: 'General',
      experience: 5,
      consultationFee: 100,
      availability: [{ day: 'Monday', from: '08:00', to: '18:00' }]
    });
    doctorId = doctor._id;
    doctorToken = jwt.sign({ id: docUser._id, role: docUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Find the next Monday (day 1) efficiently
    let appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + ((8 - appointmentDate.getUTCDay()) % 7 || 7));
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

  test('doctor can create a follow-up recommendation', async () => {
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 7);

    const res = await request(app)
      .post('/api/followups')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        appointmentId: appointmentId.toString(),
        date: followUpDate.toISOString(),
        notes: 'Please come back in a week for re-evaluation'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.appointmentId).toBe(appointmentId.toString());
    followupId = res.body.data._id;
  });

  test('patient can view their follow-up suggestions', async () => {
    const res = await request(app)
      .get(`/api/followups/patient/${patientRecord._id}`)
      .set('Authorization', `Bearer ${patientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  test('doctor can view follow-ups they created', async () => {
    const res = await request(app)
      .get(`/api/followups/doctor/${doctorId}`)
      .set('Authorization', `Bearer ${doctorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  test('returns 404 when appointment does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 7);

    const res = await request(app)
      .post('/api/followups')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        appointmentId: fakeId.toString(),
        date: followUpDate.toISOString()
      });

    expect(res.statusCode).toBe(404);
  });

  test('returns 401 when unauthenticated', async () => {
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 7);

    const res = await request(app)
      .post('/api/followups')
      .send({
        appointmentId: appointmentId.toString(),
        date: followUpDate.toISOString()
      });

    expect(res.statusCode).toBe(401);
  });

  test('returns 400 on validation error for invalid appointmentId', async () => {
    const res = await request(app)
      .post('/api/followups')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        appointmentId: 'not-a-valid-id',
        date: new Date().toISOString()
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
