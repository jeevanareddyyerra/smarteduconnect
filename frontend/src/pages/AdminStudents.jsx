import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import "./facultyPages.css";

export default function AdminStudents() {
  const userName = localStorage.getItem("userName") || "Admin";
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const students = [
    { id: 1, roll: "23CSE001", name: "Aarav Kumar", dept: "CSE", year: "1st Year", status: "Active" },
    { id: 2, roll: "23CSE002", name: "Diya Sharma", dept: "CSE", year: "1st Year", status: "Active" },
    { id: 3, roll: "23ECE014", name: "Karthik Rao", dept: "ECE", year: "2nd Year", status: "Active" },
    { id: 4, roll: "23ME009", name: "Nithin Varma", dept: "MECH", year: "1st Year", status: "Inactive" },
    { id: 5, roll: "23CSE021", name: "Sneha Reddy", dept: "CSE", year: "2nd Year", status: "Active" },
  ];

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.roll.toLowerCase().includes(search.toLowerCase());

      const matchesDept = department === "All" ? true : student.dept === department;

      return matchesSearch && matchesDept;
    });
  }, [search, department]);

  return (
    <div className="fpLayout">
      <Sidebar active="Students" role="admin" />
      <div className="fpMain">
        <Topbar userName={userName} role="Admin" />

        <div className="fpContent">
          <div className="fpHeader">
            <div>
              <h2 className="fpTitle">Student Management</h2>
              <p className="fpSub">Add, update, search, and monitor student records.</p>
            </div>

            <div className="fpActions">
              <input
                className="fpInput"
                type="text"
                placeholder="Search by name or roll no..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="fpSelect"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
              </select>

              <button
                className="fpBtn"
                onClick={() => alert("Add Student form can be connected later")}
              >
                + Add Student
              </button>
            </div>
          </div>

          <div className="fpStats">
            <StatCard label="Total Students" value="1248" badge="Active" sub="Institution" progress={90} />
            <StatCard label="Departments" value="8" badge="Running" sub="Academic" progress={70} />
            <StatCard label="New Admissions" value="86" badge="This Month" sub="Recent" progress={55} />
          </div>

          <div className="fpGrid">
            <div className="fpCard">
              <div className="fpCardHead">
                <h3>Students Table</h3>
                <span className="fpSmall">{filteredStudents.length} records</span>
              </div>

              <div className="fpTableWrap">
                <table className="fpTable">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Year</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="fpMono">{student.roll}</td>
                        <td className="fpStrong">{student.name}</td>
                        <td>{student.dept}</td>
                        <td>{student.year}</td>
                        <td>
                          <span className={`fpBadge ${student.status === "Active" ? "good" : "low"}`}>
                            {student.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="fpOutlineBtn"
                            onClick={() => alert(`Edit ${student.name}`)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan="6" className="fpEmpty">No student records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="fpSideCard">
              <h3>Admin Actions</h3>
              <div className="fpList" style={{ marginTop: 14 }}>
                <div className="fpItem">
                  <div className="fpItemTitle">Create Student Account</div>
                  <div className="fpItemSub">Register a new student profile in the portal.</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Update Academic Info</div>
                  <div className="fpItemSub">Modify branch, year, or section details.</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Deactivate Account</div>
                  <div className="fpItemSub">Disable inactive or withdrawn students.</div>
                </div>
              </div>

              <div className="fpActionRow">
                <button className="fpOutlineBtn" onClick={() => alert("Bulk import can be linked later")}>
                  Import List
                </button>
                <button className="fpBtn" onClick={() => alert("Export list can be linked later")}>
                  Export List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}