import React from "react";
import "./topbar.css";

export default function Topbar({ userName = "John Doe", role = "Student" }) {
  return (
    <header className="tb">
      <div className="tbSearch">
        <span className="tbSearchIcon">🔍</span>
        <input className="tbInput" placeholder="Search here..." />
      </div>

      <div className="tbRight">
        <button className="tbIconBtn" title="Notifications">
          🔔
        </button>

        <div className="tbUser">
          <div className="tbAvatar">
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="tbUserText">
            <div className="tbUserName">{userName}</div>
            <div className="tbUserRole">{role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}