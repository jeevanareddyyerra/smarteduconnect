import React from "react";
import "./statCard.css";

export default function StatCard({ label, value, badge, sub, progress = 50 }) {
  return (
    <div className="sc">
      <div className="scTop">
        <div className="scLabel">{label}</div>
        <div className="scBadge">{badge}</div>
      </div>

      <div className="scValue">{value}</div>
      <div className="scSub">{sub}</div>

      <div className="scBar">
        <div className="scFill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}