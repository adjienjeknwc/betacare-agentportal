const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PersonalSchema = new mongoose.Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  mobileNumber: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String }
}, { _id: false });

const ProfessionalSchema = new mongoose.Schema({
  selectedRole: { type: String, enum: ['Sales Agent', 'Senior Advisor', 'Underwriter'] },
  employeeId: { type: String },
  designation: { type: String },
  branchLocation: { type: String },
  yearsOfExperience: { type: String },
  licenseNumber: { type: String },
  specialization: { type: String },
  reportingManager: { type: String }
}, { _id: false });

const KYCSchema = new mongoose.Schema({
  panCard: { type: String }, // File path/URL
  aadhaarCard: { type: String }, // File path/URL
  agentLicense: { type: String }, // File path/URL
  addressProof: { type: String }, // File path/URL
  profilePhoto: { type: String }, // File path/URL
  verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'FAILED'], default: 'PENDING' },
  aiFlags: [{ type: String }] // e.g., ["Aadhaar name mismatch detected"]
}, { _id: false });

const CredentialsSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
  securityQuestion: { type: String },
  securityAnswer: { type: String },
  twoFactorEnabled: { type: Boolean, default: false }
}, { _id: false });

const AgentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true }, // Root identifier
  personalDetails: PersonalSchema,
  professionalDetails: ProfessionalSchema,
  kyc: KYCSchema,
  credentials: CredentialsSchema,
  
  // System Fields
  role: { type: String, default: 'AGENT' },
  registrationStep: { type: Number, default: 1, min: 1, max: 5 },
  isApproved: { type: Boolean, default: false },
  registrationStatus: { 
    type: String, 
    enum: ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'], 
    default: 'DRAFT' 
  }
}, { timestamps: true });

// Pre-save hook for password hashing
AgentSchema.pre('save', async function(next) {
  if (this.isModified('credentials.password')) {
    const salt = await bcrypt.genSalt(10);
    this.credentials.password = await bcrypt.hash(this.credentials.password, salt);
  }
  next();
});

// Method to check password
AgentSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.credentials.password);
};

module.exports = mongoose.model('Agent', AgentSchema);