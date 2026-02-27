import { useState } from "react";
import axios from "axios";
import "../styles/midnight-ai.css";

function Login({ setUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);

      setUser({ token: res.data.token, username: res.data.username });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Login failed");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card w-full max-w-md p-6 relative">

        <h1 className="text-2xl font-bold mb-4 text-center ai-title">
          Login
        </h1>

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

          <button
            type="submit"
            className="ai-btn mt-2"
          >
            Login
          </button>
        </form>

        {/* Links */}
        <div className="flex justify-between mt-3 text-sm">
          <span className="ai-link">
            Forgot Password?
          </span>
          <span
            className="ai-link"
            onClick={() => (window.location.href = "/signup")}
          >
            Don't have an account? Sign up
          </span>
        </div>

        {/* Error Popup */}
        {errorMessage && (
          <div className="popup-error">
            <p>{errorMessage}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default Login;