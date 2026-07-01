// backend/src/routes/index.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Agent = require('../models/Agent');
const leadRoutes = require('./leadRoutes');
const { protectAgentContext } = require('../middleware/authMiddleware');
const UnderwritingCase = require('../models/UnderwritingCase');
const Policy = require('../models/Policy');
const Lead = require('../models/Lead');
const Quote = require('../models/Quote');

const underwritingCtrl = require('../controllers/underwritingController');
const policyCtrl = require('../controllers/policyController');

// ==========================================================================
// REGISTRATION ENDPOINT
// ==========================================================================
router.post('/auth/register', async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.emailAddress) payload.emailAddress = payload.emailAddress.toLowerCase().trim();
    if (payload.username) payload.username = payload.username.toLowerCase().trim();

    const existingAgent = await Agent.findOne({ 
      $or: [{ emailAddress: payload.emailAddress }, { username: payload.username }] 
    });
    
    if (existingAgent) {
      return res.status(400).json({ success: false, message: 'An account with this email or username is already registered.' });
    }

    const newAgent = new Agent(payload);
    await newAgent.save();

    console.log(`✨ New Agent Document deployed successfully to Atlas: Code ${newAgent.agentCode}`);
    return res.status(201).json({ 
      success: true, 
      message: 'Agent profile saved successfully!',
      agentCode: newAgent.agentCode 
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================================================
// LOGIN ENDPOINT
// ==========================================================================
router.post('/auth/login', async (req, res, next) => {
  try {
    const { agentId, password } = req.body;

    if (!agentId || !password) {
      return res.status(400).json({ success: false, message: 'All authentication fields are required.' });
    }

    const searchKey = agentId.trim().toLowerCase();

    const agent = await Agent.findOne({
      $or: [
        { username: searchKey },
        { emailAddress: searchKey },
        { agentCode: agentId.trim().toUpperCase() }
      ]
    });

    if (!agent) {
      console.log(`❌ Login Failed: Identity token entry "${agentId}" not found in database.`);
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(String(password), String(agent.password));
    if (!isMatch) {
      console.log(`❌ Login Failed: Password verification failed for agent: "${agent.username}"`);
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    // Sign session JWT
    const token = jwt.sign(
      { agentId: agent._id, agentCode: agent.agentCode, name: `${agent.firstName} ${agent.lastName}` },
      process.env.JWT_SECRET || 'super_secure_enterprise_jwt_secret_key_2026',
      { expiresIn: '1d' }
    );

    console.log(`✅ Login Success: Agent "${agent.username}" logged in cleanly.`);
    return res.status(200).json({
      success: true,
      token,
      agent: {
        id: agent._id,
        agentCode: agent.agentCode,
        firstName: agent.firstName,
        lastName: agent.lastName,
        emailAddress: agent.emailAddress,
        role: agent.agentType || 'Sales Agent'
      }
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================================================
// CENTRAL METRICS ENDPOINT
// ==========================================================================
router.get('/dashboard/metrics', protectAgentContext, async (req, res, next) => {
  try {
    const filter = { agentId: req.user.id };
    const policyFilter = { assignedAgent: req.user.id };

    const [leadsCount, quotesCount, casesCount, policiesCount] = await Promise.all([
      Lead.countDocuments(filter),
      Quote.countDocuments(filter),
      UnderwritingCase.countDocuments(filter),
      Policy.countDocuments(policyFilter)
    ]);

    res.status(200).json({
      success: true,
      metrics: {
        leads: leadsCount,
        quotes: quotesCount,
        underwriting: casesCount,
        policies: policiesCount
      }
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================================================
// MOUNT COMPONENT ROUTES
// ==========================================================================
router.use('/leads', leadRoutes);

// Underwriting Routes
router.route('/underwriting')
  .post(protectAgentContext, underwritingCtrl.createCase)
  .get(protectAgentContext, underwritingCtrl.getCases);
router.route('/underwriting/:id')
  .put(protectAgentContext, underwritingCtrl.updateCaseStatus);

// Policy Routes
router.route('/policies')
  .post(protectAgentContext, policyCtrl.issuePolicy)
  .get(protectAgentContext, policyCtrl.getPolicies);
router.route('/policies/:policyNumber')
  .get(protectAgentContext, policyCtrl.getPolicyById);

// Quote Routes
const quoteCtrl = require('../controllers/quoteController');
router.route('/quotes')
  .post(protectAgentContext, quoteCtrl.createQuote)
  .get(protectAgentContext, quoteCtrl.getQuotes);

module.exports = router;