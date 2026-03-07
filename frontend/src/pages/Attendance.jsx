import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import "./attendance.css";

export default function Attendance() {
  const userName = localStorage.getItem("userName") || "Student";

  const [course, setCourse] = useState("CS201");
  const [view, setView] = useState("All");

  const data = {
    CS201: [
      { date: "2026-02-20", topic: "Arrays", status: "Present" },
      { date: "2026-02-21", topic: "Linked Lists", status: "Present" },
      { date: "2026-02-22", topic: "Stacks", status: "Absent" },
      { date: "2026-02-23", topic: "Queues", status: "Present" },
      { date: "2026-02-24", topic: "Trees", status: "Present" },
    ],
    CS301: [
      { date: "2026-02-20", topic: "ER Model", status: "Present" },
      { date: "2026-02-21", topic: "SQL Basics", status: "Absent" },
      { date: "2026-02-22", topic: "Joins", status: "Present" },
      { date: "2026-02-23", topic: "Normalization", status: "Present" },
    ],
    CS401: [
      { date: "2026-02-20", topic: "HTML Forms", status: "Present" },
      { date: "2026-02-21", topic: "CSS Layout", status: "Present" },
      { date: "2026-02-22", topic: "JavaScript DOM", status: "Present" },
      { date: "2026-02-23", topic: "React Intro", status: "Present" },
    ],
  };

  const records = data[course] || [];

  const filteredRecords =
    view === "All" ? records : records.filter((item) => item.status === view);

  const summary = useMemo(() => {
    const total = records.length;
    const present = records.filter((r) => r.status === "Present").length;
    const absent = total - present;
    const percent = total === 0 ? 0 : Math.round((present / total) * 100);

    return { total, present, absent, percent };
  }, [records]);

  const attendanceRemark =
    summary.percent >= 85
      ? "Excellent attendance"
      : summary.percent >= 75
      ? "Good attendance"
      : "Attendance is below recommended level";

  return (
    <div className="atLayout">
      <Sidebar active="Attendance" role="student" />

      <div className="atMain">
        <Topbar userName={userName} role="Student" />

        <div className="atContent">
          <div className="atHeader">
            <div>
              <h2 className="atTitle">Attendance</h2>
              <p className="atSub">
                Track your subject-wise attendance and class records.
              </p>
            </div>

            <div className="atControls">
              <div className="atControlBox">
                <label className="atLabel">Course</label>
                <select
                  className="atSelect"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                >
                  <option value="CS201">CS201 - Data Structures</option>
                  <option value="CS301">CS301 - Database Systems</option>
                  <option value="CS401">CS401 - Web Development</option>
                </select>
              </div>

              <div className="atControlBox">
                <label className="atLabel">View</label>
                <select
                  className="atSelect"
                  value={view}
                  onChange={(e) => setView(e.target.value)}
                >
                  <option value="All">All Records</option>
                  <option value="Present">Present Only</option>
                  <option value="Absent">Absent Only</option>
                </select>
              </div>

              <button
                className="atBtn"
                onClick={() => alert("Attendance report download can be connected later")}
              >
                Download Report
              </button>
            </div>
          </div>

          <div className="atStats">
            <StatCard
              label="Attendance %"
              value={`${summary.percent}%`}
              badge={summary.percent >= 75 ? "Good" : "Low"}
              sub="Overall"
              progress={summary.percent}
            />
            <StatCard
              label="Classes Attended"
              value={`${summary.present}`}
              badge="Present"
              sub={`Out of ${summary.total}`}
              progress={summary.total ? (summary.present / summary.total) * 100 : 0}
            />
            <StatCard
              label="Absences"
              value={`${summary.absent}`}
              badge="Absent"
              sub="Total"
              progress={summary.total ? (summary.absent / summary.total) * 100 : 0}
            />
          </div>

          <div className="atInsight">
            <div className="atInsightTitle">Attendance Insight</div>
            <div className="atInsightText">{attendanceRemark}</div>
          </div>

          <div className="atCard">
            <div className="atCardTop">
              <h3 className="atCardTitle">Attendance Records</h3>
              <span className="atSmall">{filteredRecords.length} entries</span>
            </div>

            <div className="atTableWrap">
              <table className="atTable">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Course</th>
                    <th>Topic Covered</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.map((record, idx) => (
                    <tr key={idx}>
                      <td className="atMono">{record.date}</td>
                      <td className="atStrong">{course}</td>
                      <td>{record.topic}</td>
                      <td>
                        <span
                          className={`atBadge ${
                            record.status === "Present" ? "present" : "absent"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan="4" className="atEmpty">
                        No attendance records found for this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="atNote">
              Minimum recommended attendance: <b>75%</b>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}