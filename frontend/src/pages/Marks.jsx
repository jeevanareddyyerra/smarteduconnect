import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import "./marks.css";

export default function Marks() {
  const userName = localStorage.getItem("userName") || "Student";
  const [semester, setSemester] = useState("Semester 3");

  const marksData = {
    "Semester 3": [
      { subject: "Data Structures", midterm: 85, assignment: 90, quiz: 78, average: 84, grade: "A" },
      { subject: "Database Systems", midterm: 72, assignment: 88, quiz: 80, average: 80, grade: "B+" },
      { subject: "Web Development", midterm: 92, assignment: 95, quiz: 88, average: 92, grade: "A+" },
      { subject: "Computer Networks", midterm: 68, assignment: 75, quiz: 70, average: 71, grade: "B" },
    ],
    "Semester 2": [
      { subject: "C Programming", midterm: 82, assignment: 80, quiz: 79, average: 80, grade: "B+" },
      { subject: "Digital Logic", midterm: 76, assignment: 84, quiz: 72, average: 77, grade: "B+" },
      { subject: "Mathematics II", midterm: 88, assignment: 86, quiz: 90, average: 88, grade: "A" },
    ],
  };

  const rows = marksData[semester] || [];

  const stats = useMemo(() => {
    const avg =
      rows.length === 0
        ? 0
        : Math.round(rows.reduce((sum, row) => sum + row.average, 0) / rows.length);

    const topScore =
      rows.length === 0 ? 0 : Math.max(...rows.map((row) => row.average));

    const subjects = rows.length;

    return { avg, topScore, subjects };
  }, [rows]);

  const gradeClass = (grade) => {
    if (grade.includes("A")) return "mkGrade good";
    if (grade.includes("B")) return "mkGrade warn";
    return "mkGrade low";
  };

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
                View your subject-wise marks, grades, and performance summary.
              </p>
            </div>

            <div className="mkActions">
              <select
                className="mkSelect"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 2">Semester 2</option>
              </select>

              <button
                className="mkBtn"
                onClick={() => alert("Marks report download can be connected later")}
              >
                Download Report
              </button>
            </div>
          </div>

          <div className="mkStats">
            <StatCard
              label="Average Score"
              value={`${stats.avg}%`}
              badge="Overall"
              sub={semester}
              progress={stats.avg}
            />
            <StatCard
              label="Top Score"
              value={`${stats.topScore}%`}
              badge="Best"
              sub="Highest Subject"
              progress={stats.topScore}
            />
            <StatCard
              label="Subjects"
              value={`${stats.subjects}`}
              badge="Current"
              sub="Enrolled"
              progress={Math.min(stats.subjects * 20, 100)}
            />
          </div>

          <div className="mkGrid">
            <div className="mkCard">
              <div className="mkCardHead">
                <h3>Marks Table</h3>
                <span>{rows.length} subjects</span>
              </div>

              <div className="mkTableWrap">
                <table className="mkTable">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Midterm</th>
                      <th>Assignment</th>
                      <th>Quiz</th>
                      <th>Average</th>
                      <th>Grade</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.subject}>
                        <td className="mkStrong">{row.subject}</td>
                        <td>{row.midterm}%</td>
                        <td>{row.assignment}%</td>
                        <td>{row.quiz}%</td>
                        <td className="mkMono">{row.average}%</td>
                        <td>
                          <span className={gradeClass(row.grade)}>{row.grade}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mkSideCard">
              <h3>Performance Insight</h3>
              <p className="mkInsightText">
                Your overall performance for <b>{semester}</b> is{" "}
                <b>{stats.avg}%</b>.
              </p>

              <div className="mkSubjectBars">
                {rows.map((row) => (
                  <div className="mkBarItem" key={row.subject}>
                    <div className="mkBarTop">
                      <span>{row.subject}</span>
                      <strong>{row.average}%</strong>
                    </div>
                    <div className="mkBar">
                      <div
                        className="mkFill"
                        style={{ width: `${row.average}%` }}
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