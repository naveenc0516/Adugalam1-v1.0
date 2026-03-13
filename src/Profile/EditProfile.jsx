import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./EditProfile.css";

const EditProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    username: "",
    email: "",
    mobile: "",
  });

  // Load user data
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setForm({
        firstname: user.firstname || "",
        username: user.username || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Save profile
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access");
      const API_BASE = "http://127.0.0.1:8000";

      const res = await fetch(`${API_BASE}/api/user/profile/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Update user locally
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userName", data.user.name);

        // Dispatch to update headers cleanly
        window.dispatchEvent(new Event("authChange"));

        alert("Profile updated successfully ✅");
        navigate("/MyProfile");
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while updating profile");
    }
  };

  return (
    <div className="editprofile-page">
      {/* Header */}
      <div className="editprofile-header">
        <button onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h3>Edit profile</h3>
      </div>

      {/* Form */}
      <div className="editprofile-form">
        <div className="field">
          <label>Name</label>
          <input
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Email address</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Phone number</label>
          <div className="phone-input">
            <span>+91</span>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Save button */}
      <button className="save-btn" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default EditProfile;
