import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import "./dashboard.css";

export default function AdminDashboard() {
  const userName = localStorage.getItem("userName") || "Admin";

  const activities = [
    { title: "New Student Registrations", meta: "24 added this week" },
    { title: "Faculty Accounts Updated", meta: "5 updated today" },
    { title: "Course Allocation", meta: "Semester course mapping active" },
  ];

  const reports = [
    {
      title: "Attendance Report Ready",
      text: "Department-wise attendance report generated",
      time: "Today",
    },
    {
      title: "Academic Summary",
      text: "Semester performance summary available",
      time: "Yesterday",
    },
  ];

  return (
    <div className="dbLayout">
      <Sidebar active="Dashboard" role="admin" />

      <div className="dbMain">
        <Topbar userName={userName} role="Admin" />

        <div className="dbContent">
          <div className="dbHeader">
            <div>
              <div className="dbWelcome">Welcome back, {userName}! 👋</div>
              <div className="dbSub">
                Here’s an overview of the institution portal
              </div>
            </div>
          </div>

          <div className="dbGridTop">
            <StatCard
              label="Total Students"
              value="1248"
              badge="Active"
              sub="Users"
              progress={90}
            />
            <StatCard
              label="Total Faculty"
              value="86"
              badge="Available"
              sub="Staff"
              progress={72}
            />
            <StatCard
              label="Active Courses"
              value="42"
              badge="Running"
              sub="Courses"
              progress={68}
            />
            <StatCard
              label="Reports Generated"
              value="19"
              badge="This Month"
              sub="Reports"
              progress={58}
            />
          </div>

          <div className="dbGridBottom">
            <div className="dbCard">
              <div className="dbCardHead">
                <h3>Administration Activity</h3>
              </div>

              <div className="dbCourseList">
                {activities.map((item, idx) => (
                  <div className="dbCourseItem" key={idx}>
                    <div className="dbCourseTitle">{item.title}</div>
                    <div className="dbCourseMeta">{item.meta}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dbCard">
              <div className="dbCardHead">
                <h3>Reports & Alerts</h3>
                <span className="dbSmallLink">View All</span>
              </div>

              <div className="dbNotifList">
                {reports.map((n, idx) => (
                  <div className="dbNotifItem" key={idx}>
                    <div className="dbNotifDot" />
                    <div className="dbNotifText">
                      <div className="dbNotifTitle">{n.title}</div>
                      <div className="dbNotifDesc">{n.text}</div>
                      <div className="dbNotifTime">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dbMiniStats">
                <div className="dbMini">
                  <div className="dbMiniPct">92%</div>
                  <div className="dbMiniLbl">System Health</div>
                </div>
                <div className="dbMini">
                  <div className="dbMiniPct">81%</div>
                  <div className="dbMiniLbl">Data Updated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}