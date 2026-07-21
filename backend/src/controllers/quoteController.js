// backend/src/controllers/quoteController.js
const Quote = require('../models/Quote');
const Lead = require('../models/Lead');

exports.createQuote = async (req, res, next) => {
  try {
    // Enforce Lead ownership verification to prevent cross-agent data sharing
    const lead = await Lead.findOne({ _id: req.body.leadId, agentId: req.user.id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Referenced Lead not found or not authorized' });
    }

    const quote = await Quote.create({
      ...req.body,
      agentId: req.user.id
    });
    
    // Update Lead status to 'Quote Generated'
    lead.status = 'Quote Generated';
    await lead.save();

    return res.status(201).json({ success: true, data: quote });
  } catch (err) {
    next(err);
  }
};

exports.getQuotes = async (req, res, next) => {
  try {
    const filter = { agentId: req.user.id };
    const quotes = await Quote.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: quotes });
  } catch (err) {
    next(err);
  }
};
