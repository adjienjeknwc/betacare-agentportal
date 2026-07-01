const Agent = require('../models/Agent');
const jwt = require('jsonwebtoken');
const { formatResponse } = require('../middleware/responseHandler');
const asyncWrapper = require('../utils/asyncWrapper');

// STEP 1: Personal Details (Initial Creation)
exports.step1Personal = asyncWrapper(async (req, res) => {
  const { email } = req.body;
  
  let agent = await Agent.findOne({ email });
  if (agent && agent.registrationStatus !== 'DRAFT') {
    return res.status(400).json({ success: false, message: 'Email already registered.' });
  }

  if (!agent) {
    agent = new Agent({ email, personalDetails: req.body });
  } else {
    agent.personalDetails = req.body;
  }
  
  agent.registrationStep = 2;
  await agent.save();

  // Issue a temporary registration token
  const regToken = jwt.sign({ id: agent._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return formatResponse(res, 200, 'Personal details saved.', { regToken, step: 2 });
});

// STEP 2: Professional Information
exports.step2Professional = asyncWrapper(async (req, res) => {
  const agent = await Agent.findById(req.user.id); // req.user populated by auth middleware
  
  agent.professionalDetails = req.body;
  agent.registrationStep = 3;
  await agent.save();

  return formatResponse(res, 200, 'Professional details saved.', { step: 3 });
});

// STEP 3: KYC Verification (Multer Multi-field upload)
exports.step3KYC = asyncWrapper(async (req, res) => {
  const agent = await Agent.findById(req.user.id);
  
  const files = req.files || {};
  const kycData = {
    panCard: files['panCard'] ? files['panCard'][0].path : agent.kyc?.panCard,
    aadhaarCard: files['aadhaarCard'] ? files['aadhaarCard'][0].path : agent.kyc?.aadhaarCard,
    agentLicense: files['agentLicense'] ? files['agentLicense'][0].path : agent.kyc?.agentLicense,
    addressProof: files['addressProof'] ? files['addressProof'][0].path : agent.kyc?.addressProof,
    profilePhoto: files['profilePhoto'] ? files['profilePhoto'][0].path : agent.kyc?.profilePhoto,
  };

  agent.kyc = kycData;
  agent.registrationStep = 4;
  
  // Example AI Mock Logic
  if (!kycData.aadhaarCard) {
     agent.kyc.aiFlags = ["Document missing"];
  }

  await agent.save();
  return formatResponse(res, 200, 'KYC documents uploaded successfully.', { step: 4, aiFlags: agent.kyc.aiFlags });
});

// STEP 4: Credentials
exports.step4Credentials = asyncWrapper(async (req, res) => {
  const agent = await Agent.findById(req.user.id);
  const { username, password, securityQuestion, securityAnswer, twoFactorEnabled } = req.body;

  // Check if username is taken
  const existingUser = await Agent.findOne({ 'credentials.username': username, _id: { $ne: agent._id } });
  if (existingUser) return res.status(400).json({ success: false, message: 'Username taken.' });

  agent.credentials = { username, password, securityQuestion, securityAnswer, twoFactorEnabled };
  agent.registrationStep = 5;
  await agent.save(); // Password hashed via pre-save hook

  return formatResponse(res, 200, 'Credentials saved.', { step: 5 });
});

// STEP 5: Review & Submit
exports.step5Submit = asyncWrapper(async (req, res) => {
  const agent = await Agent.findById(req.user.id);
  
  if (!req.body.declarationAccepted) {
    return res.status(400).json({ success: false, message: 'You must accept the declaration.' });
  }

  agent.registrationStatus = 'SUBMITTED';
  await agent.save();

  return formatResponse(res, 200, 'Registration submitted successfully. Pending admin approval.', { 
    status: agent.registrationStatus 
  });
});