const express = require('express');
const router = express.Router();
const { protectAgentContext } = require('../middleware/authMiddleware');
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getMetrics
} = require('../controllers/leadController');

router.route('/')
  .get(protectAgentContext, getLeads)
  .post(protectAgentContext, createLead);

router.route('/dashboard/metrics')
  .get(protectAgentContext, getMetrics);

router.route('/single/:id')
  .get(protectAgentContext, getLeadById);

router.route('/:id')
  .put(protectAgentContext, updateLead)
  .delete(protectAgentContext, deleteLead);

module.exports = router;