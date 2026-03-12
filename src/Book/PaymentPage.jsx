import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./payment.css";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ SAFE BOOKING ID
  const bookingId =
    location.state?.booking_id ||
    location.state?.booking?.id;

  /* ================= LOAD BOOKING ================= */
  useEffect(() => {
    const loadBooking = async () => {
      try {
        const token = localStorage.getItem("access");

        const res = await fetch(
          `${API_BASE}/api/booking/${bookingId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setBooking(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    if (bookingId) loadBooking();
  }, [bookingId]);

  /* ================= RAZORPAY PAYMENT ================= */
  const handlePayment = async () => {
    try {
      if (!bookingId) {
        alert("Booking ID missing");
        return;
      }

      const token = localStorage.getItem("access");

      // ✅ GET CORRECT TOTAL
      const totalAmount = parseFloat(
        booking?.total_payable ||
        booking?.total_price ||
        0
      );

      if (totalAmount <= 0) {
        alert("Invalid payment amount");
        return;
      }

      const amountInPaise = Math.round(totalAmount * 100);

      // ✅ CREATE ORDER FROM DJANGO
      const orderRes = await fetch(
        `${API_BASE}/api/payment/create-order/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            booking_id: bookingId,
            amount: amountInPaise,
          }),
        }
      );

      const order = await orderRes.json();

      if (!orderRes.ok) {
        alert(order.error || "Order creation failed");
        return;
      }

      // ✅ RAZORPAY OPTIONS
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Adugalam",
        description: "Ground Booking Payment",
        order_id: order.order_id, // ✅ FIXED

        handler: async function (response) {
          await verifyPayment(response.razorpay_payment_id);
        },

        theme: { color: "#16a34a" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Server error. Try again.");
    }
  };

  /* ================= VERIFY PAYMENT ================= */
  const verifyPayment = async (paymentId) => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch(
        `${API_BASE}/api/payment/verify/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            booking_id: bookingId,
            payment_id: paymentId,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        navigate("/summary", {
          state: { booking_id: bookingId },
        });
      } else {
        alert("Payment verification failed");
      }
    } catch (err) {
      console.error(err);
      alert("Verification failed");
    }
  };

  if (loading) return <h3>Loading payment...</h3>;

  const originalAmount = parseFloat(booking.original_amount) || 0;
  const advanceAmount = parseFloat(booking.advance_amount) || 0;
  const serviceCharge = parseFloat(booking.service_charge) || 0;
  const totalPayable =
    parseFloat(booking.total_payable || booking.total_price) || 0;

  return (
    <div className="payment-page1">
      <Container className="payment-container py-4">

        <div className="payment-header">
          <button
            className="back-btn2"
            onClick={() => navigate(-1)}
          >
            ←
          </button>
          <h3 className="payment-title">Payment</h3>
          <div style={{ width: "40px" }} />
        </div>

        <div className="payment-card">

          <h5 className="turf-name">{booking.turf_name}</h5>
          <p className="booking-date">Date: {booking.date}</p>

          <div className="slot-list">
            {booking.slots?.map((s, i) => (
              <p key={i} className="slot-item">
                🕒 {s.time_display}
              </p>
            ))}
          </div>

          <hr />

          <div className="price-row">
            <span>Original Amount</span>
            <span>₹{originalAmount}</span>
          </div>

          <div className="price-row">
            <span>Advance (30%)</span>
            <span>₹{advanceAmount}</span>
          </div>

          <div className="price-row">
            <span>Service Charge</span>
            <span>₹{serviceCharge}</span>
          </div>

          <div className="price-row grand">
            <span>Total Payable</span>
            <span>₹{totalPayable}</span>
          </div>

          <button className="pay-btn" onClick={handlePayment}>
            Pay Now
          </button>

        </div>
      </Container>
    </div>
  );
};

export default PaymentPage;