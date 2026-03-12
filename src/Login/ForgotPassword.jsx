import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // 1️⃣ Send OTP
  const sendOtp = async () => {
    try {
      await API.post("api/send-otp/", { email });
      setStep(2);
      setError("");
    } catch {
      setError("Failed to send OTP");
    }
  };

  // 2️⃣ Verify OTP
  const verifyOtp = async () => {
    try {
      await API.post("api/verify-otp/", { email, otp });
      setStep(3);
    } catch {
      setError("Invalid OTP");
    }
  };

  // 3️⃣ Reset Password
  const resetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await API.post("api/reset-password/", {
        email,
        password,
        otp,
      });

      alert("Password reset successful ✅");
      navigate("/login");
    } catch {
      setError("Password reset failed");
    }
  };

  return (
    <div className="auth-card">
      <h2>Forgot Password</h2>
      {error && <p className="error-text">{error}</p>}

      {step === 1 && (
        <>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <input type="password" placeholder="New Password" onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
          <button onClick={resetPassword}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;