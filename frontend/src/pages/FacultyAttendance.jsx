import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import { getJson, postForm } from "../api";
import "./facultyPages.css";

export default function FacultyAttendance() {
  const userName = localStorage.getItem("userName") || "Faculty";
  const facultyId = localStorage.getItem("linked_id") || "";

  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadFacultyCourses();
  }, [facultyId]);

  useEffect(() => {
    if (selectedCourse) {
      loadStudents(selectedCourse);
    } else {
      setStudents([]);
    }
  }, [selectedCourse]);

  async function loadFacultyCourses() {
    setMessage("");

    if (!facultyId) {
      setMessage("Faculty ID not found. Please log in again.");
      return;
    }

    try {
      const data = await getJson(
        `/jsp/getFacultyCourses.jsp?faculty_id=${encodeURIComponent(facultyId)}`
      );

      if (data.ok) {
        const items = data.items || [];
        setCourseOptions(items);
        if (items.length > 0) {
          setSelectedCourse(items[0].course_code);
        }
      } else {
        setMessage(data.message || "Failed to load faculty courses");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to load faculty courses");
    }
  }

  async function loadStudents(courseCode) {
    setMessage("");

    try {
      const data = await getJson(
        `/jsp/getStudentsByCourse.jsp?course_code=${encodeURIComponent(courseCode)}`
      );

      if (data.ok) {
        const mapped = (data.items || []).map((s) => ({
          roll: s.roll_number,
          name: s.name,
          status: "Present",
        }));
        setStudents(mapped);
      } else {
        setMessage(data.message || "Failed to load students");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to load students");
    }
  }

  const updateStatus = (roll, value) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.roll === roll ? { ...student, status: value } : student
      )
    );
  };

  const summary = useMemo(() => {
    const total = students.length;
    const present = students.filter((s) => s.status === "Present").length;
    const absent = total - present;
    const percent = total ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, percent };
  }, [students]);

  async function saveAttendance() {
    if (!selectedCourse || students.length === 0) {
      setMessage("No course or students found.");
      return;
    }

    try {
      for (const student of students) {
        await postForm("/jsp/markAttendance.jsp", {
          roll_number: student.roll,
          course_code: selectedCourse,
          date: selectedDate,
          status: student.status,
        });
      }

      setMessage("Attendance saved successfully");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save attendance");
    }
  }

  return (
    <div className="fpLayout">
      <Sidebar active="Attendance" role="faculty" />

      <div className="fpMain">
        <Topbar userName={userName} role="Faculty" />

        <div className="fpContent">
          <div className="fpHeader">
            <div>
              <h2 className="fpTitle">Attendance Management</h2>
              <p className="fpSub">Mark attendance for your students</p>
            </div>

            <div className="fpActions">
              <select
                className="fpSelect"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courseOptions.map((course) => (
                  <option key={course.course_code} value={course.course_code}>
                    {course.course_code}
                  </option>
                ))}
              </select>

              <input
                className="fpDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

              <button className="fpBtn" onClick={saveAttendance}>
                Save Attendance
              </button>
            </div>
          </div>

          {message && (
            <div style={{ marginBottom: 15, fontWeight: 500 }}>
              {message}
            </div>
          )}

          <div className="fpStats">
            <StatCard
              label="Present"
              value={`${summary.present}`}
              badge="Marked"
              sub="Students"
              progress={summary.percent}
            />
            <StatCard
              label="Absent"
              value={`${summary.absent}`}
              badge="Today"
              sub="Students"
              progress={summary.total ? (summary.absent / summary.total) * 100 : 0}
            />
            <StatCard
              label="Attendance %"
              value={`${summary.percent}%`}
              badge="Overall"
              sub={selectedCourse || "Course"}
              progress={summary.percent}
            />
          </div>

          <div className="fpCard">
            <div className="fpCardHead">
              <h3>Student Attendance Sheet</h3>
              <span className="fpSmall">{students.length} students</span>
            </div>

            <div className="fpTableWrap">
              <table className="fpTable">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student.roll}>
                      <td className="fpMono">{student.roll}</td>
                      <td className="fpStrong">{student.name}</td>
                      <td>
                        <select
                          className="fpSelect"
                          value={student.status}
                          onChange={(e) => updateStatus(student.roll, e.target.value)}
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </td>
                    </tr>
                  ))}

                  {students.length === 0 && (
                    <tr>
                      <td colSpan="3" className="fpEmpty">
                        No students available for this course.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}