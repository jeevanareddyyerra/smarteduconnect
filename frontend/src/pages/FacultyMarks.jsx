import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import "./facultyPages.css";

export default function FacultyMarks() {
  const userName = localStorage.getItem("userName") || "Faculty";

  const [subject, setSubject] = useState("Data Structures");
  const [examType, setExamType] = useState("Midterm");
  const [rows, setRows] = useState([
    { id: 1, roll: "23CSE001", name: "Aarav Kumar", marks: 85 },
    { id: 2, roll: "23CSE002", name: "Diya Sharma", marks: 90 },
    { id: 3, roll: "23CSE003", name: "Rahul Verma", marks: 74 },
    { id: 4, roll: "23CSE004", name: "Sneha Reddy", marks: 88 },
  ]);

  const updateMarks = (id, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, marks: Number(value) } : row
      )
    );
  };

  const stats = useMemo(() => {
    const total = rows.length;
    const avg = total ? Math.round(rows.reduce((sum, row) => sum + row.marks, 0) / total) : 0;
    const highest = total ? Math.max(...rows.map((row) => row.marks)) : 0;
    return { total, avg, highest };
  }, [rows]);

  return (
    <div className="fpLayout">
      <Sidebar active="Marks" role="faculty" />
      <div className="fpMain">
        <Topbar userName={userName} role="Faculty" />

        <div className="fpContent">
          <div className="fpHeader">
            <div>
              <h2 className="fpTitle">Marks Upload</h2>
              <p className="fpSub">Enter and manage internal and semester marks.</p>
            </div>

            <div className="fpActions">
              <select className="fpSelect" value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option>Data Structures</option>
                <option>Database Systems</option>
                <option>Web Development</option>
              </select>

              <select className="fpSelect" value={examType} onChange={(e) => setExamType(e.target.value)}>
                <option>Midterm</option>
                <option>Assignment</option>
                <option>Quiz</option>
                <option>Semester</option>
              </select>

              <button
                className="fpBtn"
                onClick={() => alert(`Marks saved for ${subject} - ${examType}`)}
              >
                Save Marks
              </button>
            </div>
          </div>

          <div className="fpStats">
            <StatCard label="Students" value={`${stats.total}`} badge="Loaded" sub="Current List" progress={80} />
            <StatCard label="Average Marks" value={`${stats.avg}`} badge="Class Avg" sub={examType} progress={stats.avg} />
            <StatCard label="Highest Score" value={`${stats.highest}`} badge="Top" sub={subject} progress={stats.highest} />
          </div>

          <div className="fpGrid">
            <div className="fpCard">
              <div className="fpCardHead">
                <h3>Marks Entry Table</h3>
                <span className="fpSmall">{rows.length} students</span>
              </div>

              <div className="fpTableWrap">
                <table className="fpTable">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>{examType} Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td className="fpMono">{row.roll}</td>
                        <td className="fpStrong">{row.name}</td>
                        <td>
                          <input
                            className="fpInput"
                            type="number"
                            min="0"
                            max="100"
                            value={row.marks}
                            onChange={(e) => updateMarks(row.id, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="fpSideCard">
              <h3>Marks Panel</h3>
              <div className="fpList" style={{ marginTop: 14 }}>
                <div className="fpItem">
                  <div className="fpItemTitle">Subject</div>
                  <div className="fpItemSub">{subject}</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Assessment</div>
                  <div className="fpItemSub">{examType}</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Guideline</div>
                  <div className="fpItemSub">Enter marks between 0 and 100 before saving.</div>
                </div>
              </div>

              <div className="fpActionRow">
                <button className="fpOutlineBtn" onClick={() => alert("Preview result sheet can be connected later")}>
                  Preview Sheet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}