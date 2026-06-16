const Agent = require('../models/Agent');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../utils/asyncWrapper');
const { formatResponse } = require('../middleware/responseHandler');

exports.login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  const agent = await Agent.findOne({ email });
  if (!agent || !(await agent.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Generate standard Login JWT
  const token = jwt.sign(
    { id: agent._id, role: agent.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  return formatResponse(res, 200, 'Login successful', {
    token,
    agent: {
      id: agent._id,
      email: agent.email,
      status: agent.registrationStatus
    }
  });
});