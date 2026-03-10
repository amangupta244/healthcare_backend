import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let adminToken;
let createdDoctorId;

describe('Doctor routes', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.db.dropDatabase();

    // create an admin user directly
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('Admin123', salt);
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashed,
      role: 'admin'
    });

    // sign token
    adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  test('should allow admin to create a doctor', async () => {
    const res = await request(app)
      .post('/api/doctors/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Dr. Who',
        email: 'doctor@example.com',
        password: 'Doctor123',
        specialization: 'Time Travel',
        experience: 10,
        consultationFee: 200,
        availability: [{ day: 'Monday', from: '09:00', to: '17:00' }]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('doctor');
    createdDoctorId = res.body.doctor._id;
  });

  test('should fetch doctor list', async () => {
    const res = await request(app)
      .get('/api/doctors')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('should get doctor by id', async () => {
    const res = await request(app)
      .get(`/api/doctors/${createdDoctorId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(createdDoctorId);
  });

  test('should update doctor', async () => {
    const res = await request(app)
      .put(`/api/doctors/${createdDoctorId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ consultationFee: 250 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.consultationFee).toBe(250);
  });

  test('should delete doctor', async () => {
    const res = await request(app)
      .delete(`/api/doctors/${createdDoctorId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });
});