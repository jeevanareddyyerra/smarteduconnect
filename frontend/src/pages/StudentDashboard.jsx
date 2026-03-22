import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import { getJson } from "../api";
import "./dashboard.css";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "Student";
  const role = localStorage.getItem("role");
  const rollNumber = localStorage.getItem("linked_id");

  const [data, setData] = useState({
    attendance_total: 0,
    attendance_present: 0,
    attendance_percent: 0,
    course_count: 0,
    assignment_count: 0,
    average_score: 0,
    recent_courses: [],
  });

  const [message, setMessage] = useState("");
  const [searchText, setSearchText] = useState("");

  function openPath(path) {
    navigate(path);
  }

  useEffect(() => {
    if (role !== "student") {
      navigate("/", { replace: true });
      return;
    }

    loadDashboard();
  }, [role, navigate]);

  async function loadDashboard() {
    setMessage("");

    if (!rollNumber) {
      setMessage("Student roll number not found. Please log in again.");
      return;
    }

    try {
      const response = await getJson(
        `/jsp/getStudentDashboard.jsp?roll_number=${encodeURIComponent(
          rollNumber
        )}`
      );

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
      q.includes("attendance") ||
      q.includes("class") ||
      q.includes("classes")
    ) {
      navigate("/attendance");
      return;
    }

    if (
      q.includes("assignment") ||
      q.includes("assignments") ||
      q.includes("task")
    ) {
      navigate("/assignments");
      return;
    }

    if (
      q.includes("mark") ||
      q.includes("marks") ||
      q.includes("score") ||
      q.includes("grade")
    ) {
      navigate("/marks");
      return;
    }

    if (
      q.includes("course") ||
      q.includes("courses") ||
      q.includes("subject") ||
      q.includes("dbms")
    ) {
      navigate("/courses");
      return;
    }

    const matchedCourse = (data.recent_courses || []).find(
      (course) =>
        (course.course_name || "").toLowerCase().includes(q) ||
        (course.course_code || "").toLowerCase().includes(q)
    );

    if (matchedCourse) {
      navigate("/courses");
      return;
    }

    setMessage(`No result found for "${searchText}"`);
  }

  const notifications = useMemo(
    () => [
      {
        title: "Attendance Updated",
        text: "Your latest attendance records are available",
        time: "Today",
        action: () => openPath("/attendance"),
      },
      {
        title: "Marks Published",
        text: "Recent marks have been uploaded",
        time: "This Week",
        action: () => openPath("/marks"),
      },
      {
        title: "Assignments Available",
        text: "View assignments published for your enrolled course",
        time: "Now",
        action: () => openPath("/assignments"),
      },
    ],
    []
  );

  return (
    <div className="dbLayout">
      <Sidebar active="Dashboard" role="student" />

      <div className="dbMain">
        <Topbar
          userName={userName}
          role="Student"
          searchValue={searchText}
          onSearchChange={setSearchText}
          onSearchSubmit={handleSearchSubmit}
          searchPlaceholder="Search here..."
        />

        <div className="dbContent">
          <div className="dbHeader">
            <div>
              <div className="dbWelcome">Welcome back, {userName}! 👋</div>
              <div className="dbSub">
                Here’s an overview of your academic progress
              </div>
              {message ? <div style={{ marginTop: 10 }}>{message}</div> : null}
            </div>
          </div>

          <div className="dbGridTop">
            <div
              style={{ cursor: "pointer" }}
              onClick={() => openPath("/attendance")}
            >
              <StatCard
                label="Classes Attended"
                value={`${data.attendance_present}/${data.attendance_total}`}
                badge={`${data.attendance_percent}%`}
                sub="Attendance"
                progress={data.attendance_percent}
              />
            </div>

            <div
              style={{ cursor: "pointer" }}
              onClick={() => openPath("/courses")}
            >
              <StatCard
                label="Available Courses"
                value={`${data.course_count}`}
                badge="Active"
                sub="Courses"
                progress={Math.min(data.course_count * 20, 100)}
              />
            </div>

            <div
              style={{ cursor: "pointer" }}
              onClick={() => openPath("/marks")}
            >
              <StatCard
                label="Average Marks"
                value={`${data.average_score}%`}
                badge={data.average_score >= 75 ? "Good" : "Needs Work"}
                sub="Performance"
                progress={data.average_score}
              />
            </div>

            <div
              style={{ cursor: "pointer" }}
              onClick={() => openPath("/assignments")}
            >
              <StatCard
                label="Marks Uploaded"
                value={`${data.assignment_count}`}
                badge="Latest"
                sub="Evaluations"
                progress={Math.min(data.assignment_count * 20, 100)}
              />
            </div>
          </div>

          <div className="dbGridBottom">
            <div className="dbCard">
              <div className="dbCardHead">
                <h3>Course Catalog</h3>
              </div>

              <div className="dbCourseList">
                {data.recent_courses && data.recent_courses.length > 0 ? (
                  data.recent_courses.map((course, idx) => (
                    <div
                      className="dbCourseItem"
                      key={idx}
                      onClick={() => openPath("/courses")}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="dbCourseTitle">{course.course_name}</div>
                      <div className="dbCourseMeta">
                        {course.course_code} • Faculty ID: {course.faculty_id}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dbCourseMeta">No courses available.</div>
                )}
              </div>
            </div>

            <div className="dbCard">
              <div className="dbCardHead">
                <h3>Notifications</h3>
              </div>

              <div className="dbNotifList">
                {notifications.map((n, idx) => (
                  <div
                    className="dbNotifItem"
                    key={idx}
                    onClick={n.action}
                    style={{ cursor: "pointer" }}
                  >
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
                <div
                  className="dbMini"
                  style={{ cursor: "pointer" }}
                  onClick={() => openPath("/attendance")}
                >
                  <div className="dbMiniPct">{data.attendance_percent}%</div>
                  <div className="dbMiniLbl">Attendance</div>
                </div>

                <div
                  className="dbMini"
                  style={{ cursor: "pointer" }}
                  onClick={() => openPath("/marks")}
                >
                  <div className="dbMiniPct">{data.average_score}%</div>
                  <div className="dbMiniLbl">Average Marks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}