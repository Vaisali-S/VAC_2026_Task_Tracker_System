import { useState } from "react";
import axios from "axios";
import "../styles/midnight-ai.css";

function Signup({ setUser }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const [alert, setAlert] = useState({ message: "", type: "" });

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) errs.name = "Name is required";
    else if (!/^[A-Za-z .]+$/.test(formData.name))
      errs.name = "Only letters, spaces & dots allowed";

    if (!formData.email) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      errs.email = "Invalid email";

    if (!formData.password) errs.password = "Password required";
    else if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(
        formData.password
      )
    )
      errs.password = "6+ chars, 1 uppercase, 1 number, 1 symbol";

    if (formData.confirmPassword !== formData.password)
      errs.confirmPassword = "Passwords do not match";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Function to show alert on top
  const showAlert = (msg, type) => {
    setAlert({ message: msg, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 2000);
  };

  // 📩 Send OTP
  const handleSendOtp = async () => {
    if (!formData.email) {
      showAlert("Enter email first", "error");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/send-otp", {
        email: formData.email,
      });
      setOtpSent(true);
      showAlert("OTP sent ✉️", "success");
    } catch {
      showAlert("OTP send failed", "error");
    }
  };

  // 🔐 Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      showAlert("Enter OTP", "error");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/verify-otp", {
        email: formData.email,
        otp,
      });
      setVerified(true);
      showAlert("OTP verified ✅", "success");
    } catch {
      showAlert("Invalid OTP", "error");
    }
  };

  // 🚀 Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!verified) {
      showAlert("Verify OTP first", "error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);

      setUser({ token: res.data.token, username: res.data.username });
    } catch (err) {
      showAlert(err.response?.data?.message || "Signup failed", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      
      {/* ALERT */}
      {alert.message && (
        <div
          className={`absolute top-5 w-full max-w-md px-4 py-2 rounded text-center font-medium ${
            alert.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="glass-card w-full max-w-md p-6">

        <h1 className="text-2xl font-bold mb-4 text-center ai-title">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="ai-input"
          />
          {errors.name && <p className="ai-error">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="ai-input"
          />
          {errors.email && <p className="ai-error">{errors.email}</p>}

          {/* OTP */}
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
              className="absolute right-3 top-2 text-blue-300 hover:text-blue-100"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <p className="ai-error">{errors.password}</p>}

          {/* Confirm */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="ai-input w-full"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2 text-blue-300 hover:text-blue-100"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="ai-error">{errors.confirmPassword}</p>
          )}

          <button type="submit" className="ai-btn mt-2">
            Sign Up
          </button>
        </form>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <span
            className="ai-link"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;