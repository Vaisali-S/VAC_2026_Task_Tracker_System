const nodemailer = require("nodemailer");

// Generate 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Mail sender function
const sendOtpMail = async (email) => {
  const otp = generateOTP();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mugeshdemo@gmail.com",
      pass: "hnxj ctcd peqo kamj"
    }
  });

  const mailOptions = {
    from: "mugeshdemo@gmail.com",
    to: email,
    subject: "Your OTP Verification Code",
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`
  };

  await transporter.sendMail(mailOptions);

  return otp;
};

module.exports = sendOtpMail;