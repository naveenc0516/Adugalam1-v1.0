import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import "./BookingGround.css";

const API_BASE = "http://127.0.0.1:8000";
const MAX_SLOTS = 3;

const BookingGround = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const turfId =
    location.state?.turf_id ||
    searchParams.get("turf_id");

  // ================= STATES =================
  const [grounds, setGrounds] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const [selectedGround, setSelectedGround] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= NEXT 7 DAYS =================
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      days.push({
        label: d.toLocaleDateString("en-IN", { weekday: "short" }),
        day: d.getDate(),
        full: d.toISOString().split("T")[0],
      });
    }
    return days;
  };

  const scheduleDays = getNext7Days();

  // ================= LOAD TURFS =================
  useEffect(() => {
    turfId ? fetchSingleTurf(turfId) : fetchTurfs();
  }, [turfId]);

  const fetchTurfs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/turfs/`);
      const data = await res.json();
      const turfs = Array.isArray(data) ? data : data.results || [];
      setGrounds(turfs.filter(t => t.is_approved));
    } catch {
      setErrorMsg("Failed to load grounds");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleTurf = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/turfs/${id}/`);
      const ground = await res.json();
      setGrounds([ground]);
      setSelectedGround(ground);
    } catch {
      setErrorMsg("Failed to load turf");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH SLOTS (24HRS SUPPORT) =================
  const fetchSlots = async (turf_id, date = null) => {
    let url = `${API_BASE}/api/turf-slots/?turf_id=${turf_id}`;
    if (date) url += `&date=${date}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!Array.isArray(data)) {
        setTimeSlots([]);
        return;
      }

      // 🔥 Sort by start_time (ensures 24hrs order)
      const sorted = data.sort((a, b) =>
        a.start_time.localeCompare(b.start_time)
      );

      const formattedSlots = sorted.map(slot => ({
        ...slot,
        is_booked: slot.is_available === false,
      }));

      setTimeSlots(formattedSlots);

    } catch {
      setErrorMsg("Failed to load slots");
    }
  };

  useEffect(() => {
    if (selectedGround && selectedDate) {
      fetchSlots(selectedGround.id, selectedDate);
    }
  }, [selectedDate, selectedGround]);

  // ================= IMAGE =================
  const getImage = (ground) => {
    const img =
      ground.banner_images?.[0] ||
      ground.gallery_images?.[0] ||
      ground.image;

    if (!img) return "https://via.placeholder.com/300";

    return img.startsWith("http")
      ? img
      : `${API_BASE}${img}`;
  };

  // ================= SELECT GROUND =================
  const handleGroundSelect = (ground) => {
    setSelectedGround(ground);
    setSelectedTimes([]);
    setSelectedDate(null);
    setTimeSlots([]);
  };

  // ================= SLOT SELECT =================
  const toggleSlot = (slot) => {
    if (slot.is_booked) return;

    const exists = selectedTimes.find(s => s.id === slot.id);

    if (exists) {
      setSelectedTimes(prev =>
        prev.filter(s => s.id !== slot.id)
      );
      return;
    }

    if (selectedTimes.length >= MAX_SLOTS) {
      setErrorMsg("Maximum 3 slots reached");
      return;
    }

    setErrorMsg("");
    setSelectedTimes(prev => [...prev, slot]);
  };

  // ================= BOOKING OBJECT =================
  const getBookingObject = () => {
    if (!selectedDate || !selectedGround || selectedTimes.length === 0) {
      setErrorMsg("Select Date and Slot");
      return null;
    }

    return {
      turf_id: selectedGround.id,
      turf_name: selectedGround.name,
      image: getImage(selectedGround),
      slot_ids: selectedTimes.map(s => s.id),
      date: selectedDate,
      slots: selectedTimes,
      total_price: selectedTimes.reduce(
        (sum, s) => sum + s.price,
        0
      ),
    };
  };

  const handleContinue = () => {
    const booking = getBookingObject();
    if (booking) navigate("/cart", { state: { booking } });
  };

  if (loading) return <div>Loading...</div>;

  // ================= UI =================
  return (
    <div className="booking-wrapper">

      <div className="header">
        <button className="back-btn2" onClick={() => navigate("/book")}>←</button>
        <h2>Booking a ground</h2>
      </div>

      <h4>Select schedule date</h4>

      <div className="calendar-strip">
        {scheduleDays.map(d => (
          <div
            key={d.full}
            className={`calendar-card ${selectedDate === d.full ? "active" : ""}`}
            onClick={() => setSelectedDate(d.full)}
          >
            <div className="date-number">{d.day}</div>
            <div className="date-day">{d.label}</div>
          </div>
        ))}
      </div>

      <h4>Select your ground</h4>

      <div className="grounds-container">
        {grounds.map(ground => (
          <div
            key={ground.id}
            className={`ground-card ${selectedGround?.id === ground.id ? "active" : ""}`}
            onClick={() => handleGroundSelect(ground)}
          >
            <img src={getImage(ground)} alt="" />
            <div className="ground-info">
              <h5>{ground.name}</h5>
              <p>₹{ground.price_per_hour}/hr</p>
            </div>
          </div>
        ))}
      </div>

      <h4>Select available time (Max 3)</h4>

      <div className="slot-grid">
        {timeSlots.map(slot => {
          const selected =
            selectedTimes.find(s => s.id === slot.id);

          return (
            <div
              key={slot.id}
              className={`slot-box
                ${slot.is_booked ? "booked" : "available"}
                ${selected ? "selected" : ""}
              `}
              onClick={() => toggleSlot(slot)}
            >
              <div>{slot.time_display}</div>

              {slot.is_booked && (
                <small className="status-text">Booked</small>
              )}

              <small>₹{slot.price}</small>
            </div>
          );
        })}
      </div>

      <p>Selected Slots: {selectedTimes.length}/3</p>

      {errorMsg && <p className="error-msg">{errorMsg}</p>}

      <button
        className="continue-btn"
        onClick={handleContinue}
        disabled={!selectedDate || selectedTimes.length === 0}
      >
        Continue to Cart
      </button>

    </div>
  );
};

export default BookingGround;