import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import { getJson } from "../api";
import "./attendance.css";

export default function Attendance() {
  const userName = localStorage.getItem("userName") || "Student";
  const rollNumber = localStorage.getItem("linked_id");

  const [view, setView] = useState("All");
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAttendance();
  }, [rollNumber]);

  async function loadAttendance() {
    setMessage("");

    if (!rollNumber) {
      setMessage("Student roll number not found. Please log in again.");
      return;
    }

    try {
      const data = await getJson(
        `/jsp/getStudentAttendance.jsp?roll_number=${encodeURIComponent(rollNumber)}`
      );

      if (data.ok) {
        setRecords(data.items || []);
      } else {
        setMessage(data.message || "Failed to load attendance");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to load attendance");
    }
  }

  const filteredRecords =
    view === "All"
      ? records
      : records.filter((item) => item.status === view);

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
              <p className="atSub">Track your subject-wise attendance</p>
            </div>

            <div className="atControls">
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
            </div>
          </div>

          {message && <div style={{ marginBottom: 15 }}>{message}</div>}

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
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.map((record, idx) => (
                    <tr key={idx}>
                      <td className="atMono">{record.date}</td>
                      <td className="atStrong">{record.course_code}</td>
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
                      <td colSpan="3" className="atEmpty">
                        No attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="atNote">
              Minimum recommended attendance: <b>75%</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}