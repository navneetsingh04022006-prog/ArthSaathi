import mongoose from 'mongoose';

const { Schema } = mongoose;

const contactInformationSchema = new Schema({
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  website: { type: String, trim: true }
}, { _id: false });

const addressSchema = new Schema({
  addressLine: { type: String, trim: true },
  city: { type: String, trim: true },
  district: { type: String, trim: true },
  state: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  country: { type: String, trim: true, default: 'India' }
}, { _id: false });

const locationSchema = new Schema({
  latitude: { type: Number, min: -90, max: 90 },
  longitude: { type: Number, min: -180, max: 180 }
}, { _id: false });

const sourceSchema = new Schema({
  sourceType: {
    type: String,
    enum: ['OFFICIAL_GOVERNMENT', 'OFFICIAL_INSTITUTION', 'DEMO', 'OTHER'],
    required: true
  },
  sourceUrl: { type: String, trim: true },
  lastVerifiedAt: { type: Date }
}, { _id: false });

const partnerSchema = new Schema({
  partnerId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    match: /^[A-Z0-9_-]+$/
  },
  name: { type: String, required: true, trim: true, maxlength: 200 },
  partnerType: {
    type: String,
    required: true,
    enum: [
      'BANK',
      'FINANCIAL_INSTITUTION',
      'GOVERNMENT_AGENCY',
      'DEVELOPMENT_CORPORATION',
      'DISTRICT_OFFICE',
      'SUPPORT_CENTER',
      'EDUCATIONAL_INSTITUTION',
      'ENTREPRENEURSHIP_CENTER',
      'OTHER'
    ]
  },
  description: { type: String, trim: true, maxlength: 1000 },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', required: true },
  verificationStatus: { type: String, enum: ['VERIFIED', 'DEMO', 'UNVERIFIED'], required: true },
  contactInformation: { type: contactInformationSchema, default: undefined },
  address: { type: addressSchema, required: true },
  location: { type: locationSchema, default: undefined },
  supportedSchemes: [{ type: String, uppercase: true, trim: true }],
  supportedCategories: [{ type: String, uppercase: true, trim: true }],
  supportedPurposes: [{ type: String, uppercase: true, trim: true }],
  serviceTypes: [{
    type: String,
    enum: [
      'SCHEME_APPLICATION_SUPPORT',
      'LOAN_APPLICATION_SUPPORT',
      'DOCUMENTATION_SUPPORT',
      'FINANCIAL_GUIDANCE',
      'ENTREPRENEURSHIP_SUPPORT',
      'EDUCATION_LOAN_SUPPORT',
      'BUSINESS_LOAN_SUPPORT',
      'APPLICATION_SUBMISSION',
      'GENERAL_INFORMATION'
    ]
  }],
  eligibilityNotes: { type: String, trim: true },
  operatingHours: { type: String, trim: true },
  source: { type: sourceSchema, required: true }
}, {
  timestamps: true,
  versionKey: false
});

partnerSchema.index({ status: 1, verificationStatus: 1 });
partnerSchema.index({ partnerType: 1, status: 1 });
partnerSchema.index({ supportedSchemes: 1, status: 1 });
partnerSchema.index({ 'address.state': 1, 'address.district': 1, status: 1 });

export default mongoose.models.Partner || mongoose.model('Partner', partnerSchema);