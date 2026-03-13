import React, { useEffect, useState } from "react";
import "./PopularGround.css";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000";

const PopularGround = ({ selectedSport }) => {

  const navigate = useNavigate();

  const [turfs, setTurfs] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const gameIcons = {
    football: "⚽",
    cricket: "🏏",
    badminton: "🏸",
    tennis: "🎾",
  };

  const getImageUrl = (img) => {
    if (!img) return "";

    let clean = img.replace(/^\/+/, "");

    if (clean.startsWith("media/")) {
      clean = clean.replace("media/", "");
    }

    return `${API_BASE}/media/${clean}`;
  };

  useEffect(() => {
    setLoading(true);
    const params = selectedSport ? { params: { game: selectedSport } } : {};
    axios
      .get(`${API_BASE}/api/turfs/popular-turfs/`, params)
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        setTurfs(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

  }, [selectedSport]);

  const displayedTurfs = viewAll ? turfs : turfs.slice(0, 4);

  return (
    <div className="pg-section1">

      <div className="pg-header1">
        <h3>Popular Ground</h3>

        {turfs.length > 4 && (
          <span
            className="view-all1"
            onClick={() => setViewAll(!viewAll)}
          >
            {viewAll ? "Show less" : "View all"}
          </span>
        )}
      </div>

      {loading && <p>Loading grounds...</p>}

      <div className={`pg-container1 ${viewAll ? "grid-view1" : ""}`}>

        {displayedTurfs.map((turf) => (

          <div
            className="pg-card1"
            key={turf.id}
            onClick={() => navigate(`/book?turf_id=${turf.id}`)}
          >

            <div className="pg-img-wrapper">

              <img
                className="pg-img1"
                src={getImageUrl(turf.banner_images?.[0])}
                alt={turf.name}
                onError={(e) => (e.target.src = "/no-image.png")}
              />

            </div>

            <h4>{turf.name}</h4>

            <div className="loc1">
              <FaMapMarkerAlt size={12} /> {turf.location}
            </div>

            <div className="icons1">

              {(turf.games || []).map((game) => {

                const icon = gameIcons[game.toLowerCase()];

                if (!icon) return null;

                return (
                  <span
                    key={game}
                    title={game}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/book?turf_id=${turf.id}&game=${game}`);
                    }}
                  >
                    {icon}
                  </span>
                );
              })}

            </div>

          </div>

        ))}

      </div>

      {!loading && turfs.length === 0 && (
        <p style={{ padding: "20px" }}>No grounds available</p>
      )}

    </div>
  );
};

export default PopularGround;