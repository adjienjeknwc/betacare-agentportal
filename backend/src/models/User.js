// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('mongoose-bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  fullName: { type: String, default: 'Insurance Agent' },
  brokerId: { type: String, unique: true, default: () => `AG-${Math.floor(1000 + Math.random() * 9000)}` }
}, { timestamps: true });

UserSchema.plugin(bcrypt);
module.exports = mongoose.model('User', UserSchema);