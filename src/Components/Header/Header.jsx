import React, { useEffect, useState } from "react";
import "./Header.css";
import { CiBellOn } from "react-icons/ci";
import { LuSettings2 } from "react-icons/lu";

const Header = () => {
  const [firstname, setFirstname] = useState("User");
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    // Get user name from localStorage
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser && savedUser.name) {
      setFirstname(savedUser.name);
    }

    // Get greeting based on time
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning 🌤️");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon ☀️");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good evening 🌆");
    } else {
      setGreeting("Good night 🌙");
    }
  }, []);

  return (
    <div className="header-container">
      <div className="header-top">
        <div>
          <p>Hello, {firstname}</p>
          <h2>{greeting}</h2>
        </div>

        <button className="bell-btn">
          <CiBellOn className="bellIcon" />
        </button>
      </div>

      {/*}<div className="search-area">
        <input type="text" placeholder="Search" />
        <button className="filter-btn">
          <LuSettings2 className="settingIcon" />
        </button>
      </div>{*/}
      <br></br>
      
          </div>
  );
};

export default Header;
