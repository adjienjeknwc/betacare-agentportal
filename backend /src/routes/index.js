const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const registerRoutes = require('./registerRoutes');

router.use('/auth', authRoutes);
router.use('/register', registerRoutes);

module.exports = router;