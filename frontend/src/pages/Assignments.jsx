import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { getJson } from "../api";
import "./assignments.css";

export default function Assignments() {
  const userName = localStorage.getItem("userName") || "Student";
  const rollNumber = localStorage.getItem("linked_id");

  const [assignmentItems, setAssignmentItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAssignments();
  }, [rollNumber]);

  async function loadAssignments() {
    setMessage("");

    if (!rollNumber) {
      setMessage("Student roll number not found. Please log in again.");
      return;
    }

    try {
      const data = await getJson(
        `/jsp/getStudentAssignments.jsp?roll_number=${encodeURIComponent(rollNumber)}`
      );

      if (data.ok) {
        const items = data.items || [];
        setAssignmentItems(items);
        setSelected(items.length > 0 ? items[0] : null);
      } else {
        setMessage(data.message || "Failed to load assignments");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to load assignments");
    }
  }

  const filteredItems = useMemo(() => {
    return filter === "All"
      ? assignmentItems
      : assignmentItems.filter((item) => item.status === filter);
  }, [filter, assignmentItems]);

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

          {message && <div style={{ marginBottom: 16 }}>{message}</div>}

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
                    className={`asItem ${selected?.id === item.id ? "active" : ""}`}
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