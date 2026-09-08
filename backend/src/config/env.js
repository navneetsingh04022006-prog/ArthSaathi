import dotenv from 'dotenv';

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI || '',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 100),
  defaultPartnerSearchRadiusKm: Number(process.env.DEFAULT_PARTNER_SEARCH_RADIUS_KM || 10),
  maxPartnerSearchRadiusKm: Number(process.env.MAX_PARTNER_SEARCH_RADIUS_KM || 100),
  defaultPartnerResultLimit: Number(process.env.DEFAULT_PARTNER_RESULT_LIMIT || 20),
  maxPartnerResultLimit: Number(process.env.MAX_PARTNER_RESULT_LIMIT || 100)
};

export function requireEnvironment() {
  if (!env.mongodbUri) {
    throw new Error('MONGODB_URI is required to start the backend.');
  }

  return env;
}

export default env;
