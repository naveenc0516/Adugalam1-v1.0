import { useEffect, useState } from "react";
import "./TurfList.css";

const API_URL = "http://localhost:8000/api/admin/turfs/";

export default function TurfList() {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image URL helper
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `http://localhost:8000${img}`;
  };

  // Fetch Turf List
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("access") ||
          localStorage.getItem("access");

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(API_URL, { headers });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();

        setTurfs(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load turfs.");
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  // Update priority API
  const updatePriority = async (id, is_popular, priority) => {
    try {
      const token =
        localStorage.getItem("access") ||
        localStorage.getItem("access");

      const res = await fetch(
        `http://localhost:8000/api/admin/turfs/${id}/priority/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            is_popular,
            priority,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update priority");
      }

      alert("Priority updated successfully");
    } catch (err) {
      console.error(err);
      alert("Error updating priority");
    }
  };

  // Handle state change
  const updateLocalTurf = (index, field, value) => {
    const updated = [...turfs];
    updated[index][field] = value;
    setTurfs(updated);
  };

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
              <th>Slots</th>
              <th>Popular</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {turfs.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No Turfs Available
                </td>
              </tr>
            ) : (
              turfs.map((turf, index) => (
                <tr key={turf.id}>
                  {/* Banner */}
                  <td>
                    <div className="img-row">
                      {turf.banner_images?.length > 0 ? (
                        turf.banner_images.map((img, i) => (
                          <img
                            key={i}
                            src={getImageUrl(img)}
                            className="banner-thumb"
                            alt="banner"
                          />
                        ))
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>
                  </td>

                  {/* Gallery */}
                  <td>
                    <div className="img-row">
                      {turf.gallery_images?.length > 0 ? (
                        turf.gallery_images.map((img, i) => (
                          <img
                            key={i}
                            src={getImageUrl(img)}
                            className="gallery-thumb"
                            alt="gallery"
                          />
                        ))
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>
                  </td>

                  <td>{turf.name || "-"}</td>
                  <td>{turf.location || "-"}</td>

                  <td className="price">
                    ₹{turf.price_per_hour ?? 0}
                  </td>

                  {/* Slots */}
                  <td>
                    <div className="slots-box">
                      {Array.isArray(turf.slots) &&
                      turf.slots.length > 0 ? (
                        turf.slots.map((slot, i) => (
                          <div key={i} className="slot-card">
                            <span className="slot-time">
                              {slot.time_display ||
                                `${slot.start_time} - ${slot.end_time}`}
                            </span>
                            <span className="slot-price">
                              ₹{slot.price}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="no-slot">
                          No Slots Available
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Popular Toggle */}
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
                      style={{ width: "60px" }}
                      onChange={(e) =>
                        updateLocalTurf(
                          index,
                          "priority",
                          Number(e.target.value)
                        )
                      }
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