import React from 'react'
import "./logout.css"
import { RiLogoutBoxFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../utils/auth";
import { MdLogout } from "react-icons/md";
const Logout = ({ setOpen }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    // Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Use central logout utility
    logoutUser();

    // Close popup
    if (setOpen) {
      setOpen(false);
    }

    // Force complete page reload and navigation
    window.location.assign("/");
  };

  return (
    <div className='logout-container'>

     

      <div className="popup">
         
        <MdLogout className='logout-icon' />
        <p>Are you sure you want to logout ?</p>


        <div className="btn-holder">
          <button type="button" className='cancel-btn' onClick={() => {
            if (setOpen) setOpen(false);
          }}>cancel</button>
          <button
            type="button"
            className='logout-btn'
            onClick={(e) => {
              console.log("Logout button clicked");
              handleLogout(e);
            }}
          >
            Logout
          </button>
        </div>
      </div>



    </div>
  )
}

export default Logout
