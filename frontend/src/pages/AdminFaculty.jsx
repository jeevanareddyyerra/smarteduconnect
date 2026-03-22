import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { postForm, getJson } from "../api";
import "./dashboard.css";

export default function AdminFaculty() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Admin";
  const role = localStorage.getItem("role");

  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    faculty_id: "",
    name: "",
    department: "",
    email: "",
    designation: "",
  });

  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    if (role !== "admin") {
      navigate("/", { replace: true });
      return;
    }
    loadFaculty();
  }, [role, navigate]);

  async function loadFaculty() {
    try {
      setLoading(true);
      const data = await getJson("/jsp/listFaculty.jsp");
      if (data.ok) {
        setFaculty(data.items || []);
      } else {
        setMessage(data.message || "Failed to load faculty");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load faculty");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setForm({
      faculty_id: "",
      name: "",
      department: "",
      email: "",
      designation: "",
    });
    setEditingId("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      let data;

      if (editingId) {
        data = await postForm("/jsp/updateFaculty.jsp", form);
      } else {
        data = await postForm("/jsp/addFaculty.jsp", form);
      }

      if (data.ok) {
        setMessage(data.message || "Success");
        resetForm();
        loadFaculty();
      } else {
        setMessage(data.message || "Operation failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  }

  function handleEdit(item) {
    setForm({
      faculty_id: String(item.faculty_id),
      name: item.name,
      department: item.department,
      email: item.email || "",
      designation: item.designation || "",
    });
    setEditingId(String(item.faculty_id));
  }

  async function handleDelete(facultyId) {
    const yes = window.confirm(`Delete faculty ${facultyId}?`);
    if (!yes) return;

    try {
      const data = await postForm("/jsp/deleteFaculty.jsp", {
        faculty_id: facultyId,
      });

      if (data.ok) {
        setMessage(data.message || "Deleted successfully");
        loadFaculty();
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
      <Sidebar active="Faculty" role="admin" />
      <div className="dbMain">
        <Topbar userName={userName} role="Admin" />

        <div className="dbContent">
          <div className="dbHeader">
            <div>
              <div className="dbWelcome">Manage Faculty</div>
              <div className="dbSub">
                Add, update, and delete faculty records
              </div>
            </div>
          </div>

          <div className="dbGridBottom" style={{ gridTemplateColumns: "1fr" }}>
            <div className="dbCard">
              <div className="dbCardHead">
                <h3>{editingId ? "Edit Faculty" : "Add Faculty"}</h3>
              </div>

              {message ? (
                <div style={{ marginBottom: "16px", fontWeight: 500 }}>
                  {message}
                </div>
              ) : null}

              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gap: "12px" }}>
                  <input
                    type="number"
                    name="faculty_id"
                    placeholder="Faculty ID"
                    value={form.faculty_id}
                    onChange={handleChange}
                    required
                    disabled={!!editingId}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={form.department}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    name="designation"
                    placeholder="Designation"
                    value={form.designation}
                    onChange={handleChange}
                    style={inputStyle}
                  />

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="submit" style={btnStyle}>
                      {editingId ? "Update Faculty" : "Add Faculty"}
                    </button>

                    {editingId ? (
                      <button type="button" onClick={resetForm} style={btnStyle}>
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </div>
              </form>
            </div>

            <div className="dbCard">
              <div className="dbCardHead">
                <h3>Faculty Records</h3>
              </div>

              {loading ? (
                <p>Loading faculty...</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Faculty ID</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Department</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Designation</th>
                        <th style={thStyle}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faculty.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={tdStyle}>
                            No faculty found
                          </td>
                        </tr>
                      ) : (
                        faculty.map((item) => (
                          <tr key={item.faculty_id}>
                            <td style={tdStyle}>{item.faculty_id}</td>
                            <td style={tdStyle}>{item.name}</td>
                            <td style={tdStyle}>{item.department}</td>
                            <td style={tdStyle}>{item.email}</td>
                            <td style={tdStyle}>{item.designation}</td>
                            <td style={tdStyle}>
                              <button onClick={() => handleEdit(item)} style={actionBtnStyle}>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.faculty_id)}
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

const inputStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
};

const btnStyle = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};

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