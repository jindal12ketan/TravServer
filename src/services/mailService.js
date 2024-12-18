const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendOtpEmail = async (to, text) => {
  await sendMail(to, "Your OTP Code", text);
};

const sendPasswordResetEmail = async (email) => {
  await sendMail(
    email,
    "Password Reset",
    "Your password has been successfully reset. If you did not request this change, please contact our support team immediately."
  );
};

module.exports = {
  sendMail,
  sendOtpEmail,
  sendPasswordResetEmail,
};
