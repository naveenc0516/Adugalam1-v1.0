import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import "./Navbar.css";
import LocationIcon from "../images/image copy 2.png";
import { logoutUser } from "../utils/auth";
import Logout from "../Components/Profile/Logout";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [locationName, setLocationName] = useState("Select City");
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const [userName, setUserName] = useState("");

  /* ================= AUTH SYNC ================= */
  useEffect(() => {
    const syncAuth = async () => {
      const accessToken = localStorage.getItem("access");
      let hasAuth = false;

      if (accessToken) {
        // Check if token is valid by trying to decode it
        try {
          const tokenParts = accessToken.split('.');
          if (tokenParts.length === 3) {
            const base64Url = tokenParts[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join('')
            );
            const payload = JSON.parse(jsonPayload);
            // Check if token is expired
            const currentTime = Date.now() / 1000;
            if (payload.exp && payload.exp < currentTime) {
              // Token is expired, try to refresh
              const refreshToken = localStorage.getItem("refresh");
              if (refreshToken) {
                try {
                  const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh: refreshToken }),
                  });
                  const data = await res.json();
                  if (data.access) {
                    localStorage.setItem("access", data.access);
                    hasAuth = true;
                  } else {
                    // Refresh failed, clear tokens
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                  }
                } catch (e) {
                  localStorage.removeItem("access");
                  localStorage.removeItem("refresh");
                }
              } else {
                localStorage.removeItem("access");
              }
            } else {
              // Token is valid
              hasAuth = true;
            }
          } else {
            // Invalid token format, clear
            localStorage.removeItem("access");
          }
        } catch (e) {
          localStorage.removeItem("access");
        }
      }

      console.log("Navbar: Auth check -", hasAuth ? "Logged in" : "Logged out");
      setIsAuth(hasAuth);
      if (hasAuth) {
        setUserName(localStorage.getItem("userName") || "");
      } else {
        setUserName("");
      }
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("authChange", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authChange", syncAuth);
    };
  }, []);

  /* ================= LOCATION SYNC ================= */
  useEffect(() => {
    const syncLocation = () => {
      const savedLocation = localStorage.getItem("locationName");
      if (savedLocation) {
        setLocationName(savedLocation);
      }
    };

    syncLocation();
    window.addEventListener("locationChange", syncLocation);

    return () => {
      window.removeEventListener("locationChange", syncLocation);
    };
  }, []);

  const closeSidebar = () => setOpen(false);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="navbar-container">

          {/* MENU */}
          <button className="menu-toggle" onClick={() => setOpen(true)}>
            <FiMenu size={22} />
          </button>

          {/* LOGO */}
          <NavLink to="/" className="navbar-logo">
            Adugalam
          </NavLink>

          {/* LOCATION (DYNAMIC) */}
          <NavLink to="/location" className="loca">
            <img src={LocationIcon} alt="" className="local" />
            &nbsp; {locationName}
          </NavLink>

          {/* MOBILE PROFILE */}
          <div className="mobile-profile-right">
            {isAuth && (
              <NavLink to="/profile" className="mobile-profile">
                <CgProfile size={20} />
                {userName && <span className="mobile-username" style={{ marginLeft: '6px', fontSize: '14px', fontWeight: '600', color: '#333' }}>{userName}</span>}
              </NavLink>
            )}
          </div>

          {/* DESKTOP MENU */}
          <nav className="navbar-menu">
            <NavLink to="/" end>Home</NavLink>


            <NavLink to="/play">Play</NavLink>
            <NavLink to="/Bookhome">Book</NavLink>
            <NavLink to="/train">Train</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/tournaments">Tournaments</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>

          </nav>

          {/* ACTIONS */}
          <div className="navbar-actions">
            <NavLink to="/download" className="btn-outline">
              Download App
            </NavLink>

            <NavLink to="/partner" className="btn-primary">
              Partner With Us
            </NavLink>

            {!isAuth ? (
              <NavLink to="/login" className="btn-primary">
                Login
              </NavLink>
            ) : (
              <NavLink to="/profile" className="profile-icon user-profile-box">
                <CgProfile size={28} />
                {userName && <span className="navbar-username">{userName}</span>}
              </NavLink>
            )}
          </div>
        </div>

        <div className="navbar-shadow" />
      </header>

      {/* ================= SIDEBAR ================= */}
      {open && <div className="sidebar-overlay" onClick={closeSidebar} />}

      <aside className={`mobile-sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">Adugalam</span>

          <button className="sidebar-close" onClick={closeSidebar}>
            <FiX size={22} />
          </button>
        </div>

        <nav className="sidebar-links">
          <NavLink to="/" end onClick={closeSidebar}>Home</NavLink>




          <NavLink to="/play" onClick={closeSidebar}>Play</NavLink>
          <NavLink to="/Bookhome" onClick={closeSidebar}>Book</NavLink>
          <NavLink to="/train" onClick={closeSidebar}>Train</NavLink>
          <NavLink to="/shop" onClick={closeSidebar}>Shop</NavLink>
          <NavLink to="/tournaments" onClick={closeSidebar}>Tournaments</NavLink>
          <NavLink to="/events" onClick={closeSidebar}>Events</NavLink>
          <NavLink to="/about" onClick={closeSidebar}>About</NavLink>
          <NavLink to="/contact" onClick={closeSidebar}>Contact</NavLink>
          <NavLink to="/profile" onClick={closeSidebar}>Profile</NavLink>
          <div className="sidebar-logout" onClick={() => {
            setLogoutPopupOpen(true);
          }}>
            Logout
          </div>




          {!isAuth && (
            <NavLink to="/login" onClick={closeSidebar} className="sidebar-login">
              Login
            </NavLink>
          )}
        </nav>
      </aside>

      {/* LOGOUT POPUP */}
      {logoutPopupOpen && <Logout setOpen={setLogoutPopupOpen} />}
    </>
  );
};

export default Navbar;

