import React from "react";
import { useNavigate } from "react-router-dom";
import "./welcomeRole.css";

export default function WelcomeRole() {
  const navigate = useNavigate();

  return (
    <div className="wrPage">
      <div className="wrCard">
        <h1 className="wrTitle">Welcome to SmartEduConnect</h1>
        <p className="wrSub">Select your role to continue</p>

        <div className="wrList">
          <button className="wrItem" onClick={() => navigate("/student/login")}>
            <div className="wrIcon student">🎓</div>
            <div className="wrText">
              <div className="wrRole">Student</div>
              <div className="wrDesc">
                Access your courses, view attendance, and check your academic
                performance.
              </div>
            </div>
            <div className="wrArrow">→</div>
          </button>

          <button className="wrItem" onClick={() => navigate("/faculty/login")}>
            <div className="wrIcon faculty">👩‍🏫</div>
            <div className="wrText">
              <div className="wrRole">Faculty</div>
              <div className="wrDesc">
                Manage classes, record attendance, and track student
                performance.
              </div>
            </div>
            <div className="wrArrow">→</div>
          </button>

          <button className="wrItem" onClick={() => navigate("/admin/login")}>
            <div className="wrIcon admin">🛡️</div>
            <div className="wrText">
              <div className="wrRole">Admin</div>
              <div className="wrDesc">
                Manage users, create announcements, and generate reports.
              </div>
            </div>
            <div className="wrArrow">→</div>
          </button>
        </div>

        <div className="wrFooter">
          Need help? <span className="wrLink">Contact Support</span>
        </div>
      </div>
    </div>
  );
}