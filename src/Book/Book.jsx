import React, { useEffect, useState } from "react";
import "./Book.css";
import GroundFacilities from "./Facilities";
import Gallery from "./Gallery";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

const GroundDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const turfId = searchParams.get("turf_id");
  const game = searchParams.get("game");

  const [turf, setTurf] = useState(null);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH TURF LIST
  useEffect(() => {
    if (!turfId) return;

    setLoading(true);

    axios
      .get(`${API_BASE}/api/turfs/`)
      .then((res) => {

        // ✅ SUPPORT BOTH ARRAY + PAGINATION RESPONSE
        const turfs = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];

        const selectedTurf = turfs.find(
          (t) => String(t.id) === String(turfId)
        );

        setTurf(selectedTurf || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Turf fetch error:", err);
        setLoading(false);
      });
  }, [turfId]);

  // ✅ SAFE IMAGE URL
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${API_BASE}${img}`;
  };

  // ✅ LOADING
  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  if (!turf)
    return <p style={{ padding: 20 }}>Ground not found</p>;

  return (
    <div className="ground-pagee">

      {/* HEADER */}
      <div className="gp-headerr">
        <button
          className="back-btnn"
          onClick={() => navigate(-1)}
        >
          &lt;
        </button>
      </div>

      {/* IMAGE */}
      <div className="gp-image-wrapperr">
        <img
          src={getImageUrl(turf.banner_images?.[0])}
          alt={turf.name}
          className="gp-imagee"
        />

        <div className="gp-image-overlayy">
          <span className="gp-image-counterr">
            1/{turf.banner_images?.length || 1}
          </span>

          <span className="gp-pricee">
            ₹{turf.price_per_hour || 0}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="gp-contentt">

        <span className="gp-tagg">
          {game || "Ground"}
        </span>

        <div
          className="gp-location-ratingg"
          style={{ marginTop: 30 }}
        >
          <span className="gp-location-dott">
            <FaLocationDot size={18} />
          </span>

          <span className="gp-location-textt">
            {turf.location}
          </span>
        </div>

        <h2 className="gp-titlee">{turf.name}</h2>

        <div className="gp-sectionn">
          <h3 className="gp-section-titlee">Description</h3>
          <p className="gp-descriptionn">
            {turf.description ||
              "Best ground available for sports booking."}
          </p>
        </div>
      </div>
      <GroundFacilities turf={turf} />
      <Gallery images={turf.gallery_images || turf.banner_images || []} turfId={turf.id} />

      <br />
      <br />

      {/* POLICY */}
      <label className="policy-item">
        <input
          type="checkbox"
          checked={agreePolicy}
          onChange={(e) =>
            setAgreePolicy(e.target.checked)
          }
        />
        <span>
          I agree to the{" "}
          <span
            className="policy-link"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/clubpolicy");
            }}
          >
            Turf Policy
          </span>
        </span>
      </label>

      {/* FOOTER */}
      <div className="gp-footerrr">
        <button
          className="gp-buy-btnnm"
          disabled={!agreePolicy}
          style={{ width: "100%" }}
          onClick={() =>
            navigate(`/BookingGround?turf_id=${turf.id}`)
          }
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default GroundDetails;