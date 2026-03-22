import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import { getJson } from "../api";
import "./dashboard.css";

export default function FacultyDashboard() {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "Faculty";
  const role = localStorage.getItem("role");
  const facultyId = localStorage.getItem("linked_id") || "";

  const [data, setData] = useState({
    course_count: 0,
    student_count: 0,
    assignment_count: 0,
    marks_count: 0,
    courses: [],
  });

  const [message, setMessage] = useState("");
  const [searchText, setSearchText] = useState("");

  function openPath(path) {
    navigate(path);
  }

  useEffect(() => {
    if (role !== "faculty") {
      navigate("/", { replace: true });
      return;
    }

    loadDashboard();
  }, [role, navigate]);

  async function loadDashboard() {
    setMessage("");

    if (!facultyId) {
      setMessage("Faculty ID not found. Please log in again.");
      return;
    }

    try {
      const response = await getJson(
        `/jsp/getFacultyDashboard.jsp?faculty_id=${encodeURIComponent(facultyId)}`
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

  const updates = useMemo(
    () => [
      {
        title: "Attendance",
        text: "Mark attendance course-wise from the Attendance page.",
        action: () => openPath("/faculty/attendance"),
      },
      {
        title: "Assignments",
        text: "Publish assignments for your mapped courses.",
        action: () => openPath("/faculty/assignments"),
      },
      {
        title: "Marks",
        text: "Upload marks by course and exam type.",
        action: () => openPath("/faculty/marks"),
      },
    ],
    []
  );

  function handleSearchSubmit() {
    const q = searchText.trim().toLowerCase();

    if (!q) {
      setMessage("Please type something to search.");
      return;
    }

    if (
      q.includes("class") ||
      q.includes("classes") ||
      q.includes("course") ||
      q.includes("courses") ||
      q.includes("dbms") ||
      q.includes("subject")
    ) {
      openPath("/faculty/classes");
      return;
    }

    if (q.includes("attendance")) {
      openPath("/faculty/attendance");
      return;
    }

    if (
      q.includes("assignment") ||
      q.includes("assignments") ||
      q.includes("task")
    ) {
      openPath("/faculty/assignments");
      return;
    }

    if (
      q.includes("mark") ||
      q.includes("marks") ||
      q.includes("score") ||
      q.includes("grade")
    ) {
      openPath("/faculty/marks");
      return;
    }

    const matchedCourse = (data.courses || []).find(
      (course) =>
        (course.course_name || "").toLowerCase().includes(q) ||
        (course.course_code || "").toLowerCase().includes(q)
    );

    if (matchedCourse) {
      openPath("/faculty/classes");
      return;
    }

    setMessage(`No result found for "${searchText}"`);
  }

  return (
    <div className="dbLayout">
      <Sidebar active="Dashboard" role="faculty" />

      <div className="dbMain">
        <Topbar
          userName={userName}
          role="Faculty"
          searchValue={searchText}
          onSearchChange={setSearchText}
          onSearchSubmit={handleSearchSubmit}
          searchPlaceholder="Search classes, attendance, assignments, marks..."
        />

        <div className="dbContent">
          <div className="dbHeader">
            <div>
              <div className="dbWelcome">Welcome back, {userName}! 👋</div>
              <div className="dbSub">
                Here’s an overview of your teaching activities
              </div>
              {message ? <div style={{ marginTop: 10 }}>{message}</div> : null}
            </div>
          </div>

          <div className="dbGridTop">
            <div
              style={{ cursor: "pointer" }}
              onClick={() => openPath("/faculty/classes")}
            >
              <StatCard
                label="Classes Assigned"
                value={`${data.course_count}`}
                badge="Courses"
                sub="Mapped"
                progress={Math.min(data.course_count * 20, 100)}
              />
            </div>

            <div
              style={{ cursor: "pointer" }}
              onClick={() => openPath("/faculty/classes")}
            >
              <StatCard
                label="Total Students"
                value={`${data.student_count}`}
                badge="Across Courses"
                sub="Students"
                progress={Math.min(data.student_count, 100)}
              />
            </div>

            <div
              style={{ cursor: "pointer" }}
              onClick={() => openPath("/faculty/assignments")}
            >
              <StatCard
                label="Assignments Published"
                value={`${data.assignment_count}`}
                badge="Live"
                sub="Assignments"
                progress={Math.min(data.assignment_count * 20, 100)}
              />
            </div>

            <div
              style={{ cursor: "pointer" }}
              onClick={() => openPath("/faculty/marks")}
            >
              <StatCard
                label="Marks Entries"
                value={`${data.marks_count}`}
                badge="Saved"
                sub="Records"
                progress={Math.min(data.marks_count * 20, 100)}
              />
            </div>
          </div>

          <div className="dbGridBottom">
            <div className="dbCard">
              <div className="dbCardHead">
                <h3>My Courses</h3>
              </div>

              <div className="dbCourseList">
                {data.courses && data.courses.length > 0 ? (
                  data.courses.map((course, idx) => (
                    <div
                      className="dbCourseItem"
                      key={idx}
                      style={{ cursor: "pointer" }}
                      onClick={() => openPath("/faculty/classes")}
                    >
                      <div className="dbCourseTitle">{course.course_name}</div>
                      <div className="dbCourseMeta">
                        {course.course_code} • {course.credits} Credits
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dbCourseMeta">No courses assigned.</div>
                )}
              </div>
            </div>

            <div className="dbCard">
              <div className="dbCardHead">
                <h3>Faculty Updates</h3>
              </div>

              <div className="dbNotifList">
                {updates.map((u, idx) => (
                  <div
                    className="dbNotifItem"
                    key={idx}
                    style={{ cursor: "pointer" }}
                    onClick={u.action}
                  >
                    <div className="dbNotifDot" />
                    <div className="dbNotifText">
                      <div className="dbNotifTitle">{u.title}</div>
                      <div className="dbNotifDesc">{u.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dbMiniStats">
                <div
                  className="dbMini"
                  style={{ cursor: "pointer" }}
                  onClick={() => openPath("/faculty/classes")}
                >
                  <div className="dbMiniPct">{data.course_count}</div>
                  <div className="dbMiniLbl">Courses</div>
                </div>

                <div
                  className="dbMini"
                  style={{ cursor: "pointer" }}
                  onClick={() => openPath("/faculty/classes")}
                >
                  <div className="dbMiniPct">{data.student_count}</div>
                  <div className="dbMiniLbl">Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}