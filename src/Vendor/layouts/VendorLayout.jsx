import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import "./VendorLayout.css";

const VendorLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="vendor-layout">
      {/* MOBILE TOP BAR */}
      <div className="mobile-header">
        <button className="menu-btn" onClick={() => setOpen(true)}>
          ☰
        </button>
        <span>Adukalam</span>
      </div>

      <Sidebar open={open} close={() => setOpen(false)} />

      <div className="vendor-content" onClick={() => setOpen(false)}>
        <Outlet />
      </div>
    </div>
  );
};

export default VendorLayout;
