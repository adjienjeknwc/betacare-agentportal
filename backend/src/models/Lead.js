// backend/models/Lead.js
const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, default: 'Male' },
  annualIncome: { type: Number, default: 1800000 },
  city: { type: String, default: '' },
  state: { type: String, default: 'Maharashtra' },
  smokingStatus: { type: String, default: 'Non-Smoker' },
  coverageAmount: { type: Number, default: 28500000 },
  policyTerm: { type: Number, default: 35 },
  temperature: { type: String, enum: ['Hot', 'Warm', 'Cold'], default: 'Warm' },
  status: { type: String, default: 'New Lead' }
}, { timestamps: true, strict: false });

LeadSchema.index({ agentId: 1, createdAt: -1 });
module.exports = mongoose.model('Lead', LeadSchema);