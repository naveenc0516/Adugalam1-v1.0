import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import API from "../api/api";
import "./MyProfile.css";

const MyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("api/user/profile/");
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (savedUser) setUser(savedUser);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="myprofile-page">
      {/* Header */}
      <div className="myprofile-header">
        <button onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h3>My profile</h3>
        <button onClick={() => navigate("/EditProfile")}>
          <FaEdit />
        </button>
      </div>

      {/* Details */}
      <div className="myprofile-box">
        <label>Full name</label>
        <div className="myprofile-field">{user.name}</div>

        <label>Email address</label>
        <div className="myprofile-field">{user.email}</div>

        <label>Phone number</label>
        <div className="myprofile-field">+91 {user.mobile}</div>
      </div>
    </div>
  );
};

export default MyProfile;

