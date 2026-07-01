// backend/src/routes/portalRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { Lead, Quote, UnderwritingCase, Policy } = require('../models/Schemas');

// ==========================================================================
// CENTRAL AGENT DASHBOARD METRICS ENDPOINT
// Fetches isolated totals and triggers structural empty states for new signups
// ==========================================================================
router.get('/dashboard/metrics', protect, async (req, res, next) => {
  try {
    const queryConstraint = { createdBy: req.user.id };

    // Concurrent lookups constrained entirely by the authenticated user's ID
    const [leadsCount, quotesCount, casesCount, policiesCount] = await Promise.all([
      Lead.countDocuments(queryConstraint),
      Quote.countDocuments(queryConstraint),
      UnderwritingCase.countDocuments(queryConstraint),
      Policy.countDocuments(queryConstraint)
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
// ISOLATED LEADS ENDPOINTS
// ==========================================================================
router.get('/leads', protect, async (req, res, next) => {
  try {
    // Only display leads explicitly built by this agent
    const leads = await Lead.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    next(error);
  }
});

router.post('/leads', protect, async (req, res, next) => {
  try {
    // Overwrite any incoming hijacked createdBy parameter with the verified session payload user ID
    const newLeadData = { ...req.body, createdBy: req.user.id };
    const lead = new Lead(newLeadData);
    await lead.save();
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
});

module.exports = router;