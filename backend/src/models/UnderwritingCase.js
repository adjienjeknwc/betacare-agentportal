// backend/src/models/UnderwritingCase.js
const mongoose = require('mongoose');

const UnderwritingCaseSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true, index: true },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  customerName: { type: String, required: true },
  planName: { type: String, required: true },
  sumAssured: { type: Number, required: true },
  premium: { type: Number, required: true },
  status: { 
    type: String, 
    default: 'Pending Review', 
    enum: ['Pending Review', 'Approved', 'Rejected', 'Medical Required', 'Additional Docs Required'] 
  },
  aiRiskRating: {
    type: String,
    default: 'Unassessed',
    enum: ['Unassessed', 'Low', 'Medium', 'High']
  },
  aiNotes: {
    type: String,
    default: ''
  },
  proposalFormData: { type: Object },
  kycDocuments: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('UnderwritingCase', UnderwritingCaseSchema);
