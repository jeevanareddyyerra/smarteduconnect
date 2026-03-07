import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import "./facultyPages.css";

export default function FacultyAttendance() {
  const userName = localStorage.getItem("userName") || "Faculty";

  const [selectedClass, setSelectedClass] = useState("CSE-A");
  const [selectedDate, setSelectedDate] = useState("2026-03-07");
  const [students, setStudents] = useState([
    { id: 1, roll: "23CSE001", name: "Aarav Kumar", status: "Present" },
    { id: 2, roll: "23CSE002", name: "Diya Sharma", status: "Present" },
    { id: 3, roll: "23CSE003", name: "Rahul Verma", status: "Absent" },
    { id: 4, roll: "23CSE004", name: "Sneha Reddy", status: "Present" },
    { id: 5, roll: "23CSE005", name: "Kiran Sai", status: "Present" },
  ]);

  const summary = useMemo(() => {
    const total = students.length;
    const present = students.filter((s) => s.status === "Present").length;
    const absent = total - present;
    const percent = total ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, percent };
  }, [students]);

  const updateStatus = (id, value) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status: value } : student
      )
    );
  };

  return (
    <div className="fpLayout">
      <Sidebar active="Attendance" role="faculty" />
      <div className="fpMain">
        <Topbar userName={userName} role="Faculty" />

        <div className="fpContent">
          <div className="fpHeader">
            <div>
              <h2 className="fpTitle">Attendance Management</h2>
              <p className="fpSub">Mark and review attendance for your students.</p>
            </div>

            <div className="fpActions">
              <select
                className="fpSelect"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="CSE-A">CSE-A</option>
                <option value="CSE-B">CSE-B</option>
                <option value="CSE-C">CSE-C</option>
              </select>

              <input
                className="fpDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

              <button
                className="fpBtn"
                onClick={() => alert(`Attendance saved for ${selectedClass} on ${selectedDate}`)}
              >
                Save Attendance
              </button>
            </div>
          </div>

          <div className="fpStats">
            <StatCard label="Present" value={`${summary.present}`} badge="Marked" sub="Students" progress={summary.percent} />
            <StatCard label="Absent" value={`${summary.absent}`} badge="Today" sub="Students" progress={summary.total ? (summary.absent / summary.total) * 100 : 0} />
            <StatCard label="Attendance %" value={`${summary.percent}%`} badge="Overall" sub={selectedClass} progress={summary.percent} />
          </div>

          <div className="fpGrid">
            <div className="fpCard">
              <div className="fpCardHead">
                <h3>Student Attendance Sheet</h3>
                <span className="fpSmall">{students.length} students</span>
              </div>

              <div className="fpTableWrap">
                <table className="fpTable">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="fpMono">{student.roll}</td>
                        <td className="fpStrong">{student.name}</td>
                        <td>
                          <select
                            className="fpSelect"
                            value={student.status}
                            onChange={(e) => updateStatus(student.id, e.target.value)}
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="fpNote">
                You can later connect this form to the attendance servlet and database.
              </div>
            </div>

            <div className="fpSideCard">
              <h3>Session Summary</h3>
              <div className="fpList" style={{ marginTop: 14 }}>
                <div className="fpItem">
                  <div className="fpItemTop">
                    <div className="fpItemTitle">Class</div>
                    <span className="fpBadge good">{selectedClass}</span>
                  </div>
                  <div className="fpItemSub">Current attendance session</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTop">
                    <div className="fpItemTitle">Date</div>
                    <span className="fpBadge warn">{selectedDate}</span>
                  </div>
                  <div className="fpItemSub">Selected attendance date</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Next Step</div>
                  <div className="fpItemSub">Review marked entries and save them.</div>
                </div>
              </div>

              <div className="fpActionRow">
                <button className="fpOutlineBtn" onClick={() => alert("Attendance report preview can be added later")}>
                  Preview Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}