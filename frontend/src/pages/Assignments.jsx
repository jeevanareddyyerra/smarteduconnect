import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import "./assignments.css";

export default function Assignments() {
  const userName = localStorage.getItem("userName") || "Student";

  const assignmentItems = [
    {
      id: 1,
      title: "DSA - Linked Lists Implementation",
      course: "CS201",
      due: "Tomorrow",
      status: "Pending",
      marks: 10,
      description: "Implement singly and doubly linked lists with basic operations.",
    },
    {
      id: 2,
      title: "DBMS - Normal Forms Report",
      course: "CS301",
      due: "In 3 days",
      status: "Pending",
      marks: 15,
      description: "Prepare a short report on 1NF, 2NF, 3NF, and BCNF.",
    },
    {
      id: 3,
      title: "React Mini UI",
      course: "CS401",
      due: "Next Week",
      status: "Submitted",
      marks: 20,
      description: "Create a small responsive React interface with reusable components.",
    },
    {
      id: 4,
      title: "Network Models Comparison",
      course: "CS501",
      due: "Completed",
      status: "Reviewed",
      marks: 10,
      description: "Compare OSI and TCP/IP models with a diagram.",
    },
  ];

  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(assignmentItems[0]);

  const filteredItems = useMemo(() => {
    return filter === "All"
      ? assignmentItems
      : assignmentItems.filter((item) => item.status === filter);
  }, [filter]);

  const statusClass = (status) => {
    if (status === "Submitted" || status === "Reviewed") return "asPill good";
    if (status === "Pending") return "asPill warn";
    return "asPill";
  };

  return (
    <div className="asLayout">
      <Sidebar active="Assignments" role="student" />

      <div className="asMain">
        <Topbar userName={userName} role="Student" />

        <div className="asContent">
          <div className="asHeader">
            <div>
              <h2 className="asTitle">Assignments</h2>
              <p className="asSub">
                View upcoming, submitted, and reviewed assignments.
              </p>
            </div>

            <select
              className="asFilter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Assignments</option>
              <option value="Pending">Pending</option>
              <option value="Submitted">Submitted</option>
              <option value="Reviewed">Reviewed</option>
            </select>
          </div>

          <div className="asGrid">
            <div className="asCard">
              <div className="asCardHead">
                <h3>Assignment List</h3>
                <span>{filteredItems.length} items</span>
              </div>

              <div className="asList">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    className={`asItem ${
                      selected?.id === item.id ? "active" : ""
                    }`}
                    onClick={() => setSelected(item)}
                  >
                    <div className="asItemLeft">
                      <div className="asItemTitle">{item.title}</div>
                      <div className="asItemSub">
                        {item.course} • Due {item.due}
                      </div>
                    </div>

                    <span className={statusClass(item.status)}>{item.status}</span>
                  </button>
                ))}

                {filteredItems.length === 0 && (
                  <div className="asEmpty">No assignments available for this filter.</div>
                )}
              </div>
            </div>

            <div className="asSideCard">
              {selected ? (
                <>
                  <h3>Assignment Details</h3>
                  <div className="asDetailTitle">{selected.title}</div>
                  <div className="asDetailMeta">
                    {selected.course} • {selected.marks} Marks
                  </div>

                  <p className="asDesc">{selected.description}</p>

                  <div className="asInfoBox">
                    <div className="asInfoRow">
                      <span>Status</span>
                      <strong>{selected.status}</strong>
                    </div>
                    <div className="asInfoRow">
                      <span>Due</span>
                      <strong>{selected.due}</strong>
                    </div>
                  </div>

                  <div className="asActions">
                    <button
                      className="asOutlineBtn"
                      onClick={() => alert(`Open instructions for ${selected.title}`)}
                    >
                      View Instructions
                    </button>

                    <button
                      className="asDarkBtn"
                      onClick={() => alert(`Submission flow for ${selected.title} can be connected later`)}
                    >
                      Submit Assignment
                    </button>
                  </div>
                </>
              ) : (
                <div className="asEmpty">Select an assignment to view details.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}