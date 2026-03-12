import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("api/login/", {
        email,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        if (res.data.user.name) {
          localStorage.setItem("userName", res.data.user.name);
        }
      }

      window.dispatchEvent(new Event("authChange"));
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      {error && <p className="error-text">{error}</p>}

      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleLogin}>Login</button>

      <p><Link to="/forgot-password">Forgot Password?</Link></p>
      <p>No account? <Link to="/signup">Signup</Link></p>
    </div>
  );
};

export default Login;