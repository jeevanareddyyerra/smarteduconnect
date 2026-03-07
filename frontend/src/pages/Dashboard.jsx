import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import "./dashboard.css";

export default function Dashboard() {
  const courses = [
    { title: "Data Structures", code: "CS201", teacher: "Dr. Smith" },
    { title: "Database Systems", code: "CS301", teacher: "Prof. Johnson" },
    { title: "Web Development", code: "CS401", teacher: "Dr. Williams" },
    { title: "Computer Networks", code: "CS501", teacher: "Prof. Brown" },
  ];

  const notifications = [
    { title: "Assignment Due", text: "CS201 assignment due tomorrow", time: "2 hours ago" },
    { title: "Exam Scheduled", text: "Midterm exam for CS301 on Friday", time: "1 day ago" },
  ];

  return (
    <div className="dbLayout">
      <Sidebar active="Dashboard" />

      <div className="dbMain">
        <Topbar userName="John Doe" />

        <div className="dbContent">
          <div className="dbHeader">
            <div>
              <div className="dbWelcome">Welcome back, John! 👋</div>
              <div className="dbSub">Here’s an overview of your academic progress</div>
            </div>
          </div>

          <div className="dbGridTop">
            <StatCard
              label="Classes Attended"
              value="42/50"
              badge="84%"
              sub="Progress"
              progress={84}
            />
            <StatCard
              label="Enrolled Courses"
              value="4"
              badge="Active"
              sub="Courses"
              progress={60}
            />
            <StatCard
              label="Average Grade"
              value="82.5%"
              badge="Good"
              sub="Average"
              progress={82}
            />
            <StatCard
              label="Pending Assignments"
              value="3"
              badge="Due Soon"
              sub="Tasks"
              progress={35}
            />
          </div>

          <div className="dbGridBottom">
            <div className="dbCard">
              <div className="dbCardHead">
                <h3>My Courses</h3>
              </div>

              <div className="dbCourseList">
                {courses.map((c, idx) => (
                  <div className="dbCourseItem" key={idx}>
                    <div className="dbCourseTitle">{c.title}</div>
                    <div className="dbCourseMeta">
                      {c.code} • {c.teacher}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dbCard">
              <div className="dbCardHead">
                <h3>Notifications</h3>
                <span className="dbSmallLink">View All</span>
              </div>

              <div className="dbNotifList">
                {notifications.map((n, idx) => (
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
                  <div className="dbMiniPct">75%</div>
                  <div className="dbMiniLbl">Progress</div>
                </div>
                <div className="dbMini">
                  <div className="dbMiniPct">60%</div>
                  <div className="dbMiniLbl">Progress</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}