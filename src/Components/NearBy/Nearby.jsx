
import { useState, useEffect } from "react";
import "./Nearby.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/api/turfs/";

const Nearby = () => {
  const navigate = useNavigate();

  const [viewAll, setViewAll] = useState(false);
  const [nearbyGrounds, setNearbyGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userLocation, setUserLocation] = useState(null);

  // ✅ Get User Location (GPS or Selected City)
  // Priority: 1. Selected City  2. GPS Location
  useEffect(() => {
    const getLocation = () => {
      // ✅ First check if there's a selected city in localStorage (Priority)
      const cityLat = localStorage.getItem("latitude");
      const cityLng = localStorage.getItem("longitude");
      
      console.log("Nearby: Checking location - City Lat:", cityLat, "City Lng:", cityLng);
      
      // ✅ If selected city exists, use it (PRIMARY)
      if (cityLat && cityLng) {
        console.log("Nearby: Using SELECTED CITY coordinates", cityLat, cityLng);
        setUserLocation({
          lat: parseFloat(cityLat),
          lng: parseFloat(cityLng),
        });
        return;
      }
      
      // ✅ No selected city - try GPS
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // ✅ GPS available - use GPS location
            console.log("Nearby: Using GPS location", position.coords.latitude, position.coords.longitude);
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (geoError) => {
            console.log("Nearby: GPS error or denied, no location available");
          }
        );
      }
    };

    getLocation();

    // ✅ Listen for location changes from Location page
    const handleLocationChange = () => {
      const cityLat = localStorage.getItem("latitude");
      const cityLng = localStorage.getItem("longitude");
      
      console.log("Nearby: locationChange event fired - City Lat:", cityLat, "City Lng:", cityLng);
      
      if (cityLat && cityLng) {
        setUserLocation({
          lat: parseFloat(cityLat),
          lng: parseFloat(cityLng),
        });
        console.log("Nearby: Location updated from city selection:", cityLat, cityLng);
      }
    };

    window.addEventListener("locationChange", handleLocationChange);
    
    return () => {
      window.removeEventListener("locationChange", handleLocationChange);
    };
  }, []);

  // ✅ Distance Calculation (Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ✅ Image Helper
  const getImageUrl = (img) => {
    if (!img) return "/placeholder.jpg";
    if (img.startsWith("http")) return img;
    return `http://localhost:8000${img}`;
  };

  // ✅ Fetch Turfs when location ready
  useEffect(() => {
    if (!userLocation) return;

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

        const turfs = Array.isArray(data.results)
          ? data.results
          : Array.isArray(data)
          ? data
          : [];

        let mappedTurfs = turfs.map((turf) => {
          let distance = "Nearby";
          let distanceValue = 9999;

          if (turf.latitude && turf.longitude) {
            distanceValue = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              turf.latitude,
              turf.longitude
            );

            distance = `${distanceValue.toFixed(1)} km`;
          }

          return {
            id: turf.id,
            title: turf.name || "Unknown Turf",
            location: turf.location || "Location not available",
            distance,
            distanceValue,
            image:
              turf.banner_images?.[0] ||
              turf.gallery_images?.[0] ||
              "/placeholder.jpg",
            price: turf.price_per_hour || 0,
          };
        });

        // ✅ Sort nearest first
        mappedTurfs.sort(
          (a, b) => a.distanceValue - b.distanceValue
        );

        setNearbyGrounds(mappedTurfs);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load turfs.");
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, [userLocation]);

  return (
    <div className="nb-section1">
      <div className="nb-header1">
        <h3>Nearby you</h3>
        <span
          className="view-all1"
          onClick={() => setViewAll(!viewAll)}
        >
          {viewAll ? "Show less" : "View all"}
        </span>
      </div>

      {loading && (
        <p style={{ textAlign: "center", padding: "20px" }}>
          Loading turfs...
        </p>
      )}

      {error && (
        <p
          style={{
            textAlign: "center",
            padding: "20px",
            color: "red",
          }}
        >
          {error}
        </p>
      )}

      {!loading && !error && (
        <div
          className={`nb-container1 ${
            viewAll ? "grid-view1" : ""
          }`}
        >
          {nearbyGrounds.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px" }}>
              No turfs available
            </p>
          ) : (
            nearbyGrounds.map((gr) => (
              <div
                className="nb-card1"
                key={gr.id}
                onClick={() => {
                  const token = localStorage.getItem("access");
                  if (token) {
                    navigate(`/book?turf_id=${gr.id}`);
                  } else {
                    navigate("/login");
                  }
                }}
              >
                <div className="img-wrapper1">
                  <img
                    src={getImageUrl(gr.image)}
                    className="nb-img1"
                    alt={gr.title}
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                  <span className="distance1">
                    {gr.distance}
                  </span>
                </div>

                <h4>{gr.title}</h4>

                <div className="loc1">
                  <FaMapMarkerAlt size={12} />{" "}
                  {gr.location}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Nearby;