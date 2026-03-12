import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import "./Navbar.css";
import LocationIcon from "../images/image copy 2.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [locationName, setLocationName] = useState("Select City");
  const [userName, setUserName] = useState("");

  /* ================= AUTH SYNC ================= */
  useEffect(() => {
    const syncAuth = () => {
      setIsAuth(!!localStorage.getItem("access"));
      // Get user name from localStorage
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser && savedUser.name) {
        setUserName(savedUser.name);
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
              </NavLink>
            )}
          </div>

          {/* DESKTOP MENU */}
          <nav className="navbar-menu">
            <NavLink to="/">Home</NavLink>

            {isAuth && (
              <>
                <NavLink to="/play">Play</NavLink>
                <NavLink to="/Bookhome">Book</NavLink>
                <NavLink to="/train">Train</NavLink>
                <NavLink to="/shop">Shop</NavLink>
                <NavLink to="/tournaments">Tournaments</NavLink>
                <NavLink to="/events">Events</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/contact">Contact</NavLink>
              </>
            )}
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
              <NavLink to="/profile" className="profile-icon">
                <CgProfile size={28} />
                {userName && <span className="profile-name">{userName}</span>}
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
          <NavLink to="/" onClick={closeSidebar}>Home</NavLink>

          {isAuth && (
            <>
              <NavLink to="/play" onClick={closeSidebar}>Play</NavLink>
              <NavLink to="/Bookhome" onClick={closeSidebar}>Book</NavLink>
              <NavLink to="/train" onClick={closeSidebar}>Train</NavLink>
              <NavLink to="/shop" onClick={closeSidebar}>Shop</NavLink>
              <NavLink to="/tournaments" onClick={closeSidebar}>Tournaments</NavLink>
              <NavLink to="/events" onClick={closeSidebar}>Events</NavLink>
              <NavLink to="/about" onClick={closeSidebar}>About</NavLink>
              <NavLink to="/contact" onClick={closeSidebar}>Contact</NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;