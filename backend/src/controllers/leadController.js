// backend/src/controllers/leadController.js
const Lead = require('../models/Lead');
const Quote = require('../models/Quote');

exports.createLead = async (req, res, next) => {
  try {
    const newLead = await Lead.create({ 
      ...req.body, 
      agentId: req.user.id 
    });
    return res.status(201).json({ success: true, data: newLead });
  } catch (err) {
    next(err);
  }
};

exports.getLeads = async (req, res, next) => {
  try {
    const filter = { agentId: req.user.id };
    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    
    return res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    next(err);
  }
};

exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    return res.status(200).json(lead);
  } catch (err) {
    next(err);
  }
};

exports.updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    return res.status(200).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    return res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getMetrics = async (req, res, next) => {
  try {
    const scope = { agentId: req.user.id };

    const [total, hot, warm, cold, quotes] = await Promise.all([
      Lead.countDocuments(scope),
      Lead.countDocuments({ ...scope, temperature: 'Hot' }),
      Lead.countDocuments({ ...scope, temperature: 'Warm' }),
      Lead.countDocuments({ ...scope, temperature: 'Cold' }),
      Lead.countDocuments({ ...scope, status: 'Quote Shared' })
    ]);

    return res.status(200).json({
      success: true,
      metrics: { total, hot, warm, cold, quotes }
    });
  } catch (err) {
    next(err);
  }
};