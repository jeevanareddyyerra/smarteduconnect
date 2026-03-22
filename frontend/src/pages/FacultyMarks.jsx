import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import { getJson, postForm } from "../api";
import "./facultyPages.css";

export default function FacultyMarks() {
  const userName = localStorage.getItem("userName") || "Faculty";
  const facultyId = localStorage.getItem("linked_id") || "";

  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [examType, setExamType] = useState("mid");
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadFacultyCourses();
  }, [facultyId]);

  useEffect(() => {
    if (selectedCourse) {
      loadStudentsAndMarks(selectedCourse, examType);
    } else {
      setRows([]);
    }
  }, [selectedCourse, examType]);

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

  async function loadStudentsAndMarks(courseCode, exam) {
    setMessage("");

    try {
      const studentsRes = await getJson(
        `/jsp/getStudentsByCourse.jsp?course_code=${encodeURIComponent(courseCode)}`
      );

      const marksRes = await getJson(
        `/jsp/getMarksByCourse.jsp?course_code=${encodeURIComponent(courseCode)}&exam_type=${encodeURIComponent(exam)}`
      );

      if (!studentsRes.ok) {
        setMessage(studentsRes.message || "Failed to load students");
        return;
      }

      const students = studentsRes.items || [];
      const marks = marksRes.ok ? marksRes.items || [] : [];

      const markMap = {};
      marks.forEach((m) => {
        markMap[m.roll_number] = m.score;
      });

      const merged = students.map((s) => ({
        roll: s.roll_number,
        name: s.name,
        score: markMap[s.roll_number] ?? 0,
      }));

      setRows(merged);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load marks data");
    }
  }

  const updateScore = (roll, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.roll === roll ? { ...row, score: Number(value) } : row
      )
    );
  };

  const stats = useMemo(() => {
    const total = rows.length;
    const avg = total
      ? Math.round(rows.reduce((sum, row) => sum + Number(row.score || 0), 0) / total)
      : 0;
    const highest = total ? Math.max(...rows.map((row) => Number(row.score || 0))) : 0;
    return { total, avg, highest };
  }, [rows]);

  async function saveMarks() {
    if (!selectedCourse || rows.length === 0) {
      setMessage("No course or students found.");
      return;
    }

    try {
      for (const row of rows) {
        await postForm("/jsp/saveMarks.jsp", {
          roll_number: row.roll,
          course_code: selectedCourse,
          exam_type: examType,
          score: row.score,
        });
      }

      setMessage("Marks saved successfully");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save marks");
    }
  }

  return (
    <div className="fpLayout">
      <Sidebar active="Marks" role="faculty" />

      <div className="fpMain">
        <Topbar userName={userName} role="Faculty" />

        <div className="fpContent">
          <div className="fpHeader">
            <div>
              <h2 className="fpTitle">Marks Upload</h2>
              <p className="fpSub">Enter student marks</p>
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

              <select
                className="fpSelect"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
              >
                <option value="mid">Midterm</option>
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz</option>
                <option value="semester">Semester</option>
              </select>

              <button className="fpBtn" onClick={saveMarks}>
                Save Marks
              </button>
            </div>
          </div>

          {message && <div style={{ marginBottom: 15, fontWeight: 500 }}>{message}</div>}

          <div className="fpStats">
            <StatCard
              label="Students"
              value={`${stats.total}`}
              badge="Loaded"
              sub="Current List"
              progress={Math.min(stats.total * 20, 100)}
            />
            <StatCard
              label="Average Marks"
              value={`${stats.avg}`}
              badge="Class Avg"
              sub={examType}
              progress={stats.avg}
            />
            <StatCard
              label="Highest Score"
              value={`${stats.highest}`}
              badge="Top"
              sub={selectedCourse || "Course"}
              progress={stats.highest}
            />
          </div>

          <div className="fpCard">
            <div className="fpCardHead">
              <h3>Marks Entry Table</h3>
              <span className="fpSmall">{rows.length} students</span>
            </div>

            <div className="fpTableWrap">
              <table className="fpTable">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Marks</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => (
                    <tr key={row.roll}>
                      <td className="fpMono">{row.roll}</td>
                      <td className="fpStrong">{row.name}</td>
                      <td>
                        <input
                          className="fpInput"
                          type="number"
                          min="0"
                          max="100"
                          value={row.score}
                          onChange={(e) => updateScore(row.roll, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}

                  {rows.length === 0 && (
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