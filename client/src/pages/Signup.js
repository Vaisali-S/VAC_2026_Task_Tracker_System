import { useState } from "react";
import axios from "axios";

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

    // Name: letters, spaces, dots
    if (!formData.name.trim()) errs.name = "Name is required";
    else if (!/^[A-Za-z .]+$/.test(formData.name))
      errs.name = "Name can contain only letters, spaces, and dots";

    // Email
    if (!formData.email) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      errs.email = "Invalid email format";

    // Password
    if (!formData.password) errs.password = "Password is required";
    else if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(
        formData.password
      )
    )
      errs.password =
        "Password must be at least 6 chars, 1 uppercase, 1 digit, 1 special char";

    // Confirm Password
    if (!formData.confirmPassword) errs.confirmPassword = "Confirm password is required";
    else if (formData.confirmPassword !== formData.password)
      errs.confirmPassword = "Passwords do not match";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on change
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
    <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Name */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

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
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-2 top-2 text-gray-600"
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Sign Up
        </button>
      </form>

      <p className="text-sm mt-2 text-center">
        Already have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => (window.location.href = "/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Signup;