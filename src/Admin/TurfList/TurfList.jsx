import { useEffect, useState } from "react";
import "./TurfList.css";

const API_URL = "http://localhost:8000/api/admin/turfs/";

export default function TurfList() {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===============================
  // 🎮 GAME ICON MAPPING
  // ===============================
  const gameIcons = {
    football: "⚽",
    cricket: "🏏",
    badminton: "🏸",
    volleyball: "🏐",
    basketball: "🏀",
    tennis: "🎾",
  };

  const getGameIcon = (game) => {
    if (!game) return "🎮";
    const key = game.toLowerCase();
    return gameIcons[key] || "🎮";
  };

  // ===============================
  // Image URL helper
  // ===============================
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `http://localhost:8000${img}`;
  };

  // ===============================
  // Fetch Turf List
  // ===============================
  const fetchTurfs = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("access");

      const res = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setTurfs(Array.isArray(data.results) ? data.results : data);
    } catch (err) {
      console.error(err);
      setError("Failed to load turfs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  // ===============================
  // Update Priority
  // ===============================
  const updatePriority = async (id, is_popular, priority) => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch(
        `http://localhost:8000/api/admin/turfs/${id}/priority/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            is_popular: Boolean(is_popular),
            priority: Number(priority) || 0,
          }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      await fetchTurfs();
      alert("✅ Popular status updated!");
    } catch (err) {
      alert("❌ Error updating");
    }
  };

  const updateLocalTurf = (index, field, value) => {
    const updated = [...turfs];
    updated[index][field] = value;
    setTurfs(updated);
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="page">
      <h2>Turf List</h2>

      {loading && <p>Loading turfs...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table className="turf-table">
          <thead>
            <tr>
              <th>Banner</th>
              <th>Gallery</th>
              <th>Name</th>
              <th>Location</th>
              <th>Price</th>
              <th>Available Games</th>
              <th>Slots</th>
              <th>Popular</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {turfs.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No Turfs Available
                </td>
              </tr>
            ) : (
              turfs.map((turf, index) => (
                <tr key={turf.id}>
                  {/* Banner */}
                  <td>
                    <div className="img-row">
                      {turf.banner_images?.length > 0
                        ? turf.banner_images.map((img, i) => (
                            <img
                              key={i}
                              src={getImageUrl(img)}
                              className="banner-thumb"
                              alt=""
                            />
                          ))
                        : "No Image"}
                    </div>
                  </td>

                  {/* Gallery */}
                  <td>
                    <div className="img-row">
                      {turf.gallery_images?.length > 0
                        ? turf.gallery_images.map((img, i) => (
                            <img
                              key={i}
                              src={getImageUrl(img)}
                              className="gallery-thumb"
                              alt=""
                            />
                          ))
                        : "No Image"}
                    </div>
                  </td>

                  <td>{turf.name || "-"}</td>
                  <td>{turf.location || "-"}</td>

                  <td>₹{turf.price_per_hour ?? 0}</td>

                  {/* 🎮 AVAILABLE GAMES WITH ICONS */}
                  <td>
                    {Array.isArray(turf.games) &&
                    turf.games.length > 0 ? (
                      turf.games.map((game, i) => (
                        <span key={i} className="game-badge">
                          {getGameIcon(game)} {game}
                        </span>
                      ))
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Slots */}
                  <td>
                    <div className="slots-box">
                      {Array.isArray(turf.slots) &&
                      turf.slots.length > 0
                        ? turf.slots.map((slot, i) => (
                            <div key={i} className="slot-card">
                              <span>
                                {slot.time_display ||
                                  `${slot.start_time} - ${slot.end_time}`}
                              </span>
                              <span>₹{slot.price}</span>
                            </div>
                          ))
                        : "No Slots"}
                    </div>
                  </td>

                  {/* Popular */}
                  <td>
                    <input
                      type="checkbox"
                      checked={turf.is_popular || false}
                      onChange={(e) =>
                        updateLocalTurf(
                          index,
                          "is_popular",
                          e.target.checked
                        )
                      }
                    />
                  </td>

                  {/* Priority */}
                  <td>
                    <input
                      type="number"
                      value={turf.priority || 0}
                      onChange={(e) =>
                        updateLocalTurf(
                          index,
                          "priority",
                          Number(e.target.value)
                        )
                      }
                      style={{ width: 60 }}
                    />
                  </td>

                  {/* Save */}
                  <td>
                    <button
                      onClick={() =>
                        updatePriority(
                          turf.id,
                          turf.is_popular,
                          turf.priority
                        )
                      }
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}