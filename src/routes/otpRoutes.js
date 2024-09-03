const express = require('express');
const { sendOTP, verifyOTP } = require('../controllers/otpController');

const router = express.Router();

router.post('/sendOTP/:email', sendOTP);
router.post('/verifyOTP/:email/:otp', verifyOTP);

module.exports = router;
