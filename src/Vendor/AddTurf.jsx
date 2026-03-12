import { useState, useRef, useCallback } from "react";
import "./addTurf.css";
import {
  GoogleMap,
  StandaloneSearchBox,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const games = ["Cricket/Football", "Badminton", "Tennis"];
const amenities = ["Camera", "Parking", "Water", "Toilet"];
const features = ["Indoor", "Outdoor", "Grass Turf"];

// Helper function to clean address - remove plus codes like "PQ7C+M7G"
const cleanAddress = (address) => {
  if (!address) return "";
  // Remove plus code pattern (e.g., "PQ7C+M7G," or "PQ7C+M7G ")
  let cleaned = address.replace(/^[A-Z0-9]{4}\+[A-Z0-9]{2},?\s*/gi, "");
  // Clean up any leading commas or spaces
  cleaned = cleaned.replace(/^[,]\s*/, "").trim();
  return cleaned;
};

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from(
  { length: 60 },
  (_, i) => i.toString().padStart(2, "0")
);
const meridians = ["AM", "PM"];

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
  marginTop: "10px",
};

const defaultCenter = { lat: 11.1271, lng: 78.6569 };

export default function AddTurf() {
  const navigate = useNavigate();
  
  // Validation error states
  const [errors, setErrors] = useState({});
  
  const [form, setForm] = useState({
    vendorId: "",
    vendorName: "",
    price: "",
    location: "",
    latitude: "",
    longitude: "",
    games: [],
    amenities: [],
    features: [],
    description: "",
    gallery: [],
    banner: [],
    slotMode: "all",
    slots: { 
      all: { 
        from: { hour: "", minute: "", meridian: "" }, 
        to: { hour: "", minute: "", meridian: "" } 
      } 
    },
    generatedSlots: [],
  });

  const [center, setCenter] = useState(defaultCenter);
  const [showMap, setShowMap] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);

  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || "AIzaSyARdifF99viSjpNlPjJMLHwo8Z8QtEiDP4",
    libraries: ["places"],
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const fetchVendor = async (vendorId) => {
    if (!vendorId) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/vendors/code/${vendorId}/`
      );

      const data = await res.json();

      setForm((p) => ({
        ...p,
        vendorName: data.venuename || "",
      }));
    } catch {
      setForm((p) => ({ ...p, vendorName: "" }));
    }
  };

  const handleRadio = (key, val) =>
    setForm((p) => ({ ...p, [key]: [val] }));

  const validateImageSize = (file, type) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (type === "gallery") {
          resolve(img.width === 1200 && img.height === 799);
        } else {
          resolve(img.width === 1623 && img.height === 1080);
        }
      };
      img.src = URL.createObjectURL(file);
    });

  const processFiles = async (files, name) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    const validFiles = [];

    for (const file of Array.from(files)) {
      if (!allowed.includes(file.type)) {
        alert("Only JPG, JPEG, PNG images allowed");
        continue;
      }

      const sizeOk = await validateImageSize(file, name);
      if (!sizeOk) {
        alert(
          name === "gallery"
            ? "Gallery must be 1200x675 resolution (16:9)"
            : "Banner must be 1920x1080 resolution (16:9)"
        );
        continue;
      }

      validFiles.push(file);
    }

    setForm((p) => ({
      ...p,
      [name]: [...p[name], ...validFiles],
    }));
  };

  const handleFile = (e) => {
    processFiles(e.target.files, e.target.name);
    e.target.value = "";
  };

  const removeImage = (type, index) => {
    setForm((p) => ({
      ...p,
      [type]: p[type].filter((_, i) => i !== index),
    }));
  };

  const toMinutes = (time) => {
    if (!time || !time.hour || !time.minute || !time.meridian) return null;
    let { hour, minute, meridian } = time;

    // Handle empty or invalid values
    if (hour === "Hour" || minute === "Min") return null;

    hour = Number(hour);
    minute = Number(minute);

    if (isNaN(hour) || isNaN(minute)) return null;

    // Handle 12 AM and 12 PM correctly
    // 12 AM (midnight) should be 0
    // 12 PM (noon) should be 12
    if (meridian === "AM") {
      if (hour === 12) {
        hour = 0;
      }
    } else if (meridian === "PM") {
      if (hour !== 12) {
        hour += 12;
      }
    }

    return hour * 60 + minute;
  };

  const formatTime = (mins) => {
    // Handle negative minutes (for midnight crossing)
    if (mins < 0) mins += 24 * 60;
    
    let hour = Math.floor(mins / 60);
    let minute = mins % 60;

    // Handle 24-hour wrap
    if (hour >= 24) hour = hour % 24;
    if (hour < 0) hour = 0;

    const meridian = hour >= 12 ? "PM" : "AM";
    
    // Convert 0 to 12 for display
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minute === 0 ? "00" : minute} ${meridian}`;
  };

  const generateSlots = () => {
    const s = form.slots?.all;

    if (!form.price) return alert("Enter price per hour");
    
    // Validate time selection - check if all required fields exist and are valid
    const fromTime = s?.from;
    const toTime = s?.to;
    
    if (!fromTime || !toTime) return alert("Select start & end time");
    
    // Check if hour, minute and meridian are selected (not placeholder values)
    const fromValid = fromTime.hour && fromTime.hour !== "Hour" && 
                      fromTime.minute && fromTime.minute !== "Min" && 
                      fromTime.meridian;
    const toValid = toTime.hour && toTime.hour !== "Hour" && 
                    toTime.minute && toTime.minute !== "Min" && 
                    toTime.meridian;
    
    if (!fromValid) return alert("Select complete start time (hour, minute, AM/PM)");
    if (!toValid) return alert("Select complete end time (hour, minute, AM/PM)");

    let start = toMinutes(fromTime);
    let end = toMinutes(toTime);

    if (start === null || end === null)
      return alert("Invalid time selection");

    if (end <= start) {
      end += 24 * 60;
    }

    const slots = [];
    const pricePerHour = Number(form.price);

    const createId = () => Math.random().toString(36).substring(2, 10);

    let current = start;

    while (current + 60 <= end) {
      const fromTimeVal = current % (24 * 60);
      const toTimeVal = (current + 60) % (24 * 60);

      slots.push({
        id: createId(),
        from: formatTime(fromTimeVal),
        to: formatTime(toTimeVal),
        price: pricePerHour,
        is_booked: false,
      });

      current += 60;
    }

    if (slots.length === 0) {
      return alert("No slots generated. Please check your time selection.");
    }

    setForm((p) => ({ ...p, generatedSlots: slots }));
  };

  // Map callbacks
  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  const onSearchBoxLoad = (ref) => {
    searchBoxRef.current = ref;
  };

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    if (!place.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    const newCenter = { lat, lng };

    mapRef.current?.panTo(newCenter);
    mapRef.current?.setZoom(16);
    setCenter(newCenter);
    setMarkerPosition(newCenter);

    // Clean the address to remove plus code
    const cleanedLocation = cleanAddress(place.formatted_address || place.name);

    setForm((p) => ({
      ...p,
      location: cleanedLocation,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setCenter({ lat, lng });
    setMarkerPosition({ lat, lng });

    // Reverse geocoding
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        // Clean the address to remove plus code
        const cleanedLocation = cleanAddress(results[0].formatted_address);
        setForm((p) => ({
          ...p,
          location: cleanedLocation,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
        }));
      } else {
        setForm((p) => ({
          ...p,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
        }));
      }
    });
  };

  // Validate all mandatory fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.vendorId || !form.vendorName) {
      newErrors.vendorId = "Vendor ID is required";
    }
    if (!form.location) {
      newErrors.location = "Location is required";
    }
    if (!form.price) {
      newErrors.price = "Price is required";
    }
    if (form.games.length === 0) {
      newErrors.games = "Please select a game";
    }
    if (form.amenities.length === 0) {
      newErrors.amenities = "Please select at least one amenity";
    }
    if (form.features.length === 0) {
      newErrors.features = "Please select a feature";
    }
    if (!form.description) {
      newErrors.description = "Description is required";
    }
    if (form.gallery.length < 3) {
      newErrors.gallery = "Minimum 3 gallery images required";
    }
    if (form.banner.length < 3) {
      newErrors.banner = "Minimum 3 banner images required";
    }
    if (form.generatedSlots.length === 0) {
      newErrors.slots = "Please generate slots";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.input-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!form.latitude || !form.longitude) {
      setErrors(prev => ({ ...prev, location: "Please select a location on the map" }));
      return;
    }

    const formData = new FormData();

    formData.append("vendorId", form.vendorId);
    formData.append("name", form.vendorName);
    formData.append("location", form.location);
    formData.append("latitude", form.latitude);
    formData.append("longitude", form.longitude);
    formData.append("price", Number(form.price));
    formData.append("games", JSON.stringify(form.games));
    formData.append("amenities", JSON.stringify(form.amenities));
    formData.append("features", JSON.stringify(form.features));
    formData.append("description", form.description);
    formData.append("slots", JSON.stringify(form.generatedSlots));

    form.banner.forEach((file) => {
      formData.append("banner_images", file);
    });

    form.gallery.forEach((file) => {
      formData.append("gallery_images", file);
    });

    const res = await fetch("http://localhost:8000/api/vendor/turfs/create/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      body: formData,
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      alert("Turf Added Successfully");
      navigate("/TurfList");
    } else {
      alert("Error adding turf");
    }
  };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page">
      <h2>Add Turf</h2>

      <form onSubmit={submit} className="form">
        {/* Vendor */}
        <div className="form-group">
          <label>Vendor ID *</label>
          <input
            name="vendorId"
            placeholder="Enter Vendor ID"
            className={errors.vendorId ? "input-error" : ""}
            onChange={(e) => {
              handleChange(e);
              fetchVendor(e.target.value);
              if (errors.vendorId) setErrors(prev => ({...prev, vendorId: null}));
            }}
            required
          />
          {errors.vendorId && <span className="error-text">{errors.vendorId}</span>}
        </div>
        <div className="form-group">
          <input 
            value={form.vendorName || "Vendor name will appear here"} 
            readOnly 
            placeholder="Vendor Name"
            className={errors.vendorId ? "input-error" : ""}
          />
        </div>

        {/* Location with Map */}
        <div className="form-group">
          <label>Turf Location *</label>
          <input
            name="location"
            placeholder="Search location or select on map"
            value={form.location}
            className={errors.location ? "input-error" : ""}
            onChange={(e) => {
              handleChange(e);
              if (errors.location) setErrors(prev => ({...prev, location: null}));
            }}
            required
          />
          {errors.location && <span className="error-text">{errors.location}</span>}
        </div>

        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="map-toggle-btn"
        >
          {showMap ? "Hide Map" : "Show Map to Select Location"}
        </button>

        {showMap && (
          <div className="map-container">
            {/* Search Box */}
            <StandaloneSearchBox
              onLoad={onSearchBoxLoad}
              onPlacesChanged={onPlacesChanged}
            >
              <input
                type="text"
                placeholder="Search for a location..."
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                  boxSizing: "border-box",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </StandaloneSearchBox>

            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={12}
              onLoad={onMapLoad}
              onClick={handleMapClick}
            >
              {markerPosition && <Marker position={markerPosition} />}
            </GoogleMap>

            {markerPosition && (
              <p style={{ marginTop: "10px", fontSize: "12px" }}>
                📍 Selected: {form.location || "Location selected"}
                <br />
                Lat: {markerPosition.lat.toFixed(6)}, Lng:{" "}
                {markerPosition.lng.toFixed(6)}
              </p>
            )}
          </div>
        )}

        {/* Hidden lat/lng fields */}
        <input type="hidden" name="latitude" value={form.latitude} />
        <input type="hidden" name="longitude" value={form.longitude} />

        {/* Games */}
        <label>Available Games</label>
        <div className="radio-group">
          {games.map((g) => (
            <label key={g} className="radio-chip">
              <input
                type="radio"
                checked={form.games.includes(g)}
                onChange={() => handleRadio("games", g)}
              />
              {g}
            </label>
          ))}
        </div>

        {/* Amenities */}
        <label>Amenities</label>
        <div className="check-row">
          {amenities.map((a) => (
            <label key={a}>
              <input
                type="checkbox"
                checked={form.amenities.includes(a)}
                onChange={() =>
                  setForm((p) => ({
                    ...p,
                    amenities: p.amenities.includes(a)
                      ? p.amenities.filter((x) => x !== a)
                      : [...p.amenities, a],
                  }))
                }
              />
              {a}
            </label>
          ))}
        </div>

        {/* Features */}
        <label>Features</label>
        <div className="check-row">
          {features.map((f) => (
            <label key={f}>
              <input
                type="checkbox"
                checked={form.features.includes(f)}
                onChange={() =>
                  setForm((p) => {
                    let updated = p.features.includes(f)
                      ? p.features.filter((x) => x !== f)
                      : [...p.features, f];

                    if (f === "Indoor") {
                      updated = updated.filter((x) => x !== "Outdoor");
                    }

                    if (f === "Outdoor") {
                      updated = updated.filter((x) => x !== "Indoor");
                    }

                    return { ...p, features: updated };
                  })
                }
              />
              {f}
            </label>
          ))}
        </div>

        <label>Description</label>
        <textarea
          name="description"
          placeholder="Enter turf description"
          value={form.description}
          onChange={handleChange}
          rows={4}
        />

        <label>Amount Per Hours</label>
        <input
          name="price"
          type="number"
          placeholder="Price per hour"
          onChange={handleChange}
        />

        {/* Gallery */}
        <label>Gallery Images</label>
        <input type="file" name="gallery" multiple onChange={handleFile} />
        <div className="preview-row">
          {form.gallery.map((img, i) => (
            <div key={i} className="preview">
              <img src={URL.createObjectURL(img)} alt="" />
              <button type="button" onClick={() => removeImage("gallery", i)}>
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Banner */}
        <label>Banner Images</label>
        <input type="file" name="banner" multiple onChange={handleFile} />
        <div className="preview-row">
          {form.banner.map((img, i) => (
            <div key={i} className="preview banner">
              <img src={URL.createObjectURL(img)} alt="" />
              <button type="button" onClick={() => removeImage("banner", i)}>
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Slot */}
        <h3>Slot Timings</h3>

        <div className="time-row">
          <div className="time-group">
            <label>From</label>
            <select
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  slots: {
                    all: {
                      ...p.slots.all,
                      from: { ...p.slots.all?.from, hour: e.target.value },
                    },
                  },
                }))
              }
            >
              <option>Hour</option>
              {hours.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>

            <select
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  slots: {
                    all: {
                      ...p.slots.all,
                      from: { ...p.slots.all?.from, minute: e.target.value },
                    },
                  },
                }))
              }
            >
              <option>Min</option>
              {minutes.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>

            <select
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  slots: {
                    all: {
                      ...p.slots.all,
                      from: { ...p.slots.all?.from, meridian: e.target.value },
                    },
                  },
                }))
              }
              value={form.slots?.all?.from?.meridian || ""}
            >
              <option value="">AM/PM</option>
              {meridians.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="time-group">
            <label>To</label>
            <select
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  slots: {
                    all: {
                      ...p.slots.all,
                      to: { ...p.slots.all?.to, hour: e.target.value },
                    },
                  },
                }))
              }
            >
              <option>Hour</option>
              {hours.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>

            <select
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  slots: {
                    all: {
                      ...p.slots.all,
                      to: { ...p.slots.all?.to, minute: e.target.value },
                    },
                  },
                }))
              }
            >
              <option>Min</option>
              {minutes.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>

            <select
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  slots: {
                    all: {
                      ...p.slots.all,
                      to: { ...p.slots.all?.to, meridian: e.target.value },
                    },
                  },
                }))
              }
              value={form.slots?.all?.to?.meridian || ""}
            >
              <option value="">AM/PM</option>
              {meridians.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="button" onClick={generateSlots}>
          Generate Slots
        </button>

        <div className="slot-preview">
          {form.generatedSlots.map((s, i) => (
            <div key={i} className="slot-chip">
              {s.from} - {s.to} ₹{s.price}
            </div>
          ))}
        </div>

        <button>Add Turf</button>
      </form>
    </div>
  );
}

