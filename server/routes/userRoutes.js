const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendOtpMail = require("../utils/sendOtpMail");

// Temporary in-memory OTP storage (email → { otp, expiresAt })
const otpStore = {};
// Verified users after correct OTP (email → true)
const verifiedUsers = require("../verifiedUsers");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ================= SEND OTP =================
// POST /api/users/send-otp
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const otp = await sendOtpMail(email);
    // Store OTP with 5 min expiry
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ================= VERIFY OTP =================
// POST /api/users/verify-otp
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP required" });

  const record = otpStore[email];
  if (!record) return res.status(400).json({ message: "No OTP sent" });
  if (Date.now() > record.expiresAt)
    return res.status(400).json({ message: "OTP expired" });
  if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  // Mark as verified
  verifiedUsers[email] = true;
  // Remove from OTP store
  delete otpStore[email];

  res.json({ message: "OTP verified" });
});

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  if (!verifiedUsers[email])
    return res.status(401).json({ message: "OTP not verified" });

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password });

    // Clear verification after use
    delete verifiedUsers[email];

    res.status(201).json({
      token: generateToken(user._id),
      username: user.name,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  if (!verifiedUsers[email])
    return res.status(401).json({ message: "OTP not verified" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // Clear verification after use
    delete verifiedUsers[email];

    res.json({
      token: generateToken(user._id),
      username: user.name,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;