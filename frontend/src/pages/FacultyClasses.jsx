import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import "./facultyPages.css";

export default function FacultyClasses() {
  const userName = localStorage.getItem("userName") || "Faculty";
  const [search, setSearch] = useState("");

  const classes = [
    { id: 1, section: "CSE-A", subject: "Data Structures", room: "A-204", time: "9:30 AM", students: 48, status: "Today" },
    { id: 2, section: "CSE-B", subject: "Database Systems", room: "B-112", time: "11:00 AM", students: 44, status: "Today" },
    { id: 3, section: "CSE-C", subject: "Web Development", room: "Lab-3", time: "2:00 PM", students: 40, status: "Upcoming" },
    { id: 4, section: "CSE-A", subject: "Mentoring Hour", room: "Seminar Hall", time: "4:00 PM", students: 48, status: "Upcoming" },
  ];

  const filtered = useMemo(() => {
    return classes.filter((item) =>
      `${item.section} ${item.subject} ${item.room}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="fpLayout">
      <Sidebar active="Classes" role="faculty" />

      <div className="fpMain">
        <Topbar userName={userName} role="Faculty" />

        <div className="fpContent">
          <div className="fpHeader">
            <div>
              <h2 className="fpTitle">My Classes</h2>
              <p className="fpSub">View assigned sections, timings, rooms, and subject details.</p>
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

          <div className="fpStats">
            <StatCard label="Classes Today" value="2" badge="Schedule" sub="Today" progress={50} />
            <StatCard label="Total Students" value="180" badge="Active" sub="Across Classes" progress={85} />
            <StatCard label="Upcoming Sessions" value="2" badge="Later" sub="For Today" progress={40} />
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
                      <th>Section</th>
                      <th>Subject</th>
                      <th>Room</th>
                      <th>Time</th>
                      <th>Students</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <tr key={item.id}>
                        <td className="fpStrong">{item.section}</td>
                        <td>{item.subject}</td>
                        <td>{item.room}</td>
                        <td className="fpMono">{item.time}</td>
                        <td>{item.students}</td>
                        <td>
                          <span className={`fpBadge ${item.status === "Today" ? "good" : "warn"}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="6" className="fpEmpty">No classes matched your search.</td>
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
                  <div className="fpItemSub">Go to attendance management for current class.</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Upload Marks</div>
                  <div className="fpItemSub">Enter assessment scores for assigned sections.</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Create Assignment</div>
                  <div className="fpItemSub">Post a new task or lab work for students.</div>
                </div>
              </div>

              <div className="fpActionRow">
                <button className="fpOutlineBtn" onClick={() => alert("Class details can be linked later")}>
                  View Details
                </button>
                <button className="fpBtn" onClick={() => alert("Class notices can be linked later")}>
                  Post Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}