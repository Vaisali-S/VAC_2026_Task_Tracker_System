const nodemailer = require("nodemailer");

// Temporary OTP storage (later we can move to DB)
const otpStore = {};

// OTP generator
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Mail transporter (your sample adapted)
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mugeshdemo@gmail.com",
    pass: "hnxj ctcd peqo kamj",
  },
});

// Send OTP
const sendOTP = async (email) => {
  const otp = generateOTP();

  otpStore[email] = otp;

  let mailOptions = {
    from: "mugeshdemo@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// Verify OTP
const verifyOTP = (email, otp) => {
  if (otpStore[email] === otp) {
    delete otpStore[email];
    return true;
  }
  return false;
};

module.exports = { sendOTP, verifyOTP };