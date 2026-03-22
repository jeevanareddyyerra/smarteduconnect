import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import { getJson } from "../api";
import "./facultyPages.css";

export default function FacultyClasses() {
  const userName = localStorage.getItem("userName") || "Faculty";
  const facultyId = localStorage.getItem("linked_id") || "";
  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadClasses();
  }, [facultyId]);

  async function loadClasses() {
    setMessage("");

    if (!facultyId) {
      setMessage("Faculty ID not found. Please log in again.");
      return;
    }

    try {
      const data = await getJson(
        `/jsp/getFacultyCourses.jsp?faculty_id=${encodeURIComponent(facultyId)}`
      );

      if (data.ok) {
        setClasses(data.items || []);
      } else {
        setMessage(data.message || "Failed to load classes");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to load classes");
    }
  }

  const filtered = useMemo(() => {
    return classes.filter((item) =>
      `${item.course_code} ${item.course_name}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [classes, search]);

  return (
    <div className="fpLayout">
      <Sidebar active="Classes" role="faculty" />

      <div className="fpMain">
        <Topbar userName={userName} role="Faculty" />

        <div className="fpContent">
          <div className="fpHeader">
            <div>
              <h2 className="fpTitle">My Classes</h2>
              <p className="fpSub">View courses assigned to you.</p>
            </div>

            <div className="fpActions">
              <input
                className="fpInput"
                type="text"
                placeholder="Search class or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="fpOutlineBtn"
                onClick={() => alert("Timetable export can be connected later")}
              >
                Export Timetable
              </button>
            </div>
          </div>

          {message && <div style={{ marginBottom: 16 }}>{message}</div>}

          <div className="fpStats">
            <StatCard label="Assigned Classes" value={`${classes.length}`} badge="Schedule" sub="Current" progress={Math.min(classes.length * 20, 100)} />
            <StatCard label="Faculty ID" value={facultyId} badge="Active" sub="Profile" progress={85} />
            <StatCard label="Visible Classes" value={`${filtered.length}`} badge="Filtered" sub="Search View" progress={Math.min(filtered.length * 20, 100)} />
          </div>

          <div className="fpGrid">
            <div className="fpCard">
              <div className="fpCardHead">
                <h3>Assigned Classes</h3>
                <span className="fpSmall">{filtered.length} classes</span>
              </div>

              <div className="fpTableWrap">
                <table className="fpTable">
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Subject</th>
                      <th>Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item, index) => (
                      <tr key={index}>
                        <td className="fpStrong">{item.course_code}</td>
                        <td>{item.course_name}</td>
                        <td>{item.credits}</td>
                      </tr>
                    ))}

                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="3" className="fpEmpty">No classes matched your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="fpSideCard">
              <h3>Quick Actions</h3>
              <div className="fpList" style={{ marginTop: 14 }}>
                <div className="fpItem">
                  <div className="fpItemTitle">Open Attendance</div>
                  <div className="fpItemSub">Go to attendance management for assigned course.</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Upload Marks</div>
                  <div className="fpItemSub">Enter marks for your assigned course.</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Create Assignment</div>
                  <div className="fpItemSub">Post assignment for your assigned course.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}