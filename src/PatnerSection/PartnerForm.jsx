import "./PartnerForm.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* District list */
const LOCATIONS = [
  "Tirunelveli",
  "Kanniyakumari",
  "Virudhunagar",
  "Tenkasi",
  "Thoothukudi",
];

const AddVendor = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    venuename: "",
    ownername: "",
    email: "",
    phone: "",
    availablegames: [],
    location: "",
    address: "",
    pincode: "",
    totalturf: "",
  });

  const gamesList = ["Cricket", "Football", "Badminton", "Tennis"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* Cricket & Football linked */
  const handleGameChange = (e) => {
    const { value, checked } = e.target;
    let games = [...form.availablegames];

    if (checked) {
      if (!games.includes(value)) games.push(value);

      if (value === "Cricket" && !games.includes("Football"))
        games.push("Football");

      if (value === "Football" && !games.includes("Cricket"))
        games.push("Cricket");
    } else {
      games = games.filter((g) => g !== value);

      if (value === "Cricket")
        games = games.filter((g) => g !== "Football");

      if (value === "Football")
        games = games.filter((g) => g !== "Cricket");
    }

    setForm({ ...form, availablegames: games });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/vendors/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          totalturf: Number(form.totalturf),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + JSON.stringify(data));
        return;
      }

      alert("Vendor Added ID: " + data.vendor_id);

      // Redirect to Vendor Request page
      navigate("/");

    } catch (err) {
      alert("Server not reachable");
    }
  };

  return (
    <div className="vendor-page">
      <div className="vendor-card">
        <h3 className="vendor-title">Create Vendor</h3>

        <form className="vendor-form-grid" onSubmit={handleSubmit}>
          <div className="vendor-field">
            <label>Venue Name</label>
            <input
              name="venuename"
              value={form.venuename}
              onChange={handleChange}
              required
            />
          </div>

          <div className="vendor-field">
            <label>Owner Name</label>
            <input
              name="ownername"
              value={form.ownername}
              onChange={handleChange}
              required
            />
          </div>

          <div className="vendor-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="vendor-field">
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="vendor-field">
            <label>District</label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            >
              <option value="">Select District</option>
              {LOCATIONS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div className="vendor-field">
            <label>Total Turf</label>
            <select
              name="totalturf"
              value={form.totalturf}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="vendor-field full">
            <label>Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="vendor-field">
            <label>Pincode</label>
            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="vendor-field full">
            <label>Available Games</label>
            <div className="games-wrapper">
              {gamesList.map((g) => (
                <label key={g} className="game-chip">
                  <input
                    type="checkbox"
                    value={g}
                    checked={form.availablegames.includes(g)}
                    onChange={handleGameChange}
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <button className="vendor-submit-btn">
            Submit Vendor
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;