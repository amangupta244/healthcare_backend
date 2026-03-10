import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare',
  jwtSecret: process.env.JWT_SECRET || 'changeme',
  jwtExpiry: process.env.JWT_EXPIRY || '1h',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

export default config;