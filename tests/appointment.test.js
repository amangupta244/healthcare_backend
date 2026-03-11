import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Doctor from '../src/models/Doctor.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let userToken, doctorToken, doctorId, appointmentId;

describe('Appointment routes', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.db.dropDatabase();

    // create regular user
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('User123', salt);
    const user = await User.create({ name: 'User', email: 'user@example.com', password: hashed, role: 'user' });
    userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // create a doctor via service or directly
    const salt2 = await bcrypt.genSalt(10);
    const hashed2 = await bcrypt.hash('Doctor123', salt2);
    const docUser = await User.create({ name: 'Doc', email: 'doc@example.com', password: hashed2, role: 'doctor' });
    doctorId = (await Doctor.create({ userId: docUser._id, name: 'Doc', specialization: 'Test', experience: 5, consultationFee: 100, availability: [{ day: 'Monday', from: '08:00', to: '18:00' }] }))._id;
    doctorToken = jwt.sign({ id: docUser._id, role: docUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  test('book appointment successfully', async () => {
    // find next Monday at 10:00 UTC
    let date = new Date();
    while (date.getUTCDay() !== 1) { // 1 = Monday
      date.setDate(date.getDate() + 1);
    }
    date.setUTCHours(10, 0, 0, 0);

    const [dateOnly, timeOnly] = date.toISOString().split('T');
    const time = timeOnly.slice(0, 5); // HH:MM

    const res = await request(app)
      .post('/api/appointments/book')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ doctorId: doctorId.toString(), date: dateOnly, time });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('appointment');
    appointmentId = res.body.appointment._id;
  });

  test('get my appointments', async () => {
    const res = await request(app)
      .get('/api/appointments/my-appointments')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
  });

  test('doctor or admin can update status', async () => {
    expect(appointmentId).toBeDefined();
    const res = await request(app)
      .put(`/api/appointments/${appointmentId}/status`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({ status: 'completed' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('completed');
  });
  test('doctor can view own appointments', async () => {
    const res = await request(app)
      .get(`/api/appointments/doctor/${doctorId}`)
      .set('Authorization', `Bearer ${doctorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
  });
});