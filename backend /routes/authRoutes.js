const express = require('express');
const router = express.Router();
const { registerAgent, loginAgent } = require('../controllers/authController');

router.post('/register', registerAgent);
router.post('/login', loginAgent);

module.exports = router;