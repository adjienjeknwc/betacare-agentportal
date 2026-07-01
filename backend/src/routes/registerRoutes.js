const express = require('express');
const router = express.Router();
const regController = require('../controllers/registrationController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Step 1 does not require auth, it generates the JWT to continue
router.post('/personal-details', regController.step1Personal);

// Steps 2-5 require the temporary registration JWT token
router.use(protect);

router.post('/professional-info', regController.step2Professional);

router.post('/kyc', upload.fields([
  { name: 'panCard', maxCount: 1 },
  { name: 'aadhaarCard', maxCount: 1 },
  { name: 'agentLicense', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]), regController.step3KYC);

router.post('/credentials', regController.step4Credentials);
router.post('/submit', regController.step5Submit);

module.exports = router;