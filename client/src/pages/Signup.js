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

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) errs.name = "Name is required";
    else if (!/^[A-Za-z .]+$/.test(formData.name))
      errs.name = "Name can contain only letters, spaces, and dots";

    if (!formData.email) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      errs.email = "Invalid email format";

    if (!formData.password) errs.password = "Password is required";
    else if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(
        formData.password
      )
    )
      errs.password =
        "Password must be at least 6 chars, 1 uppercase, 1 digit, 1 special char";

    if (!formData.confirmPassword)
      errs.confirmPassword = "Confirm password is required";
    else if (formData.confirmPassword !== formData.password)
      errs.confirmPassword = "Passwords do not match";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

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
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card w-full max-w-md p-6">

        <h1 className="text-2xl font-bold mb-4 text-center ai-title">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="ai-input"
            />
            {errors.name && <p className="ai-error">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="ai-input"
            />
            {errors.email && <p className="ai-error">{errors.email}</p>}
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
              className="absolute right-3 top-2 text-blue-300 hover:text-blue-100 transition"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && <p className="ai-error">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
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
              className="absolute right-3 top-2 text-blue-300 hover:text-blue-100 transition"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
            {errors.confirmPassword && (
              <p className="ai-error">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="ai-btn mt-2"
          >
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