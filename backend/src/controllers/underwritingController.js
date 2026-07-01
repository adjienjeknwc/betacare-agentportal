// backend/src/controllers/underwritingController.js
const UnderwritingCase = require('../models/UnderwritingCase');
const Lead = require('../models/Lead');

exports.createCase = async (req, res, next) => {
  try {
    const { leadId, customerName, planName, sumAssured, premium, kycDocuments } = req.body;
    
    // Create new underwriting case in database
    const newCase = await UnderwritingCase.create({
      agentId: req.user.id,
      leadId,
      customerName,
      planName,
      sumAssured: Number(sumAssured) || 0,
      premium: Number(premium) || 0,
      status: 'Pending Review',
      kycDocuments
    });

    // Update Lead status to reflect Underwriting Review
    await Lead.findByIdAndUpdate(leadId, { status: 'Underwriting Review' });

    return res.status(201).json({ success: true, data: newCase });
  } catch (err) {
    next(err);
  }
};

exports.getCases = async (req, res, next) => {
  try {
    const filter = { agentId: req.user.id };
    const cases = await UnderwritingCase.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: cases.length, data: cases });
  } catch (err) {
    next(err);
  }
};

exports.updateCaseStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // e.g. "Approved" or "Rejected"
    const allowedStatuses = ['Pending Review', 'Approved', 'Rejected', 'Medical Required', 'Additional Docs Required'];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const updatedCase = await UnderwritingCase.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ success: false, message: 'Underwriting case not found' });
    }

    // Also update Lead status correspondingly
    let leadStatus = 'Underwriting Review';
    if (status === 'Approved') leadStatus = 'Approved';
    if (status === 'Rejected') leadStatus = 'Rejected';
    await Lead.findByIdAndUpdate(updatedCase.leadId, { status: leadStatus });

    return res.status(200).json({ success: true, data: updatedCase });
  } catch (err) {
    next(err);
  }
};
