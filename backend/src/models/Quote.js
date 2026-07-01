// backend/models/Quote.js
const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  customerName: { type: String, required: true },
  basePremium: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  totalPayable: { type: Number, required: true },
  coverageAmount: { type: Number, required: true },
  policyTerm: { type: Number, required: true }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Quote', QuoteSchema);