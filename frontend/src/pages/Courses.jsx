import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import "./courses.css";

export default function Courses() {
  const userName = localStorage.getItem("userName") || "Student";

  const allCourses = [
    {
      code: "CS201",
      name: "Data Structures",
      faculty: "Dr. Smith",
      status: "Active",
      credits: 4,
      semester: "Semester 3",
      description: "Learn arrays, linked lists, stacks, queues, trees, and graphs.",
    },
    {
      code: "CS301",
      name: "Database Systems",
      faculty: "Prof. Johnson",
      status: "Active",
      credits: 3,
      semester: "Semester 3",
      description: "Understand SQL, normalization, ER modeling, and transactions.",
    },
    {
      code: "CS401",
      name: "Web Development",
      faculty: "Dr. Williams",
      status: "Active",
      credits: 4,
      semester: "Semester 4",
      description: "Build modern web apps using frontend and backend fundamentals.",
    },
    {
      code: "CS501",
      name: "Computer Networks",
      faculty: "Prof. Brown",
      status: "Completed",
      credits: 3,
      semester: "Semester 2",
      description: "Study network layers, routing, protocols, and internet basics.",
    },
  ];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(allCourses[0]);

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const matchesSearch =
        course.code.toLowerCase().includes(search.toLowerCase()) ||
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        course.faculty.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ? true : course.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

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
                View your enrolled courses, faculty details, and course information.
              </p>
            </div>

            <button
              className="csBtn"
              onClick={() => alert("Course enrollment request feature can be connected later")}
            >
              + Request Course
            </button>
          </div>

          <div className="csToolbar">
            <input
              className="csSearch"
              type="text"
              placeholder="Search by course, code, or faculty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="csFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
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
                      <th>Status</th>
                      <th>Credits</th>
                      <th style={{ textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course.code}>
                        <td className="csMono">{course.code}</td>
                        <td className="csStrong">{course.name}</td>
                        <td>{course.faculty}</td>
                        <td>
                          <span
                            className={`csBadge ${
                              course.status === "Active" ? "active" : "inactive"
                            }`}
                          >
                            {course.status}
                          </span>
                        </td>
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
                        <td colSpan="6" className="csEmpty">
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
                  <div className="csDetailTitle">{selectedCourse.name}</div>
                  <div className="csDetailCode">{selectedCourse.code}</div>

                  <div className="csDetailList">
                    <div className="csDetailRow">
                      <span>Faculty</span>
                      <strong>{selectedCourse.faculty}</strong>
                    </div>
                    <div className="csDetailRow">
                      <span>Semester</span>
                      <strong>{selectedCourse.semester}</strong>
                    </div>
                    <div className="csDetailRow">
                      <span>Credits</span>
                      <strong>{selectedCourse.credits}</strong>
                    </div>
                    <div className="csDetailRow">
                      <span>Status</span>
                      <strong>{selectedCourse.status}</strong>
                    </div>
                  </div>

                  <p className="csDetailDesc">{selectedCourse.description}</p>

                  <div className="csSideActions">
                    <button
                      className="csOutlineBtn"
                      onClick={() => alert(`Open syllabus for ${selectedCourse.code}`)}
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