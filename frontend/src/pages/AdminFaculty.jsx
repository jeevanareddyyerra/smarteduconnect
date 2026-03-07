import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import "./facultyPages.css";

export default function AdminFaculty() {
  const userName = localStorage.getItem("userName") || "Admin";
  const [search, setSearch] = useState("");

  const faculty = [
    { id: 1, name: "Dr. Smith", dept: "CSE", subject: "Data Structures", status: "Active" },
    { id: 2, name: "Prof. Johnson", dept: "CSE", subject: "Database Systems", status: "Active" },
    { id: 3, name: "Dr. Williams", dept: "CSE", subject: "Web Development", status: "Active" },
    { id: 4, name: "Prof. Rao", dept: "ECE", subject: "Digital Electronics", status: "On Leave" },
  ];

  const filteredFaculty = useMemo(() => {
    return faculty.filter((item) =>
      `${item.name} ${item.dept} ${item.subject}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="fpLayout">
      <Sidebar active="Faculty" role="admin" />
      <div className="fpMain">
        <Topbar userName={userName} role="Admin" />

        <div className="fpContent">
          <div className="fpHeader">
            <div>
              <h2 className="fpTitle">Faculty Management</h2>
              <p className="fpSub">Manage faculty profiles, departments, and subject assignments.</p>
            </div>

            <div className="fpActions">
              <input
                className="fpInput"
                type="text"
                placeholder="Search faculty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="fpBtn"
                onClick={() => alert("Add Faculty form can be connected later")}
              >
                + Add Faculty
              </button>
            </div>
          </div>

          <div className="fpStats">
            <StatCard label="Total Faculty" value="86" badge="Current" sub="Institution" progress={75} />
            <StatCard label="Departments" value="8" badge="Academic" sub="Managed" progress={68} />
            <StatCard label="Active Staff" value="79" badge="Available" sub="Teaching" progress={88} />
          </div>

          <div className="fpGrid">
            <div className="fpCard">
              <div className="fpCardHead">
                <h3>Faculty Directory</h3>
                <span className="fpSmall">{filteredFaculty.length} records</span>
              </div>

              <div className="fpTableWrap">
                <table className="fpTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredFaculty.map((item) => (
                      <tr key={item.id}>
                        <td className="fpStrong">{item.name}</td>
                        <td>{item.dept}</td>
                        <td>{item.subject}</td>
                        <td>
                          <span className={`fpBadge ${item.status === "Active" ? "good" : "warn"}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="fpOutlineBtn"
                            onClick={() => alert(`Edit ${item.name}`)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredFaculty.length === 0 && (
                      <tr>
                        <td colSpan="5" className="fpEmpty">No faculty records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="fpSideCard">
              <h3>Quick Controls</h3>
              <div className="fpList" style={{ marginTop: 14 }}>
                <div className="fpItem">
                  <div className="fpItemTitle">Assign Subjects</div>
                  <div className="fpItemSub">Map faculty members to semesters and courses.</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Department Transfer</div>
                  <div className="fpItemSub">Update department or role details.</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Leave Monitoring</div>
                  <div className="fpItemSub">Track inactive or unavailable staff.</div>
                </div>
              </div>

              <div className="fpActionRow">
                <button className="fpOutlineBtn" onClick={() => alert("Faculty import can be linked later")}>
                  Import Faculty
                </button>
                <button className="fpBtn" onClick={() => alert("Faculty export can be linked later")}>
                  Export Faculty
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}