import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import env, { requireEnvironment } from '../src/config/env.js';
import Scheme from '../src/models/Scheme.js';

const demoSchemes = [
  {
    schemeId: 'DEMO-MICRO-BUSINESS-001',
    name: 'Demo Micro Business Support Configuration',
    description: 'Non-authoritative sample data used to validate the ArthSaathi scheme data flow.',
    category: 'BUSINESS',
    targetBeneficiaries: ['DEMO_ENTREPRENEUR'],
    sectors: ['DEMO_MICRO_BUSINESS'],
    applicableStates: ['DEMO_STATE'],
    benefits: ['Sample benefit text for development only.'],
    eligiblePurposes: ['DEMO_BUSINESS_START'],
    eligibilityRules: {
      minimumAge: 18,
      maximumIncome: 500000,
      allowedPurposes: ['DEMO_BUSINESS_START'],
      allowedBusinessStages: ['NEW'],
      allowedSectors: ['DEMO_MICRO_BUSINESS'],
      allowedStates: ['DEMO_STATE'],
      beneficiaryCategories: ['DEMO_ENTREPRENEUR']
    },
    financialRules: {
      minimumLoanAmount: 10000,
      maximumLoanAmount: 140000,
      interestRate: 6.5,
      moratoriumMonths: 3,
      tenureMonths: 60
    },
    requiredDocuments: [
      { name: 'Demo identity document', required: true },
      { name: 'Demo project summary', required: true }
    ],
    applicationProcess: {
      steps: ['Review demo eligibility information.', 'Replace demo data with verified scheme data before use.'],
      notes: 'This record is not a government scheme and must not be used for applications.'
    },
    source: {
      sourceType: 'DEMO',
      authority: 'ArthSaathi development configuration'
    },
    status: 'DRAFT'
  }
];

async function seedSchemes() {
  requireEnvironment();
  await connectDatabase(env.mongodbUri);

  for (const scheme of demoSchemes) {
    await Scheme.updateOne(
      { schemeId: scheme.schemeId },
      { $set: scheme },
      { upsert: true, runValidators: true }
    );
  }

  console.log(`Seeded ${demoSchemes.length} demo scheme record(s).`);
}

try {
  await seedSchemes();
} catch (error) {
  console.error(`Unable to seed schemes: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (env.mongodbUri) {
    await disconnectDatabase();
  }
}
