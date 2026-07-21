// backend/src/controllers/underwritingController.js
const UnderwritingCase = require('../models/UnderwritingCase');
const Lead = require('../models/Lead');

exports.createCase = async (req, res, next) => {
  try {
    const { leadId, customerName, planName, sumAssured, premium, kycDocuments } = req.body;
    
    // Verify lead ownership to prevent cross-agent case hijack
    const lead = await Lead.findOne({ _id: leadId, agentId: req.user.id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found or not authorized' });
    }

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

    // Update Lead status to reflect 'Proposal Submitted' (aligns with flow)
    lead.status = 'Proposal Submitted';
    await lead.save();

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

    const updatedCase = await UnderwritingCase.findOneAndUpdate(
      { _id: req.params.id, agentId: req.user.id },
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ success: false, message: 'Underwriting case not found or not authorized' });
    }

    // Also update Lead status correspondingly (constrained by owner agentId)
    let leadStatus = 'Underwriting Review';
    if (status === 'Approved') leadStatus = 'Approved';
    if (status === 'Rejected') leadStatus = 'Rejected';
    await Lead.findOneAndUpdate({ _id: updatedCase.leadId, agentId: req.user.id }, { status: leadStatus });

    return res.status(200).json({ success: true, data: updatedCase });
  } catch (err) {
    next(err);
  }
};

exports.runAiAudit = async (req, res, next) => {
  try {
    const caseId = req.params.id;
    
    // Verify case ownership first
    const uCase = await UnderwritingCase.findOne({ _id: caseId, agentId: req.user.id });
    if (!uCase) {
      return res.status(404).json({ success: false, message: 'Underwriting case not found or not authorized' });
    }

    const { exec } = require('child_process');
    const path = require('path');

    // Path to the python interpreter in the virtual environment
    const pythonPath = "/Users/aditi/my-first-agents/venv/bin/python";
    const scriptPath = path.join(__dirname, '..', 'services', 'underwrite_agent.py');

    console.log(`🤖 Launching AI Underwriting Risk Crew for Case ID: ${caseId}`);
    
    // Pass case ID to the Python script
    exec(`"${pythonPath}" "${scriptPath}" ${caseId}`, {
      env: { 
        ...process.env, 
        GEMINI_API_KEY: process.env.GEMINI_API_KEY || "" 
      }
    }, async (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Python execution error: ${error.message}`);
        console.error(`STDERR: ${stderr}`);
        return res.status(500).json({ success: false, message: 'AI Audit execution failed', error: error.message });
      }

      console.log(`💡 Python Output:\n${stdout}`);

      // Fetch the updated case from the database (restricted by owner agentId)
      const updatedCase = await UnderwritingCase.findOne({ _id: caseId, agentId: req.user.id });
      if (!updatedCase) {
        return res.status(404).json({ success: false, message: 'Underwriting case not found after audit' });
      }

      return res.status(200).json({ success: true, data: updatedCase });
    });
  } catch (err) {
    next(err);
  }
};
