const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (username) => {
  return jwt.sign({ username }, "your_jwt_secret", { expiresIn: "7d" });
};

// SIGNUP
exports.signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic backend validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user.username || user.name);

    res.status(201).json({ token, username: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.name);
    res.json({ token, username: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};