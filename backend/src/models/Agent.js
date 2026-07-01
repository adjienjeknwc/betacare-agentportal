// backend/src/models/Agent.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AgentSchema = new mongoose.Schema({
  // Core credentials needed to secure and process an authentic login handshake
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  emailAddress: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  agentCode: { type: String, required: true, unique: true, uppercase: true },

  // Optional multi-step metrics (Enforced with default fallback parameters to prevent validation dropouts)
  branchLocation: { type: String, default: 'Unassigned Branch' },
  reportingManager: { type: String, default: 'Unassigned Manager' },
  agentType: { type: String, default: 'Individual Agent' }
}, { 
  timestamps: true, 
  strict: false // CRITICAL: Tells Mongoose to save all other 7-step fields dynamically to Atlas
});

// ==========================================================================
// SECURE AUTOMATIC ENCRYPTION HOOK
// Hashes plain text passwords automatically right before saving to Atlas
// ==========================================================================
AgentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Agent', AgentSchema);