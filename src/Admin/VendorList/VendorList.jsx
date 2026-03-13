import "./VendorList.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/vendors/");
      const data = await res.json();
      setVendors(data);
    } catch (error) {
      console.error("Error loading vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  /* Status Toggle with confirmation */
  const toggleStatus = async (id, status) => {
    const newStatus = status === "Approved" ? "Inactive" : "Approved";
    const action = newStatus === "Approved" ? "activate" : "deactivate";
    
    if (!window.confirm(`Are you sure you want to ${action} this vendor? Their turfs will ${newStatus === "Approved" ? "appear" : "not appear"} in user pages.`)) {
      return;
    }

    try {
      await fetch(`http://localhost:8000/api/vendors/status/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      loadVendors();
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="vendor-list-page">
        <p>Loading vendors...</p>
      </div>
    );
  }

  return (
    <div className="vendor-list-page">
      <h2>Vendor List</h2>

      <table className="vendor-table">
        <thead>
          <tr>
            <th>Venue</th>
            <th>Owner</th>
            <th>Phone</th>
            <th>District</th>
            <th>Turfs</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {vendors.map((v) => (
            <tr key={v.vendor_id}>
              <td>{v.venuename}</td>
              <td>{v.ownername}</td>
              <td>{v.phone}</td>
              <td>{v.location}</td>
              <td>{v.totalturf}</td>

              <td>
                <button
                  className={
                    v.status === "Approved"
                      ? "status-on"
                      : "status-off"
                  }
                  style={{
                    backgroundColor: v.status === "Approved" ? "#22c55e" : "#ef4444",
                    color: "white"
                  }}
                  onClick={() =>
                    toggleStatus(v.vendor_id, v.status)
                  }
                  title={v.status === "Approved" ? "Click to deactivate (turf won't show in user pages)" : "Click to activate (turf will show in user pages)"}
                >
                  {v.status === "Approved" ? "ON" : "OFF"}
                </button>
              </td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(`/vendor-edit/${v.vendor_id}`)
                  }
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {vendors.length === 0 && (
        <p className="no-vendors">No vendors found</p>
      )}
    </div>
  );
}