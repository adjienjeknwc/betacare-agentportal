const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  role: { type: String, default: 'Sales Agent' },
  experience: { type: String },
  specialization: { type: String },
  status: { type: String, default: 'PENDING APPROVAL' },
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);