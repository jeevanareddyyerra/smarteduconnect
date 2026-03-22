import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { postForm, getJson } from "../api";
import "./dashboard.css";

export default function AdminStudents() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Admin";
  const role = localStorage.getItem("role");

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    roll_number: "",
    name: "",
    department: "",
    year: "",
    email: "",
  });

  const [editingRoll, setEditingRoll] = useState("");

  useEffect(() => {
    if (role !== "admin") {
      navigate("/", { replace: true });
      return;
    }
    loadStudents();
  }, [role, navigate]);

  async function loadStudents() {
    try {
      setLoading(true);
      const data = await getJson("/jsp/listStudents.jsp");
      if (data.ok) {
        setStudents(data.items || []);
      } else {
        setMessage(data.message || "Failed to load students");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setForm({
      roll_number: "",
      name: "",
      department: "",
      year: "",
      email: "",
    });
    setEditingRoll("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      let data;

      if (editingRoll) {
        data = await postForm("/jsp/updateStudent.jsp", form);
      } else {
        data = await postForm("/jsp/addStudent.jsp", form);
      }

      if (data.ok) {
        setMessage(data.message || "Success");
        resetForm();
        loadStudents();
      } else {
        setMessage(data.message || "Operation failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  }

  function handleEdit(student) {
    setForm({
      roll_number: student.roll_number,
      name: student.name,
      department: student.department,
      year: String(student.year),
      email: student.email || "",
    });
    setEditingRoll(student.roll_number);
  }

  async function handleDelete(rollNumber) {
    const yes = window.confirm(`Delete student ${rollNumber}?`);
    if (!yes) return;

    try {
      const data = await postForm("/jsp/deleteStudent.jsp", {
        roll_number: rollNumber,
      });

      if (data.ok) {
        setMessage(data.message || "Deleted successfully");
        loadStudents();
      } else {
        setMessage(data.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  }

  return (
    <div className="dbLayout">
      <Sidebar active="Students" role="admin" />

      <div className="dbMain">
        <Topbar userName={userName} role="Admin" />

        <div className="dbContent">
          <div className="dbHeader">
            <div>
              <div className="dbWelcome">Manage Students</div>
              <div className="dbSub">
                Add, update, and delete student records
              </div>
            </div>
          </div>

          <div className="dbGridBottom" style={{ gridTemplateColumns: "1fr" }}>
            <div className="dbCard">
              <div className="dbCardHead">
                <h3>{editingRoll ? "Edit Student" : "Add Student"}</h3>
              </div>

              {message ? (
                <div style={{ marginBottom: "16px", fontWeight: 500 }}>
                  {message}
                </div>
              ) : null}

              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gap: "12px" }}>
                  <input
                    type="text"
                    name="roll_number"
                    placeholder="Roll Number"
                    value={form.roll_number}
                    onChange={handleChange}
                    required
                    disabled={!!editingRoll}
                    style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ccc" }}
                  />

                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ccc" }}
                  />

                  <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={form.department}
                    onChange={handleChange}
                    required
                    style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ccc" }}
                  />

                  <input
                    type="number"
                    name="year"
                    placeholder="Year"
                    value={form.year}
                    onChange={handleChange}
                    required
                    style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ccc" }}
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ccc" }}
                  />

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      type="submit"
                      style={{
                        padding: "12px 18px",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                    >
                      {editingRoll ? "Update Student" : "Add Student"}
                    </button>

                    {editingRoll ? (
                      <button
                        type="button"
                        onClick={resetForm}
                        style={{
                          padding: "12px 18px",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </div>
              </form>
            </div>

            <div className="dbCard">
              <div className="dbCardHead">
                <h3>Student Records</h3>
              </div>

              {loading ? (
                <p>Loading students...</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={thStyle}>Roll Number</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Department</th>
                        <th style={thStyle}>Year</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={tdStyle}>
                            No students found
                          </td>
                        </tr>
                      ) : (
                        students.map((student) => (
                          <tr key={student.roll_number}>
                            <td style={tdStyle}>{student.roll_number}</td>
                            <td style={tdStyle}>{student.name}</td>
                            <td style={tdStyle}>{student.department}</td>
                            <td style={tdStyle}>{student.year}</td>
                            <td style={tdStyle}>{student.email}</td>
                            <td style={tdStyle}>
                              <button
                                onClick={() => handleEdit(student)}
                                style={actionBtnStyle}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(student.roll_number)}
                                style={{ ...actionBtnStyle, marginLeft: "8px" }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};

const actionBtnStyle = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};