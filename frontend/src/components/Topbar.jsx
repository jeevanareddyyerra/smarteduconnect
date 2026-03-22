import React from "react";
import "./topbar.css";

export default function Topbar({
  userName = "User",
  role = "User",
  searchValue = "",
  onSearchChange = () => {},
  onSearchSubmit = () => {},
  searchPlaceholder = "Search here...",
}) {
  return (
    <div className="topbar">
      <div className="topbarSearch">
        <span className="topbarSearchIcon">🔍</span>

        <input
          type="text"
          className="topbarInput"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSearchSubmit();
            }
          }}
        />
      </div>

      <div className="topbarRight">
        <div className="topbarProfile">
          <div className="topbarAvatar">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>

          <div className="topbarUserInfo">
            <div className="topbarUserName">{userName}</div>
            <div className="topbarUserRole">{role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}