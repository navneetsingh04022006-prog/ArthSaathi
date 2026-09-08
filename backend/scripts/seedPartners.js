import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import env, { requireEnvironment } from '../src/config/env.js';
import Partner from '../src/models/Partner.js';

const demoPartners = [
  {
    partnerId: 'DEMO-PARTNER-SUPPORT-001',
    name: 'Demo Financial Support Center',
    partnerType: 'SUPPORT_CENTER',
    description: 'Non-authoritative demo record for scheme application support testing.',
    status: 'ACTIVE',
    verificationStatus: 'DEMO',
    address: {
      addressLine: 'Demo Service Road',
      city: 'Demo City',
      district: 'DEMO_DISTRICT',
      state: 'DEMO_STATE',
      postalCode: '000000',
      country: 'India'
    },
    location: { latitude: 20, longitude: 75 },
    supportedSchemes: ['DEMO-MICRO-BUSINESS-001'],
    supportedCategories: ['BUSINESS'],
    supportedPurposes: ['DEMO_BUSINESS_START'],
    serviceTypes: ['SCHEME_APPLICATION_SUPPORT', 'DOCUMENTATION_SUPPORT', 'GENERAL_INFORMATION'],
    operatingHours: 'Demo hours only',
    source: { sourceType: 'DEMO' }
  },
  {
    partnerId: 'DEMO-PARTNER-BANK-001',
    name: 'Demo Channel Finance Institution',
    partnerType: 'FINANCIAL_INSTITUTION',
    description: 'Non-authoritative demo record for loan application support testing.',
    status: 'ACTIVE',
    verificationStatus: 'DEMO',
    address: {
      addressLine: 'Demo Main Street',
      city: 'Demo City',
      district: 'DEMO_DISTRICT',
      state: 'DEMO_STATE',
      postalCode: '000001',
      country: 'India'
    },
    location: { latitude: 20.01, longitude: 75.01 },
    supportedSchemes: ['DEMO-MICRO-BUSINESS-001'],
    supportedCategories: ['BUSINESS'],
    supportedPurposes: ['DEMO_BUSINESS_START'],
    serviceTypes: ['LOAN_APPLICATION_SUPPORT', 'BUSINESS_LOAN_SUPPORT'],
    operatingHours: 'Demo hours only',
    source: { sourceType: 'DEMO' }
  }
];

async function seedPartners() {
  requireEnvironment();
  await connectDatabase(env.mongodbUri);

  for (const partner of demoPartners) {
    await Partner.updateOne(
      { partnerId: partner.partnerId },
      { $setOnInsert: partner },
      { upsert: true, runValidators: true }
    );
  }

  console.log(`Seeded ${demoPartners.length} demo partner record(s).`);
}

try {
  await seedPartners();
} catch (error) {
  console.error(`Unable to seed partners: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (env.mongodbUri) {
    await disconnectDatabase();
  }
}