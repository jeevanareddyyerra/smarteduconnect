import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { getJson, postForm } from "../api";
import "./facultyPages.css";

export default function AdminCourses() {
  const userName = localStorage.getItem("userName") || "Admin";

  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [department, setDepartment] = useState("");
  const [credits, setCredits] = useState(4);
  const [facultyId, setFacultyId] = useState("");

  const [assignCourseCode, setAssignCourseCode] = useState("");
  const [assignFacultyId, setAssignFacultyId] = useState("");
  const [assignRollNumber, setAssignRollNumber] = useState("");

  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    setMessage("");

    try {
      const data = await getJson("/jsp/getAllCourses.jsp");
      if (data.ok) {
        setCourses(data.items || []);
      } else {
        setMessage(data.message || "Failed to load courses");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to load courses");
    }
  }

  async function handleAddCourse() {
    try {
      const data = await postForm("/jsp/addCourse.jsp", {
        course_code: courseCode,
        course_name: courseName,
        department,
        credits,
        faculty_id: facultyId,
      });

      if (data.ok) {
        setMessage("Course added successfully");
        setCourseCode("");
        setCourseName("");
        setDepartment("");
        setCredits(4);
        setFacultyId("");
        loadCourses();
      } else {
        setMessage(data.message || "Failed to add course");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to add course");
    }
  }

  async function handleAssignFaculty() {
    try {
      const data = await postForm("/jsp/assignCourseToFaculty.jsp", {
        faculty_id: assignFacultyId,
        course_code: assignCourseCode,
      });

      setMessage(data.message || "Faculty assignment completed");
    } catch (err) {
      console.error(err);
      setMessage("Failed to assign faculty");
    }
  }

  async function handleAssignStudent() {
    try {
      const data = await postForm("/jsp/assignCourseToStudent.jsp", {
        roll_number: assignRollNumber,
        course_code: assignCourseCode,
      });

      setMessage(data.message || "Student assignment completed");
    } catch (err) {
      console.error(err);
      setMessage("Failed to assign student");
    }
  }

  return (
    <div className="fpLayout">
      <Sidebar active="Courses" role="admin" />
      <div className="fpMain">
        <Topbar userName={userName} role="Admin" />

        <div className="fpContent">
          <div className="fpHeader">
            <div>
              <h2 className="fpTitle">Course Management</h2>
              <p className="fpSub">Configure courses and assign them to faculty and students.</p>
            </div>
          </div>

          {message && <div style={{ marginBottom: 16 }}>{message}</div>}

          <div className="fpGrid">
            <div className="fpCard">
              <div className="fpCardHead">
                <h3>Add Course</h3>
              </div>

              <div className="fpForm">
                <div>
                  <label className="fpLabel">Course Code</label>
                  <input className="fpInput" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
                </div>

                <div>
                  <label className="fpLabel">Course Name</label>
                  <input className="fpInput" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                </div>

                <div>
                  <label className="fpLabel">Department</label>
                  <input className="fpInput" value={department} onChange={(e) => setDepartment(e.target.value)} />
                </div>

                <div>
                  <label className="fpLabel">Credits</label>
                  <input className="fpInput" type="number" value={credits} onChange={(e) => setCredits(e.target.value)} />
                </div>

                <div>
                  <label className="fpLabel">Faculty ID</label>
                  <input className="fpInput" value={facultyId} onChange={(e) => setFacultyId(e.target.value)} />
                </div>
              </div>

              <div className="fpActionRow">
                <button className="fpBtn" onClick={handleAddCourse}>Add Course</button>
              </div>

              <hr style={{ margin: "20px 0" }} />

              <div className="fpCardHead">
                <h3>Assign Course</h3>
              </div>

              <div className="fpForm">
                <div>
                  <label className="fpLabel">Course Code</label>
                  <input className="fpInput" value={assignCourseCode} onChange={(e) => setAssignCourseCode(e.target.value)} />
                </div>

                <div>
                  <label className="fpLabel">Faculty ID</label>
                  <input className="fpInput" value={assignFacultyId} onChange={(e) => setAssignFacultyId(e.target.value)} />
                </div>

                <div>
                  <label className="fpLabel">Student Roll Number</label>
                  <input className="fpInput" value={assignRollNumber} onChange={(e) => setAssignRollNumber(e.target.value)} />
                </div>
              </div>

              <div className="fpActionRow">
                <button className="fpOutlineBtn" onClick={handleAssignFaculty}>
                  Assign to Faculty
                </button>
                <button className="fpBtn" onClick={handleAssignStudent}>
                  Assign to Student
                </button>
              </div>
            </div>

            <div className="fpSideCard">
              <h3>Course Catalog</h3>
              <div className="fpList" style={{ marginTop: 14 }}>
                {courses.map((course, index) => (
                  <div className="fpItem" key={index}>
                    <div className="fpItemTitle">{course.course_name}</div>
                    <div className="fpItemSub">
                      {course.course_code} • {course.department} • {course.credits} credits • Faculty ID: {course.faculty_id}
                    </div>
                  </div>
                ))}

                {courses.length === 0 && (
                  <div className="fpNote">No courses available.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}