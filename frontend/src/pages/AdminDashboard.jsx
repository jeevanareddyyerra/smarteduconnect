import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import { getJson } from "../api";
import "./dashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Admin";

  const [data, setData] = useState({
    students: 0,
    faculty: 0,
    courses: 0,
    reports: 0,
    assignments: 0,
    attendance: 0,
    avg_marks: 0,
  });

  const [message, setMessage] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setMessage("");

    try {
      const response = await getJson("/jsp/getAdminDashboard.jsp");

      if (response.ok) {
        setData(response);
      } else {
        setMessage(response.message || "Failed to load dashboard");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load dashboard");
    }
  }

  function handleSearchSubmit() {
    const q = searchText.trim().toLowerCase();

    if (!q) {
      setMessage("Please type something to search.");
      return;
    }

    if (
      q.includes("student") ||
      q.includes("students") ||
      q.includes("roll") ||
      q.includes("learner")
    ) {
      navigate("/admin/students");
      return;
    }

    if (
      q.includes("faculty") ||
      q.includes("staff") ||
      q.includes("teacher") ||
      q.includes("professor")
    ) {
      navigate("/admin/faculty");
      return;
    }

    if (
      q.includes("course") ||
      q.includes("courses") ||
      q.includes("subject") ||
      q.includes("allocation")
    ) {
      navigate("/admin/courses");
      return;
    }

    if (
      q.includes("report") ||
      q.includes("reports") ||
      q.includes("attendance") ||
      q.includes("marks") ||
      q.includes("analytics")
    ) {
      navigate("/admin/reports");
      return;
    }

    setMessage(`No result found for "${searchText}"`);
  }

  const alerts = useMemo(
    () => [
      {
        title: "Assignments Published",
        text: `${data.assignments} assignments available in the portal`,
      },
      {
        title: "Attendance Records",
        text: `${data.attendance} attendance rows available`,
      },
    ],
    [data.assignments, data.attendance]
  );

  return (
    <div className="dbLayout">
      <Sidebar active="Dashboard" role="admin" />

      <div className="dbMain">
        <Topbar
          userName={userName}
          role="Admin"
          searchValue={searchText}
          onSearchChange={setSearchText}
          onSearchSubmit={handleSearchSubmit}
          searchPlaceholder="Search students, faculty, courses, reports..."
        />

        <div className="dbContent">
          <div className="dbHeader">
            <div>
              <div className="dbWelcome">Welcome back, {userName}! 👋</div>
              <div className="dbSub">
                Here’s an overview of the institution portal
              </div>
              {message ? <div style={{ marginTop: 10 }}>{message}</div> : null}
            </div>
          </div>

          <div className="dbGridTop">
            <div
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/students")}
            >
              <StatCard
                label="Total Students"
                value={`${data.students}`}
                badge="Live"
                sub="Users"
                progress={Math.min(data.students * 20, 100)}
              />
            </div>

            <div
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/faculty")}
            >
              <StatCard
                label="Total Faculty"
                value={`${data.faculty}`}
                badge="Live"
                sub="Staff"
                progress={Math.min(data.faculty * 20, 100)}
              />
            </div>

            <div
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/courses")}
            >
              <StatCard
                label="Active Courses"
                value={`${data.courses}`}
                badge="Live"
                sub="Courses"
                progress={Math.min(data.courses * 20, 100)}
              />
            </div>

            <div
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/reports")}
            >
              <StatCard
                label="Reports Available"
                value={`${data.reports}`}
                badge="Center"
                sub="Reports"
                progress={Math.min(data.reports * 20, 100)}
              />
            </div>
          </div>

          <div className="dbGridBottom">
            <div className="dbCard">
              <div className="dbCardHead">
                <h3>Administration Activity</h3>
              </div>

              <div className="dbCourseList">
                <div
                  className="dbCourseItem"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/admin/students")}
                >
                  <div className="dbCourseTitle">Student Records</div>
                  <div className="dbCourseMeta">
                    {data.students} student accounts available
                  </div>
                </div>

                <div
                  className="dbCourseItem"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/admin/faculty")}
                >
                  <div className="dbCourseTitle">Faculty Records</div>
                  <div className="dbCourseMeta">
                    {data.faculty} faculty accounts available
                  </div>
                </div>

                <div
                  className="dbCourseItem"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/admin/courses")}
                >
                  <div className="dbCourseTitle">Course Allocation</div>
                  <div className="dbCourseMeta">
                    {data.courses} courses configured in the system
                  </div>
                </div>
              </div>
            </div>

            <div className="dbCard">
              <div className="dbCardHead">
                <h3>Reports & Alerts</h3>
              </div>

              <div className="dbNotifList">
                {alerts.map((item, idx) => (
                  <div
                    className="dbNotifItem"
                    key={idx}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/admin/reports")}
                  >
                    <div className="dbNotifDot" />
                    <div className="dbNotifText">
                      <div className="dbNotifTitle">{item.title}</div>
                      <div className="dbNotifDesc">{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dbMiniStats">
                <div
                  className="dbMini"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/admin/reports")}
                >
                  <div className="dbMiniPct">{data.avg_marks}%</div>
                  <div className="dbMiniLbl">Average Marks</div>
                </div>

                <div
                  className="dbMini"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/admin/reports")}
                >
                  <div className="dbMiniPct">{data.reports}</div>
                  <div className="dbMiniLbl">Reports</div>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <button
                  className="fpBtn"
                  onClick={() => navigate("/admin/reports")}
                >
                  Open Reports Center
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}