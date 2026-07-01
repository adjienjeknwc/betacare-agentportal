// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.registerAgent = async (req, res) => {
  try {
    const { username, password, fullName } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ success: false, message: 'Agent identity username already claimed.' });

    const user = await User.create({ username, password, fullName });
    return res.status(201).json({ success: true, message: 'Agent registration completed successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.loginAgent = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.verifyPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials profile mismatch.' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'PORTAL_SECRET_KEY', { expiresIn: '7d' });
    return res.status(200).json({ success: true, token, agent: { fullName: user.fullName, brokerId: user.brokerId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};