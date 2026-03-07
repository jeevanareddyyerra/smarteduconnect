import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import "./dashboard.css";

export default function FacultyDashboard() {
  const userName = localStorage.getItem("userName") || "Faculty";

  const classes = [
    { title: "Data Structures", section: "CSE-A", time: "9:30 AM" },
    { title: "Database Systems", section: "CSE-B", time: "11:00 AM" },
    { title: "Web Development", section: "CSE-C", time: "2:00 PM" },
  ];

  const updates = [
    {
      title: "Attendance Reminder",
      text: "Mark attendance for CSE-A before 12 PM",
      time: "30 mins ago",
    },
    {
      title: "Marks Upload",
      text: "Upload internal marks for Database Systems",
      time: "Today",
    },
  ];

  return (
    <div className="dbLayout">
      <Sidebar active="Dashboard" role="faculty" />

      <div className="dbMain">
        <Topbar userName={userName} role="Faculty" />

        <div className="dbContent">
          <div className="dbHeader">
            <div>
              <div className="dbWelcome">Welcome back, {userName}! 👋</div>
              <div className="dbSub">
                Here’s an overview of your teaching activities
              </div>
            </div>
          </div>

          <div className="dbGridTop">
            <StatCard
              label="Classes Assigned"
              value="5"
              badge="Today 3"
              sub="Subjects"
              progress={70}
            />
            <StatCard
              label="Total Students"
              value="186"
              badge="Active"
              sub="Students"
              progress={85}
            />
            <StatCard
              label="Attendance Pending"
              value="2"
              badge="Urgent"
              sub="Actions"
              progress={40}
            />
            <StatCard
              label="Assignments to Review"
              value="14"
              badge="Queue"
              sub="Pending"
              progress={55}
            />
          </div>

          <div className="dbGridBottom">
            <div className="dbCard">
              <div className="dbCardHead">
                <h3>Today’s Classes</h3>
              </div>

              <div className="dbCourseList">
                {classes.map((item, idx) => (
                  <div className="dbCourseItem" key={idx}>
                    <div className="dbCourseTitle">{item.title}</div>
                    <div className="dbCourseMeta">
                      {item.section} • {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dbCard">
              <div className="dbCardHead">
                <h3>Faculty Updates</h3>
                <span className="dbSmallLink">View All</span>
              </div>

              <div className="dbNotifList">
                {updates.map((n, idx) => (
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
                  <div className="dbMiniPct">88%</div>
                  <div className="dbMiniLbl">Attendance Updated</div>
                </div>
                <div className="dbMini">
                  <div className="dbMiniPct">64%</div>
                  <div className="dbMiniLbl">Marks Uploaded</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}