import mongoose from 'mongoose';

const { Schema } = mongoose;

const documentSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  required: { type: Boolean, default: true }
}, { _id: false });

const sourceSchema = new Schema({
  sourceType: {
    type: String,
    enum: ['VERIFIED', 'DEMO'],
    required: true
  },
  authority: { type: String, required: true, trim: true },
  url: { type: String, trim: true },
  lastVerifiedAt: { type: Date }
}, { _id: false });

const eligibilityRulesSchema = new Schema({
  minimumAge: { type: Number, min: 0 },
  maximumAge: { type: Number, min: 0 },
  minimumIncome: { type: Number, min: 0 },
  maximumIncome: { type: Number, min: 0 },
  allowedPurposes: [{ type: String, trim: true }],
  allowedBusinessStages: [{ type: String, trim: true }],
  allowedSectors: [{ type: String, trim: true }],
  allowedStates: [{ type: String, trim: true }],
  allowedDistricts: [{ type: String, trim: true }],
  beneficiaryCategories: [{ type: String, trim: true }],
  allowedGenders: [{ type: String, trim: true }],
  registrationRequirements: [{ type: String, trim: true }],
  educationRequirements: [{ type: String, trim: true }]
}, { _id: false });

const financialRulesSchema = new Schema({
  minimumLoanAmount: { type: Number, min: 0 },
  maximumLoanAmount: { type: Number, min: 0 },
  interestRate: { type: Number, min: 0 },
  moratoriumMonths: { type: Number, min: 0 },
  tenureMonths: { type: Number, min: 1 }
}, { _id: false });

const applicationProcessSchema = new Schema({
  steps: [{ type: String, trim: true }],
  notes: { type: String, trim: true }
}, { _id: false });

const schemeSchema = new Schema({
  schemeId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    match: /^[A-Z0-9_-]+$/
  },
  name: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['BUSINESS', 'EDUCATION', 'AGRICULTURE', 'SELF_EMPLOYMENT', 'OTHER']
  },
  targetBeneficiaries: [{ type: String, trim: true }],
  sectors: [{ type: String, trim: true }],
  applicableStates: [{ type: String, trim: true }],
  benefits: [{ type: String, trim: true }],
  eligiblePurposes: [{ type: String, trim: true }],
  eligibilityRules: { type: eligibilityRulesSchema, required: true },
  financialRules: { type: financialRulesSchema, required: true },
  requiredDocuments: [documentSchema],
  applicationProcess: { type: applicationProcessSchema, required: true },
  officialWebsite: { type: String, trim: true },
  applicationUrl: { type: String, trim: true },
  source: { type: sourceSchema, required: true },
  status: {
    type: String,
    enum: ['DRAFT', 'ACTIVE', 'INACTIVE'],
    default: 'DRAFT',
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

schemeSchema.index({ status: 1, category: 1 });
schemeSchema.index({ applicableStates: 1, status: 1 });
schemeSchema.index({ sectors: 1, status: 1 });

export default mongoose.models.Scheme || mongoose.model('Scheme', schemeSchema);
