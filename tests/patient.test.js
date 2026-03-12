import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Patient from '../src/models/Patient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let adminToken;
let userToken;
let createdPatientId;

describe('Patient routes', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.db.dropDatabase();

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('Admin123', salt);
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashed,
      role: 'admin'
    });
    adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const userHashed = await bcrypt.hash('User1234', salt);
    const user = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: userHashed,
      role: 'user'
    });
    userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  test('GET /api/patients should return 401 without auth', async () => {
    const res = await request(app).get('/api/patients');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/patients should return 403 for non-admin users', async () => {
    const res = await request(app)
      .get('/api/patients')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  test('POST /api/patients should allow admin to add a patient', async () => {
    const res = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'John Patient',
        email: 'john@example.com',
        password: 'Patient123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('email', 'john@example.com');
    createdPatientId = res.body.data.id;
  });

  test('GET /api/patients should return all patients for admin', async () => {
    const res = await request(app)
      .get('/api/patients')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
    // Patient data includes populated userId with name and email
    const patient = res.body.data[0];
    expect(patient).toHaveProperty('_id');
    expect(patient).toHaveProperty('userId');
    expect(patient.userId).toHaveProperty('name');
    expect(patient.userId).toHaveProperty('email');
    expect(patient.userId).not.toHaveProperty('password');
  });

  test('GET /api/patients/:id should return patient by id for admin', async () => {
    const res = await request(app)
      .get(`/api/patients/${createdPatientId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(createdPatientId);
    expect(res.body.data.userId).toHaveProperty('name', 'John Patient');
  });

  test('GET /api/patients/:id/appointments should return patient appointments for admin', async () => {
    const res = await request(app)
      .get(`/api/patients/${createdPatientId}/appointments`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/patients/:id should return 404 for non-existent patient', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/patients/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });
});
