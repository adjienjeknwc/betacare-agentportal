// backend/src/controllers/policyController.js
const Policy = require('../models/Policy');
const UnderwritingCase = require('../models/UnderwritingCase');
const Lead = require('../models/Lead');

exports.issuePolicy = async (req, res, next) => {
  try {
    const { caseId, paymentMode } = req.body;
    
    // Find the underwriting case
    const uCase = await UnderwritingCase.findById(caseId);
    if (!uCase) {
      return res.status(404).json({ success: false, message: 'Underwriting case not found' });
    }
    
    if (uCase.status !== 'Approved') {
      return res.status(400).json({ success: false, message: 'Only approved underwriting cases can be issued as policies' });
    }

    const policyNumber = `POL-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const proposalNumber = `PROP-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Calculate premiums
    const total = uCase.premium;
    const basePremium = Math.round(total / 1.18);
    const gstAmount = total - basePremium;

    // Determine planType from planName
    let planType = 'Term';
    if (uCase.planName.toLowerCase().includes('ulip')) planType = 'ULIP';
    else if (uCase.planName.toLowerCase().includes('whole')) planType = 'Whole Life';

    const commencementDate = new Date();
    const nextPremiumDueDate = new Date();
    nextPremiumDueDate.setFullYear(commencementDate.getFullYear() + 1); // Annual default next year

    const newPolicy = await Policy.create({
      policyNumber,
      proposalNumber,
      assignedAgent: req.user.id,
      customerName: uCase.customerName,
      planName: uCase.planName,
      planType,
      sumAssured: uCase.sumAssured,
      basePremium,
      riderPremium: 0,
      gstAmount,
      totalAnnualPremium: total,
      paymentFrequency: 'Annual',
      policyCommencementDate: commencementDate,
      nextPremiumDueDate,
      policyStatus: 'Active'
    });

    // Update underwriting case and lead statuses to finalize
    uCase.status = 'Approved'; // Remains approved but is now connected to policy
    await uCase.save();

    await Lead.findByIdAndUpdate(uCase.leadId, { status: 'Policy Issued' });

    return res.status(201).json({ success: true, data: newPolicy });
  } catch (err) {
    next(err);
  }
};

exports.getPolicies = async (req, res, next) => {
  try {
    const filter = { assignedAgent: req.user.id };
    const policies = await Policy.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: policies.length, data: policies });
  } catch (err) {
    next(err);
  }
};

exports.getPolicyById = async (req, res, next) => {
  try {
    const policy = await Policy.findOne({ policyNumber: req.params.policyNumber.toUpperCase() });
    if (!policy) {
      return res.status(404).json({ success: false, message: 'Policy not found' });
    }
    return res.status(200).json({ success: true, data: policy });
  } catch (err) {
    next(err);
  }
};
