import { useState } from "react";
import axios from "axios";

function Login({ setUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(""); // clear error on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", formData);

      // Save token + username
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);

      setUser({ token: res.data.token, username: res.data.username });
    } catch (err) {
      // Show centered popup
      setErrorMessage(err.response?.data?.message || "Login failed");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded shadow-md relative">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-gray-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Login
        </button>
      </form>

      {/* Links */}
      <div className="flex justify-between mt-2 text-sm">
        <span className="text-blue-500 cursor-pointer">Forgot Password?</span>
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => (window.location.href = "/signup")}
        >
          Don't have an account? Sign up
        </span>
      </div>

      {/* Centered error popup */}
      {errorMessage && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border p-4 shadow-lg w-52 text-center z-10">
          <p className="text-red-500">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Login;