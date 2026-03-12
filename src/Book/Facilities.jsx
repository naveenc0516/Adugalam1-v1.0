import React from "react";
import "./Facilities.css";

const cleanArray = (data) => {
  if (!data) return [];

  let value = data;

  // If stringified JSON, parse repeatedly
  while (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      break;
    }
  }

  // If already array
  if (Array.isArray(value)) {
    return value
      .flatMap(item =>
        String(item)
          .replace(/["\[\]]/g, "")
          .split(",") // ✅ split comma values
          .map(v => v.trim())
      )
      .filter(Boolean);
  }

  // If single string
  return String(value)
    .replace(/["\[\]]/g, "")
    .split(",") // ✅ split comma values
    .map(v => v.trim())
    .filter(Boolean);
};

const GroundFacilities = ({ turf }) => {
  if (!turf) return null;

  const facilities = cleanArray(turf.amenities);
  const features = cleanArray(turf.features);

  const getImageUrl = (img) => {
    if (!img) return "";
    return img.startsWith("http")
      ? img
      : `http://127.0.0.1:8000${img}`;
  };

  return (
    <div className="gf-wrapper">

      {/* Ground list */}
      <div className="gf-section">
        <h3 className="gp-section-title1">Ground List</h3>

        <div className="gf-card-row">
          <div className="gf-ground-card">
            <img
              src={getImageUrl(turf.banner_images?.[0])}
              alt={turf.name}
              className="gf-ground-img"
            />
            <div className="gf-ground-text">
              <span className="gf-ground-name">{turf.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities */}
      {facilities.length > 0 && (
        <div className="gf-section">
          <h3 className="gp-section-title2">Facilities</h3>

          <div className="gf-chip-row">
            {facilities.map((f, index) => (
              <div className="gf-chip" key={index}>
                <span className="gf-chip-label">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <div className="gf-section">
          <h3 className="gp-section-title3">Our Popular Features</h3>

          <div className="gf-chip-row">
            {features.map((f, index) => (
              <div className="gf-chip" key={index}>
                <span className="gf-chip-label">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default GroundFacilities;