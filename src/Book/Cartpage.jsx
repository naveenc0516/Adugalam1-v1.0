import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Cart.css";
import {
  FaHome,
  FaCalendarAlt,
  FaShoppingCart,
  FaBookmark,
  FaUser
} from "react-icons/fa";

const API_BASE = "http://127.0.0.1:8000";

const Cartpage = () => {

  const { state } = useLocation();
  const navigate = useNavigate();

  const booking = state?.booking;

  // ================= REFRESH PROTECTION =================
  if (!booking) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>No booking found</h3>
        <button onClick={() => navigate("/book")}>
          Go Back
        </button>
      </div>
    );
  }

  // ================= SLOT DISPLAY =================
  const slotTimes = booking.slots
    ?.map(slot => slot.time_display)
    .join(", ");

  // ===================================================
  // ✅ CHECKOUT → SAVE BOOKING IN DATABASE
  // ===================================================
  const handleCheckout = async () => {

    try {

      const token = localStorage.getItem("access");

      if (!token) {
        alert("Login required");
        navigate("/login");
        return;
      }

      // ⭐ SAFETY CHECK
      if (!booking.turf_id || !booking.slot_ids?.length || !booking.date) {
        alert("Booking data missing");
        return;
      }
      const payload = {
        turf_id: booking.turf_id,
        game_id: booking.game_id || 1, // ✅ fallback safety
        date: booking.date,
        slot_ids: booking.slot_ids,
      };

      console.log("📤 Sending booking:", payload);

      const response = await fetch(
        `${API_BASE}/api/booking/confirm/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      // ================= ERROR HANDLE =================
      if (!response.ok) {
        console.error("❌ Booking Error:", data);
        alert(data.error || "Booking failed");
        return;
      }

      console.log("✅ Booking saved:", data);

      // ================= NAVIGATE AFTER SAVE =================
      navigate("/payment", {
        state: {
          booking,
          booking_id: data.booking_id,
        },
      });

    } catch (err) {
      console.error("SERVER ERROR:", err);
      alert("Server error");
    }
  };

  // ===================================================

  return (
    <div className="summary-wrapper">

      {/* ===== CART CARD ===== */}
      <div className="cart-card">
        <img src={booking.image} alt="ground" />

        <div className="cart-info">
          <h3>{booking.turf_name}</h3>
          <p>Date: {booking.date}</p>
          <p>Time: {slotTimes}</p>
          <h4>₹{booking.total_price}</h4>
        </div>
      </div>

      {/* ===== GRAND TOTAL ===== */}
      <div className="grandcheck">
        <div className="grand-left">
          <p className="grand-label">Grand total</p>
          <h2 className="grand-amount">
            ₹{booking.total_price}
          </h2>
        </div>

        <button
          className="checkout-btn-fixed"
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>

      {/* ===== BOTTOM NAV ===== */}
      <div className="bottom-nav">

        <div className="nav-item" onClick={() => navigate("/")}>
          <FaHome />
          <span>Home</span>
        </div>

        <div className="nav-item" onClick={() => navigate("/events")}>
          <FaCalendarAlt />
          <span>Events</span>
        </div>

        <div className="nav-item active">
          <FaShoppingCart />
          <span>Cart</span>
        </div>

        <div className="nav-item" onClick={() => navigate("/mybooking")}>
          <FaBookmark />
          <span>My booking</span>
        </div>

        <div className="nav-item" onClick={() => navigate("/profile")}>
          <FaUser />
          <span>Profile</span>
        </div>

      </div>

    </div>
  );
};

export default Cartpage;