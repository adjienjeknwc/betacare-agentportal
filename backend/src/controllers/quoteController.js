// backend/src/controllers/quoteController.js
const Quote = require('../models/Quote');
const Lead = require('../models/Lead');

exports.createQuote = async (req, res, next) => {
  try {
    const quote = await Quote.create({
      ...req.body,
      agentId: req.user.id
    });
    // Update Lead status to 'Quote Shared'
    await Lead.findByIdAndUpdate(req.body.leadId, { status: 'Quote Shared' });
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
