// backend/models/Policy.js
const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  policyNumber: { type: String, required: true, unique: true, uppercase: true },
  proposalNumber: { type: String, required: true, unique: true },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  customerName: { type: String, required: true },
  planName: { type: String, required: true }, // e.g. "Term Life Secure Scheme"
  planType: { type: String, enum: ['Term', 'Whole Life', 'ULIP'], default: 'Term' },
  sumAssured: { type: Number, required: true },
  basePremium: { type: Number, required: true },
  riderPremium: { type: Number, default: 0 },
  gstAmount: { type: Number, required: true },
  totalAnnualPremium: { type: Number, required: true },
  paymentFrequency: { type: String, enum: ['Annual', 'Half-Yearly', 'Quarterly', 'Monthly'], default: 'Annual' },
  policyCommencementDate: { type: Date, default: Date.now },
  nextPremiumDueDate: { type: Date, required: true },
  policyStatus: { type: String, enum: ['Active', 'Under Review', 'Lapsed'], default: 'Active' },
  
  selectedRiders: [{
    riderName: String,
    coverageAmount: Number,
    premiumAmount: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Policy', PolicySchema);