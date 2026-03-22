import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import { getJson } from "../api";
import "./marks.css";

export default function Marks() {
  const userName = localStorage.getItem("userName") || "Student";
  const rollNumber = localStorage.getItem("linked_id");

  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMarks();
  }, [rollNumber]);

  async function loadMarks() {
    setMessage("");

    if (!rollNumber) {
      setMessage("Student roll number not found. Please log in again.");
      return;
    }

    try {
      const data = await getJson(
        `/jsp/getStudentMarks.jsp?roll_number=${encodeURIComponent(rollNumber)}`
      );

      if (data.ok) {
        setRows(data.items || []);
      } else {
        setMessage(data.message || "Failed to load marks");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to load marks");
    }
  }

  const stats = useMemo(() => {
    const avg =
      rows.length === 0
        ? 0
        : Math.round(rows.reduce((sum, row) => sum + Number(row.score || 0), 0) / rows.length);

    const topScore =
      rows.length === 0 ? 0 : Math.max(...rows.map((row) => Number(row.score || 0)));

    const subjects = rows.length;

    return { avg, topScore, subjects };
  }, [rows]);

  return (
    <div className="mkLayout">
      <Sidebar active="Marks" role="student" />

      <div className="mkMain">
        <Topbar userName={userName} role="Student" />

        <div className="mkContent">
          <div className="mkHeader">
            <div>
              <h2 className="mkTitle">Academic Performance</h2>
              <p className="mkSub">
                View your course-wise marks and performance summary.
              </p>
            </div>

            <button
              className="mkBtn"
              onClick={() => alert("Marks report download can be connected later")}
            >
              Download Report
            </button>
          </div>

          {message && <div style={{ marginBottom: 16 }}>{message}</div>}

          <div className="mkStats">
            <StatCard
              label="Average Score"
              value={`${stats.avg}`}
              badge="Overall"
              sub="Current"
              progress={stats.avg}
            />
            <StatCard
              label="Top Score"
              value={`${stats.topScore}`}
              badge="Best"
              sub="Highest Score"
              progress={stats.topScore}
            />
            <StatCard
              label="Subjects"
              value={`${stats.subjects}`}
              badge="Current"
              sub="Recorded"
              progress={Math.min(stats.subjects * 20, 100)}
            />
          </div>

          <div className="mkGrid">
            <div className="mkCard">
              <div className="mkCardHead">
                <h3>Marks Table</h3>
                <span>{rows.length} records</span>
              </div>

              <div className="mkTableWrap">
                <table className="mkTable">
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Exam Type</th>
                      <th>Score</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index}>
                        <td className="mkStrong">{row.course_code}</td>
                        <td>{row.exam_type}</td>
                        <td className="mkMono">{row.score}</td>
                      </tr>
                    ))}

                    {rows.length === 0 && (
                      <tr>
                        <td colSpan="3" className="mkEmpty">
                          No marks records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mkSideCard">
              <h3>Performance Insight</h3>
              <p className="mkInsightText">
                Your overall score average is <b>{stats.avg}</b>.
              </p>

              <div className="mkSubjectBars">
                {rows.map((row, index) => (
                  <div className="mkBarItem" key={index}>
                    <div className="mkBarTop">
                      <span>{row.course_code} ({row.exam_type})</span>
                      <strong>{row.score}</strong>
                    </div>
                    <div className="mkBar">
                      <div
                        className="mkFill"
                        style={{ width: `${Math.min(Number(row.score || 0), 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="mkOutlineBtn"
                onClick={() => alert("Detailed analytics can be connected later")}
              >
                View Detailed Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}