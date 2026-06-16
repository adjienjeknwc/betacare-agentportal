const Agent = require('../models/Agent');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new agent
const registerAgent = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobile, role, experience, specialization } = req.body;

    const agentExists = await Agent.findOne({ email });
    if (agentExists) {
      return res.status(400).json({ message: 'Agent with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const agent = await Agent.create({
      firstName, lastName, email, password: hashedPassword, mobile, role, experience, specialization
    });

    if (agent) {
      res.status(201).json({
        _id: agent.id,
        name: `${agent.firstName} ${agent.lastName}`,
        email: agent.email,
        token: generateToken(agent._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid agent data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Authenticate an agent
const loginAgent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const agent = await Agent.findOne({ email });

    if (agent && (await bcrypt.compare(password, agent.password))) {
      res.json({
        _id: agent.id,
        name: `${agent.firstName} ${agent.lastName}`,
        email: agent.email,
        role: agent.role,
        token: generateToken(agent._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = { registerAgent, loginAgent };