const OTP = require('../models/OTP');
const { sendOtpEmail } = require('../services/mailService');
const otpGenerator = require('../services/otpGeneratorService');

const sendOTP = async (req, res) => {
  try {
    const email = req.params.email;
    const otp = otpGenerator.generate();
    const otpMessage = `Your OTP is: ${otp}`;

    let otpRecord = await OTP.findOne({ email: email });

    if (otpRecord) {
      otpRecord.otp = otp;
    } else {
      otpRecord = new OTP({ email, otp });
    }

    await otpRecord.save();
    await sendOtpEmail(email, otpMessage);

    res.send('OTP sent successfully');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.params;
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp) {
      res.status(400).send('Invalid OTP');
      return;
    }

    res.send('OTP verification successful');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};
