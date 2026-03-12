import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditVendor.css";

export default function EditVendor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadVendor();
  }, [id]);

  const loadVendor = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/vendors/code/${id}/`
      );
      if (!res.ok) {
        alert("Vendor not found");
        navigate("/vendorlist");
        return;
      }
      const data = await res.json();
      setForm(data);
    } catch (error) {
      console.error("Error loading vendor:", error);
      alert("Failed to load vendor");
      navigate("/vendorlist");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateVendor = async () => {
    if (!form.venuename || !form.ownername || !form.phone) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/vendors/update/${id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        alert("Vendor updated successfully!");
        navigate("/vendorlist");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update vendor");
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert("Failed to update vendor");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="edit-vendor-page"><p>Loading...</p></div>;
  if (!form) return <div className="edit-vendor-page"><p>Vendor not found</p></div>;

  return (
    <div className="edit-vendor-page">
      <div className="vendor-card">
        <h3>Edit Vendor</h3>

        <div className="form-group">
          <label>Vendor ID</label>
          <input 
            value={form.vendor_id || id} 
            disabled 
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Venue Name *</label>
          <input
            name="venuename"
            value={form.venuename || ""}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter venue name"
          />
        </div>

        <div className="form-group">
          <label>Owner Name *</label>
          <input
            name="ownername"
            value={form.ownername || ""}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter owner name"
          />
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter email"
            type="email"
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            name="location"
            value={form.location || ""}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter location"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter address"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Pincode</label>
          <input
            name="pincode"
            value={form.pincode || ""}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter pincode"
          />
        </div>

        <div className="form-group">
          <label>Total Turfs</label>
          <input
            name="totalturf"
            type="number"
            value={form.totalturf || ""}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter total turfs"
          />
        </div>

        <div className="form-actions">
          <button 
            className="save-btn" 
            onClick={updateVendor}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button 
            className="cancel-btn" 
            onClick={() => navigate("/vendorlist")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
