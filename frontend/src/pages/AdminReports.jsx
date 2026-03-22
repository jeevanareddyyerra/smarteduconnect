import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import { getJson } from "../api";
import "./facultyPages.css";

export default function AdminReports() {
  const userName = localStorage.getItem("userName") || "Admin";

  const [data, setData] = useState({
    students: 0,
    faculty: 0,
    courses: 0,
    assignments: 0,
    attendance: 0,
    avg_marks: 0,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setMessage("");

    try {
      const response = await getJson("/jsp/getAdminReports.jsp");

      if (response.ok) {
        setData(response);
      } else {
        setMessage(response.message || "Failed to load reports");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load reports");
    }
  }

  return (
    <div className="fpLayout">
      <Sidebar active="Reports" role="admin" />
      <div className="fpMain">
        <Topbar userName={userName} role="Admin" />

        <div className="fpContent">
          <div className="fpHeader">
            <div>
              <h2 className="fpTitle">Reports Center</h2>
              <p className="fpSub">View live academic, attendance, and performance reports.</p>
            </div>
          </div>

          {message && <div style={{ marginBottom: 16 }}>{message}</div>}

          <div className="fpStats">
            <StatCard label="Students" value={`${data.students}`} badge="Live" sub="Total" progress={Math.min(data.students, 100)} />
            <StatCard label="Faculty" value={`${data.faculty}`} badge="Live" sub="Total" progress={Math.min(data.faculty, 100)} />
            <StatCard label="Courses" value={`${data.courses}`} badge="Live" sub="Total" progress={Math.min(data.courses * 20, 100)} />
            <StatCard label="Assignments" value={`${data.assignments}`} badge="Live" sub="Total" progress={Math.min(data.assignments * 20, 100)} />
            <StatCard label="Attendance Records" value={`${data.attendance}`} badge="Live" sub="Records" progress={Math.min(data.attendance, 100)} />
            <StatCard label="Average Marks" value={`${data.avg_marks}%`} badge="Live" sub="Overall" progress={data.avg_marks} />
          </div>

          <div className="fpGrid">
            <div className="fpCard">
              <div className="fpCardHead">
                <h3>Generated Reports</h3>
                <span className="fpSmall">Live reports</span>
              </div>

              <div className="fpList">
                <div className="fpItem">
                  <div className="fpItemTop">
                    <div className="fpItemTitle">Student Summary</div>
                    <span className="fpBadge good">Ready</span>
                  </div>
                  <div className="fpItemSub">Total students: {data.students}</div>
                </div>

                <div className="fpItem">
                  <div className="fpItemTop">
                    <div className="fpItemTitle">Faculty Summary</div>
                    <span className="fpBadge good">Ready</span>
                  </div>
                  <div className="fpItemSub">Total faculty: {data.faculty}</div>
                </div>

                <div className="fpItem">
                  <div className="fpItemTop">
                    <div className="fpItemTitle">Course Summary</div>
                    <span className="fpBadge good">Ready</span>
                  </div>
                  <div className="fpItemSub">Total courses: {data.courses}</div>
                </div>

                <div className="fpItem">
                  <div className="fpItemTop">
                    <div className="fpItemTitle">Performance Summary</div>
                    <span className="fpBadge good">Ready</span>
                  </div>
                  <div className="fpItemSub">Average marks: {data.avg_marks}%</div>
                </div>
              </div>
            </div>

            <div className="fpSideCard">
              <h3>Report Tools</h3>
              <div className="fpList" style={{ marginTop: 14 }}>
                <div className="fpItem">
                  <div className="fpItemTitle">Attendance Analytics</div>
                  <div className="fpItemSub">Review attendance records across the portal.</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Performance Summary</div>
                  <div className="fpItemSub">Analyze marks and performance trends.</div>
                </div>
                <div className="fpItem">
                  <div className="fpItemTitle">Export Center</div>
                  <div className="fpItemSub">Download reports later as PDF or sheet.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}