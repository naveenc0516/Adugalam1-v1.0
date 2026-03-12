import React from "react";
import "./GalleryStrip.css";
import { useNavigate } from "react-router-dom";

const Gallery = ({ images = [], turfId }) => {

  const navigate = useNavigate();

  const getImageUrl = (img) => {
    if (!img) return "";
    return img.startsWith("http")
      ? img
      : `http://127.0.0.1:8000${img}`;
  };

  if (!images.length) return null;

  return (
    <div className="gs-wrapper">

      {/* Header */}
      <div className="gs-header">
        <h3 className="gp-section-title4">Gallery</h3>

        <span
          className="gs-view-all"
          onClick={() => navigate(`/galary?turf_id=${turfId}`)}
        >
          View all
        </span>
      </div>

      {/* Images */}
      <div className="gs-row">
        {images.slice(0, 6).map((src, idx) => (
          <div className="gs-item" key={idx}>
            <img
              src={getImageUrl(src)}
              alt={`gallery-${idx}`}
              className="gs-img"
            />
          </div>
        ))}
      </div>

    </div>
  );
};

export default Gallery;