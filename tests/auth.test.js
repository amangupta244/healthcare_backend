import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

// simple smoke tests for auth

const TEST_USER = { name: 'Test User', email: 'test@example.com', password: 'Password1' };

describe('Auth routes', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_test');
    // Seed the test user so login tests are independent of the register test
    await request(app).post('/api/auth/register').send(TEST_USER);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  test('register should create a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: 'another@example.com',
        password: 'Password1'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', 'another@example.com');
    expect(res.body).toHaveProperty('token');
  });

  test('login should return token and user info', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password1'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
    expect(res.body.user).toHaveProperty('role');
    expect(res.body.user).toHaveProperty('name');
  });

  test('login with wrong password should return 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('success', false);
  });
});