import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./AdminSignup.css";

const AdminSignup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: ""
  });

  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  // Validation regex
  const nameRegex = /^[A-Za-z\s]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
  const otpRegex = /^\d{4,6}$/;

  // Invalid fake phone numbers
  const invalidPhones = [
    "1234567890",
    "0123456789",
    "1111111111",
    "2222222222",
    "3333333333",
    "4444444444",
    "5555555555",
    "6666666666",
    "7777777777",
    "8888888888",
    "9999999999"
  ];

  // Field Validation on Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let err = "";

   if (name === "email") {
  if (value && !emailRegex.test(value))
    err = "Email must be a valid @gmail.com address";
}

    if (name === "email") {
      if (value && !emailRegex.test(value))
        err = "Invalid email format";
    }

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return; // allow only digits
      if (value.length > 10) return;

      if (value.length === 10) {
        if (!phoneRegex.test(value))
          err = "Enter valid 10-digit Indian phone";
        else if (invalidPhones.includes(value))
          err = "Invalid phone number";
      }
    }

    if (name === "otp") {
      if (value && !otpRegex.test(value))
        err = "OTP must be 4–6 digits";
    }

    if (name === "password") {
      if (value && value.length < 6)
        err = "Password must be at least 6 characters";
    }

    if (name === "confirmPassword") {
      if (value && value !== form.password)
        err = "Passwords do not match";
    }

    setError(err);
    setForm({ ...form, [name]: value });
  };

  // Send OTP
  const sendOtp = async () => {
    if (!form.name || !form.email || !form.phone) {
      return setError("All fields are required");
    }

    if (!nameRegex.test(form.name))
      return setError("Invalid name");

   if (!emailRegex.test(form.email))
     return setError("Email must be a valid @gmail.com address");
    
    if (!phoneRegex.test(form.phone))
      return setError("Invalid phone number");

    if (invalidPhones.includes(form.phone))
      return setError("Invalid phone number");

    try {
      await axios.post("http://127.0.0.1:8000/api/admin/send-otp/", {
        email: form.email,
        role: "ADMIN"
      });

      setOtpSent(true);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "OTP sending failed");
    }
  };

  // Verify OTP + Create Account
  const verifyOtp = async () => {
    if (!otpRegex.test(form.otp))
      return setError("Invalid OTP");

    if (!form.password || !form.confirmPassword) {
      return setError("Password fields are required");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/admin/verify-otp/", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        otp: form.otp,
        password: form.password
      });

      navigate("/AdminLogin");
    } catch {
      setError("Invalid OTP");
    }
  };

  return (
    <div className="admin-signup-wrapper">
      <div className="admin-signup">
        <h2>Admin Signup</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Enter Full Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email Address"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Enter Phone Number"
          value={form.phone}
          onChange={handleChange}
        />

        {!otpSent ? (
          <button onClick={sendOtp}>Send OTP</button>
        ) : (
          <>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
            />

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                👁
              </span>
            </div>

            <div className="password-box">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <span
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                👁
              </span>
            </div>

            <button onClick={verifyOtp}>Create Account</button>
          </>
        )}

        <p className="login-link">
          Already have an account?
          <Link to="AdminLogin"> Login</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;