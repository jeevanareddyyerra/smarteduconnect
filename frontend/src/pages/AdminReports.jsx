import React, { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import "./facultyPages.css";

export default function AdminReports() {
  const userName = localStorage.getItem("userName") || "Admin";
  const [reportType, setReportType] = useState("Attendance");
  const [department, setDepartment] = useState("All");

  const reports = [
    { title: "Attendance Summary", department: "CSE", generated: "Today", status: "Ready" },
    { title: "Academic Performance", department: "ECE", generated: "Yesterday", status: "Ready" },
    { title: "Faculty Workload", department: "All", generated: "This Week", status: "Pending" },
    { title: "Course Completion", department: "MECH", generated: "Today", status: "Ready" },
  ];

  return (
    <div className="fpLayout">
      <Sidebar active="Reports" role="admin" />
      <div className="fpMain">
        <Topbar userName={userName} role="Admin" />

        <div className="fpContent">
          <div className="fpHeader">
            <div>
              <h2 className="fpTitle">Reports Center</h2>
              <p className="fpSub">Generate and view academic, attendance, and performance reports.</p>
            </div>

            <div className="fpActions">
              <select
                className="fpSelect"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option>Attendance</option>
                <option>Academic Performance</option>
                <option>Faculty Workload</option>
                <option>Course Completion</option>
              </select>

              <select
                className="fpSelect"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option>All</option>
                <option>CSE</option>
                <option>ECE</option>
                <option>MECH</option>
              </select>

              <button
                className="fpBtn"
                onClick={() => alert(`${reportType} report generated for ${department}`)}
              >
                Generate Report
              </button>
            </div>
          </div>

          <div className="fpStats">
            <StatCard label="Reports Generated" value="19" badge="This Month" sub="Reports" progress={58} />
            <StatCard label="Ready Reports" value="14" badge="Available" sub="Downloadable" progress={82} />
            <StatCard label="Pending Reports" value="5" badge="Queue" sub="Processing" progress={35} />
          </div>

          <div className="fpGrid">
            <div className="fpCard">
              <div className="fpCardHead">
                <h3>Generated Reports</h3>
                <span className="fpSmall">{reports.length} items</span>
              </div>

              <div className="fpList">
                {reports.map((report, index) => (
                  <div className="fpItem" key={index}>
                    <div className="fpItemTop">
                      <div className="fpItemTitle">{report.title}</div>
                      <span className={`fpBadge ${report.status === "Ready" ? "good" : "warn"}`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="fpItemSub">
                      Department: {report.department} • Generated: {report.generated}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="fpSideCard">
              <h3>Report Tools</h3>
              <div className="fpList" style={{ marginTop: 14 }}>
                <div className="fpItem">
                  <div className="fpItemTitle">Attendance Analytics</div>
                  <div className="fpItemSub">Review student attendance across departments.</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Performance Summary</div>
                  <div className="fpItemSub">Analyze marks and subject performance trends.</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Export Center</div>
                  <div className="fpItemSub">Download reports as PDF or spreadsheet later.</div>
                </div>
              </div>

              <div className="fpActionRow">
                <button className="fpOutlineBtn" onClick={() => alert("Preview report can be linked later")}>
                  Preview
                </button>
                <button className="fpBtn" onClick={() => alert("Download feature can be linked later")}>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}