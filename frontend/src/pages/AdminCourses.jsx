import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import "./facultyPages.css";

export default function AdminCourses() {
  const userName = localStorage.getItem("userName") || "Admin";
  const [search, setSearch] = useState("");

  const courses = [
    { id: 1, code: "CS201", title: "Data Structures", semester: "Sem 3", faculty: "Dr. Smith", credits: 4 },
    { id: 2, code: "CS301", title: "Database Systems", semester: "Sem 3", faculty: "Prof. Johnson", credits: 3 },
    { id: 3, code: "CS401", title: "Web Development", semester: "Sem 4", faculty: "Dr. Williams", credits: 4 },
    { id: 4, code: "EC202", title: "Digital Electronics", semester: "Sem 2", faculty: "Prof. Rao", credits: 3 },
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter((course) =>
      `${course.code} ${course.title} ${course.faculty}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="fpLayout">
      <Sidebar active="Courses" role="admin" />
      <div className="fpMain">
        <Topbar userName={userName} role="Admin" />

        <div className="fpContent">
          <div className="fpHeader">
            <div>
              <h2 className="fpTitle">Course Management</h2>
              <p className="fpSub">Configure available courses, semesters, faculty mapping, and credits.</p>
            </div>

            <div className="fpActions">
              <input
                className="fpInput"
                type="text"
                placeholder="Search course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="fpBtn"
                onClick={() => alert("Add Course form can be connected later")}
              >
                + Add Course
              </button>
            </div>
          </div>

          <div className="fpStats">
            <StatCard label="Active Courses" value="42" badge="Running" sub="Institution" progress={72} />
            <StatCard label="Semesters" value="8" badge="Configured" sub="Academic" progress={65} />
            <StatCard label="Faculty Assigned" value="38" badge="Mapped" sub="Current" progress={80} />
          </div>

          <div className="fpGrid">
            <div className="fpCard">
              <div className="fpCardHead">
                <h3>Course Catalog</h3>
                <span className="fpSmall">{filteredCourses.length} records</span>
              </div>

              <div className="fpTableWrap">
                <table className="fpTable">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Course</th>
                      <th>Semester</th>
                      <th>Faculty</th>
                      <th>Credits</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course.id}>
                        <td className="fpMono">{course.code}</td>
                        <td className="fpStrong">{course.title}</td>
                        <td>{course.semester}</td>
                        <td>{course.faculty}</td>
                        <td>{course.credits}</td>
                        <td>
                          <button
                            className="fpOutlineBtn"
                            onClick={() => alert(`Edit ${course.title}`)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredCourses.length === 0 && (
                      <tr>
                        <td colSpan="6" className="fpEmpty">No course records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="fpSideCard">
              <h3>Course Actions</h3>
              <div className="fpList" style={{ marginTop: 14 }}>
                <div className="fpItem">
                  <div className="fpItemTitle">Assign Faculty</div>
                  <div className="fpItemSub">Map a course to a faculty member or department.</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Update Credits</div>
                  <div className="fpItemSub">Revise course credits and curriculum details.</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Semester Planning</div>
                  <div className="fpItemSub">Organize courses by semester and academic year.</div>
                </div>
              </div>

              <div className="fpActionRow">
                <button className="fpOutlineBtn" onClick={() => alert("Curriculum import can be linked later")}>
                  Import Curriculum
                </button>
                <button className="fpBtn" onClick={() => alert("Course export can be linked later")}>
                  Export Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}