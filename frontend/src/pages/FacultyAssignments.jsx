import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { getJson, postForm } from "../api";
import "./facultyPages.css";

export default function FacultyAssignments() {
  const userName = localStorage.getItem("userName") || "Faculty";
  const facultyId = localStorage.getItem("linked_id") || "";

  const [courseOptions, setCourseOptions] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [marks, setMarks] = useState(10);
  const [description, setDescription] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadFacultyCourses();
    loadAssignments();
  }, [facultyId]);

  async function loadFacultyCourses() {
    try {
      const data = await getJson(
        `/jsp/getFacultyCourses.jsp?faculty_id=${encodeURIComponent(facultyId)}`
      );

      if (data.ok) {
        const items = data.items || [];
        setCourseOptions(items);
        if (items.length > 0) {
          setCourseCode(items[0].course_code);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadAssignments() {
    setMessage("");

    try {
      const data = await getJson(
        `/jsp/getFacultyAssignments.jsp?faculty_id=${encodeURIComponent(facultyId)}`
      );

      if (data.ok) {
        setAssignments(data.items || []);
      } else {
        setMessage(data.message || "Failed to load assignments");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to load assignments");
    }
  }

  async function handleCreate() {
    if (!assignmentTitle || !description || !courseCode || !dueDate) {
      setMessage("Please fill all assignment fields.");
      return;
    }

    try {
      const data = await postForm("/jsp/createAssignment.jsp", {
        title: assignmentTitle,
        course_code: courseCode,
        description: description,
        due_date: dueDate,
        marks: marks,
      });

      if (data.ok) {
        setMessage("Assignment created successfully");
        setAssignmentTitle("");
        setDescription("");
        setMarks(10);
        loadAssignments();
      } else {
        setMessage(data.message || "Failed to create assignment");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to create assignment");
    }
  }

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

          {message && <div style={{ marginBottom: 16 }}>{message}</div>}

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
                  <label className="fpLabel">Course Code</label>
                  <select
                    className="fpSelect"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                  >
                    {courseOptions.map((course) => (
                      <option key={course.course_code} value={course.course_code}>
                        {course.course_code}
                      </option>
                    ))}
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

                <div>
                  <label className="fpLabel">Marks</label>
                  <input
                    className="fpInput"
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
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
              </div>
            </div>

            <div className="fpSideCard">
              <h3>Existing Assignments</h3>

              <div className="fpList" style={{ marginTop: 14 }}>
                {assignments.length > 0 ? (
                  assignments.map((item) => (
                    <div className="fpItem" key={item.id}>
                      <div className="fpItemTop">
                        <div className="fpItemTitle">{item.title}</div>
                        <span className={`fpBadge ${item.status === "Pending" ? "warn" : "good"}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="fpItemSub">
                        {item.course_code} • Due {item.due_date} • {item.marks} marks
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="fpNote">No assignments created yet.</div>
                )}
              </div>

              <div className="fpNote">
                Published assignments will be visible to students enrolled in that course.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}