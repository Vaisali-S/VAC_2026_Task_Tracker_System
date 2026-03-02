const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// OTP Mailer
const { sendOTP, verifyOTP } = require("./otpMailer");

// Temporary OTP status tracker
const verifiedUsers = require("./verifiedUsers");

// Routes
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// ================= OTP ROUTES =================

// Send OTP
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    await sendOTP(email);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const isValid = verifyOTP(email, otp);

  if (isValid) {
    verifiedUsers[email] = true;
    res.json({ message: "OTP Verified" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

// Check if user verified
app.post("/api/check-verification", (req, res) => {
  const { email } = req.body;

  if (verifiedUsers[email]) {
    res.json({ verified: true });
  } else {
    res.json({ verified: false });
  }
});

// ==============================================

app.get("/", (req, res) => {
  res.send("Server is running");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));