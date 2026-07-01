// backend/src/models/Schemas.js
const mongoose = require('mongoose');

// LEAD SCHEMA
const LeadSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: 'Prospect' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true, index: true }
}, { timestamps: true });

// QUOTE SCHEMA
const QuoteSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  customerName: { type: String, required: true },
  sumAssured: { type: Number, required: true },
  premium: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true, index: true }
}, { timestamps: true });

// UNDERWRITING CASE SCHEMA
const UnderwritingCaseSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  customerName: { type: String, required: true },
  status: { type: String, default: 'Pending Review', enum: ['Pending Review', 'Approved', 'Rejected', 'Medical Verification Required'] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true, index: true }
}, { timestamps: true });

// POLICY SCHEMA
const PolicySchema = new mongoose.Schema({
  policyNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  premiumAmount: { type: Number, required: true },
  status: { type: String, default: 'In Force' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true, index: true }
}, { timestamps: true });

module.exports = {
  Lead: mongoose.model('Lead', LeadSchema),
  Quote: mongoose.model('Quote', QuoteSchema),
  UnderwritingCase: mongoose.model('UnderwritingCase', UnderwritingCaseSchema),
  Policy: mongoose.model('Policy', PolicySchema)
};