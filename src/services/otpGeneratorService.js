const otpGenerator = require("otp-generator");

const generate = () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  return otp;
};

module.exports = {
  generate,
};
