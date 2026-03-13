import React, { useState, useEffect } from 'react'
import "./Profile.css"
import profileImg from "/profile.png"
import { useNavigate } from 'react-router-dom'
import Logout from './Logout'
import API from '../../api/api'

import MyProfileImg from '/3d-realistic-person-people-vector-illustration.png'
import AboutUsImg from '/3d-vector-warning-danger-risk-message-alert-problem-icon.png'
import logoutImg from '/3d-align-left-isolated-icon-illustration-render.png'
import FaqImg from '/FAQ_Adugalam_Sports turf near me.webp'
import PPImg from '/privacy-document - Adugalam Sports turf near me.webp'

const Profile = () => {

  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const [user, setUser] = useState({})

  // Fetch User Settings
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

  // Check if user is authenticated
  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    // Check if token is valid
    try {
      const tokenParts = accessToken.split('.');
      if (tokenParts.length !== 3) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
        return;
      }

      const base64Url = tokenParts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      const payload = JSON.parse(jsonPayload);
      const currentTime = Date.now() / 1000;

      if (payload.exp && payload.exp < currentTime) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
      }
    } catch (e) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/login");
    }
  }, [navigate]);

  function handleLogout(params) {
    setOpen(true)
  }
  return (
    <div className='profile-container'>

      <p>Profile</p>

      <div className="profile-card">
        <img src={profileImg} alt="" />

        <div className="info">
          <span>{user.name || "N/A"}</span>
          <span>{user.email || "N/A"}</span>
        </div>
      </div>


      <div className="option-container">
        <div className="option" onClick={() => navigate('/myprofile')}>
          <section >
            <img src={MyProfileImg} alt="" />
            My Profile
          </section>

          <span> &rarr; </span>
        </div>

        <div className="option" onClick={() => navigate('/faq')}>
          <section>
            <img src={FaqImg} alt="" />
            FAQ
          </section>

          <span> &rarr; </span>
        </div>
        <div className="option" onClick={() => navigate('/privacypolicy')}>
          <section>
            <img src={PPImg} alt="" />
            Privacy Policy
          </section>

          <span> &rarr; </span>
        </div>

        <div className="option" onClick={() => navigate('/aboutus')}>
          <section>
            <img src={AboutUsImg} alt="" />
            About us
          </section>

          <span> &rarr; </span>
        </div>


        <div className="option" onClick={handleLogout}>
          <section >
            <img src={logoutImg} alt="" />
            Logout
          </section>

          <span> &rarr; </span>
        </div>
      </div>

      {open && <Logout setOpen={setOpen} />}
    </div>
  )
}

export default Profile