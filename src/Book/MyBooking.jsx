import React, { useEffect, useState } from "react";
import "./MyBooking.css";
import {
  FaHome,
  FaCalendarAlt,
  FaShoppingCart,
  FaBookmark,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/";

const MyBooking = () => {

  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("access");

        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const res = await fetch(
        
          `${API_BASE}api/booking/my-bookings/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log("Booking API response:", data);

        if (!res.ok) {
          setError(data.error || "Failed to fetch bookings");
        } else {
          setBookings(data);
        }

      } catch (err) {
        console.error("Booking fetch error:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

  }, []);

  if (loading) {
    return <h3 style={{ textAlign: "center" }}>Loading bookings...</h3>;
  }

  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h3>{error}</h3>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );

  return (
    <div className="booking-page">

      <h2 className="page-title">My Booking</h2>

      {bookings.length === 0 ? (
        <p style={{ textAlign: "center" }}>No bookings found</p>
      ) : (
        <div className="booking-list">
          {bookings.map((item) => (
            <div className="booking-card" key={item.booking_id}>

              <div className="booking-info">

                <span className="booking-id">
                  Booking ID: #{item.booking_id}
                </span>

                <h3>{item.turf_name}</h3>

                <p className="booking-date">{item.date}</p>

                <p className="booking-time">
                  {item.slots.join(", ")}
                </p>

                <span
                  className="booking-status"
                  style={{
                    color:
                      item.payment_status === "SUCCESS"
                        ? "green"
                        : item.payment_status === "FAILED"
                        ? "red"
                        : "orange",
                    fontWeight: "600"
                  }}
                >
                  {item.payment_status}
                </span>

              </div>

              <div className="booking-price">
                ₹{item.total_price}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="nav-item" onClick={() => navigate("/")}>
          <FaHome />
          <span>Home</span>
        </div>

        <div className="nav-item" onClick={() => navigate("/events")}>
          <FaCalendarAlt />
          <span>Events</span>
        </div>

        <div className="nav-item" onClick={() => navigate("/cart")}>
          <FaShoppingCart />
          <span>Cart</span>
        </div>

        <div className="nav-item active">
          <FaBookmark />
          <span>My Booking</span>
        </div>

        <div className="nav-item" onClick={() => navigate("/profile")}>
          <FaUser />
          <span>Profile</span>
        </div>
      </div>

    </div>
  );
};

export default MyBooking;