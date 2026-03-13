import React, { useState, useEffect } from 'react';
import './Notification.css';
import axios from 'axios';

function Notification() {
  const [otps, setOtps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setLoading(false); // Not logged in
    }
  }, []);

  useEffect(() => {
    if (!user || !user.email) return;

    const fetchOtps = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/recent-otps/?email=${encodeURIComponent(user.email)}`);
        setOtps(response.data);
      } catch (error) {
        console.error("Error fetching recent OTPs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtps();
    // Refresh every 10 seconds while open
    const interval = setInterval(fetchOtps, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="notification-popup">
      <div className="notification-header">
        <h4>Recent Notifications</h4>
      </div>
      <div className="notification-body">
        {loading ? (
          <div className="notification-empty">Loading...</div>
        ) : !user ? (
          <div className="notification-empty">Please log in to view notifications.</div>
        ) : otps.length === 0 ? (
          <div className="notification-empty">No recent notifications.</div>
        ) : (
          otps.map((item) => (
            <div key={item.id} className="notification-item">
              <div className="notification-icon">
                {item.type === 'booking' ? '🏟️' : '🔒'}
              </div>
              <div className="notification-content">
                {item.type === 'booking' ? (
                  item.status === 'FAILED' ? (
                    <div className="notification-text">
                      <p>Your booking has <span style={{color: "red", fontWeight: "bold"}}>Failed</span> (slots already booked).</p>
                      <ul style={{ margin: "5px 0", paddingLeft: "20px", fontSize: "0.9em", color: "#555" }}>
                        <li><strong>Turf:</strong> {item.turf_name}</li>
                        <li><strong>Date:</strong> {item.date}</li>
                        {item.slots && item.slots.length > 0 && <li><strong>Time:</strong> {item.slots.join(', ')}</li>}
                      </ul>
                    </div>
                  ) : (
                    <div className="notification-text">
                      <p>Your booking is <span style={{color: "green", fontWeight: "bold"}}>Confirmed</span>!</p>
                      <ul style={{ margin: "5px 0", paddingLeft: "20px", fontSize: "0.9em", color: "#555" }}>
                        <li><strong>Turf:</strong> {item.turf_name}</li>
                        <li><strong>Date:</strong> {item.date}</li>
                        {item.slots && item.slots.length > 0 && <li><strong>Time:</strong> {item.slots.join(', ')}</li>}
                      </ul>
                    </div>
                  )
                ) : (
                  <p className="notification-text">An OTP <span className="highlight-otp">{item.otp}</span> has been sent to <strong>{item.email}</strong></p>
                )}
                <span className="notification-time">{formatTimeAgo(item.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notification;