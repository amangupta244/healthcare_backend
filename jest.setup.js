// jest setup file for tests
import dotenv from 'dotenv';
dotenv.config();
process.env.NODE_ENV = 'test';

// defaults for testing
process.env.JWT_SECRET = process.env.JWT_SECRET || 'changeme';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_test';

