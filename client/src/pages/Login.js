import { useState } from "react";
import axios from "axios";
import "../styles/midnight-ai.css";

function Login({ setUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  // OTP
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  // Message alert
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // "error" or "success"

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showMessage = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 2000); // disappear after 2s
  };

  // 📩 Send OTP
  const handleSendOtp = async () => {
    if (!formData.email) {
      showMessage("Enter email first", "error");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/users/send-otp", {
        email: formData.email,
      });
      setOtpSent(true);
      showMessage("OTP sent to your email ✉️", "success");
    } catch (err) {
      showMessage("Failed to send OTP", "error");
    }
  };

  // 🔐 Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      showMessage("Enter OTP", "error");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/users/verify-otp", {
        email: formData.email,
        otp,
      });
      setVerified(true);
      showMessage("OTP Verified ✅", "success");
    } catch (err) {
      showMessage("Invalid OTP", "error");
    }
  };

  // 🔓 Login (only after OTP)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verified) {
      showMessage("Verify OTP first", "error");
      return;
    }

    if (!formData.password) {
      showMessage("Enter password", "error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      setUser({ token: res.data.token, username: res.data.username });
    } catch (err) {
      showMessage(err.response?.data?.message || "Login failed", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">

      {/* Floating message above card */}
      {message && (
        <div
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 bg-white border p-4 shadow-lg w-52 text-center z-50 ${
            messageType === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </div>
      )}

      <div className="glass-card w-full max-w-md p-6 relative">
        <h1 className="text-2xl font-bold mb-4 text-center ai-title">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="ai-input"
          />

{/* Password */}
<div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    className="ai-input w-full"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-2 text-blue-300 hover:text-blue-100 transition"
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>
          {/* OTP Field */}
          <div className="relative">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="ai-input w-full"
            />
            <button
              type="button"
              onClick={otpSent ? handleVerifyOtp : handleSendOtp}
              className="absolute right-3 top-2 text-blue-300 hover:text-blue-100 transition"
            >
              {otpSent ? "Verify" : "Send OTP"}
            </button>
          </div>

          {/* Login Button */}
          <button type="submit" className="ai-btn mt-2">
            Login
          </button>
        </form>

        {/* Links */}
        <div className="flex justify-between mt-3 text-sm">
          <span className="ai-link">Forgot Password?</span>
          <span className="ai-link" onClick={() => (window.location.href = "/signup")}>
            Don't have an account? Sign up
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;