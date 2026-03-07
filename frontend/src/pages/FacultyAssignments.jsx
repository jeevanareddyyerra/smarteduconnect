import React, { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import "./facultyPages.css";

export default function FacultyAssignments() {
  const userName = localStorage.getItem("userName") || "Faculty";

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [subject, setSubject] = useState("Data Structures");
  const [dueDate, setDueDate] = useState("2026-03-15");
  const [description, setDescription] = useState("");

  const assignments = [
    { id: 1, title: "Linked List Implementation", subject: "Data Structures", due: "2026-03-10", submissions: 34, status: "Open" },
    { id: 2, title: "Normalization Report", subject: "Database Systems", due: "2026-03-14", submissions: 28, status: "Open" },
    { id: 3, title: "React Component Lab", subject: "Web Development", due: "2026-03-02", submissions: 40, status: "Closed" },
  ];

  const handleCreate = () => {
    if (!assignmentTitle || !description) {
      alert("Please enter assignment title and description.");
      return;
    }

    alert(`Assignment "${assignmentTitle}" created for ${subject}`);
    setAssignmentTitle("");
    setDescription("");
  };

  return (
    <div className="fpLayout">
      <Sidebar active="Assignments" role="faculty" />
      <div className="fpMain">
        <Topbar userName={userName} role="Faculty" />

        <div className="fpContent">
          <div className="fpHeader">
            <div>
              <h2 className="fpTitle">Assignments</h2>
              <p className="fpSub">Create, manage, and review student assignments.</p>
            </div>
          </div>

          <div className="fpGrid">
            <div className="fpCard">
              <div className="fpCardHead">
                <h3>Create Assignment</h3>
                <span className="fpSmall">Faculty Panel</span>
              </div>

              <div className="fpForm">
                <div className="fpFormFull">
                  <label className="fpLabel">Assignment Title</label>
                  <input
                    className="fpInput"
                    type="text"
                    placeholder="Enter assignment title"
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="fpLabel">Subject</label>
                  <select
                    className="fpSelect"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option>Data Structures</option>
                    <option>Database Systems</option>
                    <option>Web Development</option>
                  </select>
                </div>

                <div>
                  <label className="fpLabel">Due Date</label>
                  <input
                    className="fpDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div className="fpFormFull">
                  <label className="fpLabel">Description</label>
                  <textarea
                    className="fpTextarea"
                    placeholder="Enter assignment instructions"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="fpActionRow">
                <button className="fpBtn" onClick={handleCreate}>
                  Publish Assignment
                </button>
                <button
                  className="fpOutlineBtn"
                  onClick={() => alert("Draft save can be connected later")}
                >
                  Save Draft
                </button>
              </div>
            </div>

            <div className="fpSideCard">
              <h3>Existing Assignments</h3>

              <div className="fpList" style={{ marginTop: 14 }}>
                {assignments.map((item) => (
                  <div className="fpItem" key={item.id}>
                    <div className="fpItemTop">
                      <div className="fpItemTitle">{item.title}</div>
                      <span className={`fpBadge ${item.status === "Open" ? "good" : "warn"}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="fpItemSub">
                      {item.subject} • Due {item.due} • {item.submissions} submissions
                    </div>
                  </div>
                ))}
              </div>

              <div className="fpNote">
                Submission review and grading can be connected after backend integration.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}