import "./AddVendor.css";
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

  const [errors, setErrors] = useState({});

  const gamesList = ["Cricket", "Football", "Badminton", "Tennis"];

  /* Strict Validation Regex */
  const nameRegex = /^[A-Za-z\s]+$/;
  const gmailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/; // ONLY Gmail
  const phoneRegex = /^[6-9]\d{9}$/;
  const pincodeRegex = /^6\d{5}$/;

  const invalidPhones = [
    "1234567890",
    "0123456789",
    "1111111111",
    "2222222222",
    "3333333333",
    "4444444444",
    "5555555555",
    "6666666666",
    "7777777777",
    "8888888888",
    "9999999999",
  ];

  /* Real-time Validation */
  const validateField = (name, value) => {
    let err = "";

    if (!value || value.toString().trim() === "") {
      err = "Required";
    } else {
      switch (name) {
        case "venuename":
        case "ownername":
          if (!nameRegex.test(value))
            err = "Only letters allowed";
          break;

        case "email":
          if (!gmailRegex.test(value))
            err = "Email must be valid @gmail.com";
          break;

        case "phone":
          if (!/^\d*$/.test(value)) return "Digits only";

          if (value.length === 10) {
            if (!phoneRegex.test(value))
              err = "Invalid Indian phone";
            else if (invalidPhones.includes(value))
              err = "Invalid phone number";
          }
          break;

        case "pincode":
          if (!/^\d*$/.test(value)) return "Digits only";

          if (value.length === 6 && !pincodeRegex.test(value))
            err = "Invalid TN pincode";
          break;

        default:
          break;
      }
    }

    return err;
  };

  /* Handle Input Change */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "pincode") {
      if (!/^\d*$/.test(value)) return;
      if (name === "phone" && value.length > 10) return;
      if (name === "pincode" && value.length > 6) return;
    }

    const err = validateField(name, value);

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: err });
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

    setErrors({
      ...errors,
      availablegames:
        games.length === 0 ? "Select at least one game" : "",
    });
  };

  /* Submit Validation */
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    Object.keys(form).forEach((key) => {
      if (key === "availablegames") {
        if (form.availablegames.length === 0)
          newErrors[key] = "Required";
      } else {
        const err = validateField(key, form[key]);
        if (err) newErrors[key] = err;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8000/api/vendors/create/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            totalturf: Number(form.totalturf),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + JSON.stringify(data));
        return;
      }

      alert("Vendor Added ID: " + data.vendor_id);
      navigate("/vendorRequest");
    } catch {
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
              className={errors.venuename ? "error-input" : ""}
            />
          </div>

          <div className="vendor-field">
            <label>Owner Name</label>
            <input
              name="ownername"
              value={form.ownername}
              onChange={handleChange}
              className={errors.ownername ? "error-input" : ""}
            />
          </div>

          <div className="vendor-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "error-input" : ""}
            />
          </div>

          <div className="vendor-field">
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={errors.phone ? "error-input" : ""}
            />
          </div>

          <div className="vendor-field">
            <label>District</label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className={errors.location ? "error-input" : ""}
            >
              <option value="">Select District</option>
              {LOCATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
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
              className={errors.totalturf ? "error-input" : ""}
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
              className={errors.address ? "error-input" : ""}
            />
          </div>

          <div className="vendor-field">
            <label>Pincode</label>
            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              className={errors.pincode ? "error-input" : ""}
            />
          </div>

          <div className="vendor-field full">
            <label>Available Games</label>
            <div
              className={`games-wrapper ${
                errors.availablegames ? "error-input" : ""
              }`}
            >
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