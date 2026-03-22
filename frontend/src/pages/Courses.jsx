import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { getJson } from "../api";
import "./courses.css";

export default function Courses() {
  const userName = localStorage.getItem("userName") || "Student";
  const rollNumber = localStorage.getItem("linked_id");

  const [allCourses, setAllCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    loadCourses();
  }, [rollNumber]);

  async function loadCourses() {
    setMessage("");

    if (!rollNumber) {
      setMessage("Student roll number not found. Please log in again.");
      return;
    }

    try {
      const data = await getJson(
        `/jsp/getStudentCourse.jsp?roll_number=${encodeURIComponent(rollNumber)}`
      );

      if (data.ok) {
        const items = data.items || [];
        setAllCourses(items);
        setSelectedCourse(items.length > 0 ? items[0] : null);
      } else {
        setMessage(data.message || "Failed to load courses");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to load courses");
    }
  }

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      return (
        course.course_code.toLowerCase().includes(search.toLowerCase()) ||
        course.course_name.toLowerCase().includes(search.toLowerCase()) ||
        course.faculty.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [allCourses, search]);

  return (
    <div className="csLayout">
      <Sidebar active="Courses" role="student" />

      <div className="csMain">
        <Topbar userName={userName} role="Student" />

        <div className="csContent">
          <div className="csHeader">
            <div>
              <h2 className="csTitle">Courses</h2>
              <p className="csSub">
                View your available courses, faculty details, and course information.
              </p>
            </div>

            <button
              className="csBtn"
              onClick={() => alert("Course request feature can be connected later")}
            >
              + Request Course
            </button>
          </div>

          {message && <div style={{ marginBottom: "16px" }}>{message}</div>}

          <div className="csToolbar">
            <input
              className="csSearch"
              type="text"
              placeholder="Search by course, code, or faculty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="csGrid">
            <div className="csCard">
              <div className="csCardTop">
                <h3 className="csCardTitle">My Courses</h3>
                <span className="csSmall">{filteredCourses.length} shown</span>
              </div>

              <div className="csTableWrap">
                <table className="csTable">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Course</th>
                      <th>Faculty</th>
                      <th>Credits</th>
                      <th style={{ textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course.course_code}>
                        <td className="csMono">{course.course_code}</td>
                        <td className="csStrong">{course.course_name}</td>
                        <td>{course.faculty}</td>
                        <td>{course.credits}</td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            className="csLinkBtn"
                            onClick={() => setSelectedCourse(course)}
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredCourses.length === 0 && (
                      <tr>
                        <td colSpan="5" className="csEmpty">
                          No courses matched your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="csSideCard">
              <div className="csSideHead">
                <h3>Course Details</h3>
              </div>

              {selectedCourse ? (
                <>
                  <div className="csDetailTitle">{selectedCourse.course_name}</div>
                  <div className="csDetailCode">{selectedCourse.course_code}</div>

                  <div className="csDetailList">
                    <div className="csDetailRow">
                      <span>Faculty</span>
                      <strong>{selectedCourse.faculty}</strong>
                    </div>
                    <div className="csDetailRow">
                      <span>Credits</span>
                      <strong>{selectedCourse.credits}</strong>
                    </div>
                    <div className="csDetailRow">
                      <span>Status</span>
                      <strong>Active</strong>
                    </div>
                  </div>

                  <div className="csSideActions">
                    <button
                      className="csOutlineBtn"
                      onClick={() =>
                        alert(`Open syllabus for ${selectedCourse.course_code}`)
                      }
                    >
                      View Syllabus
                    </button>
                    <button
                      className="csDarkBtn"
                      onClick={() => alert(`Message ${selectedCourse.faculty}`)}
                    >
                      Contact Faculty
                    </button>
                  </div>
                </>
              ) : (
                <div className="csEmptySide">Select a course to view details.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}