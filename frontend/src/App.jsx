import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import WelcomeRole from "./pages/WelcomeRole.jsx";
import StudentLogin from "./pages/StudentLogin.jsx";
import StudentRegister from "./pages/StudentRegister.jsx";
import FacultyLogin from "./pages/FacultyLogin.jsx";
import FacultyRegister from "./pages/FacultyRegister.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

import StudentDashboard from "./pages/StudentDashboard.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import Courses from "./pages/Courses.jsx";
import Attendance from "./pages/Attendance.jsx";
import Assignments from "./pages/Assignments.jsx";
import Marks from "./pages/Marks.jsx";

import FacultyClasses from "./pages/FacultyClasses.jsx";
import FacultyAttendance from "./pages/FacultyAttendance.jsx";
import FacultyAssignments from "./pages/FacultyAssignments.jsx";
import FacultyMarks from "./pages/FacultyMarks.jsx";

import AdminStudents from "./pages/AdminStudents.jsx";
import AdminFaculty from "./pages/AdminFaculty.jsx";
import AdminCourses from "./pages/AdminCourses.jsx";
import AdminReports from "./pages/AdminReports.jsx";

function ProtectedRoute({ allowedRole, children }) {
  const savedRole = localStorage.getItem("role");

  if (!savedRole) {
    return <Navigate to="/" replace />;
  }

  if (savedRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<WelcomeRole />} />

        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />

        <Route path="/faculty/login" element={<FacultyLogin />} />
        <Route path="/faculty/register" element={<FacultyRegister />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/dashboard"
          element={
            <ProtectedRoute allowedRole="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute allowedRole="student">
              <Courses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRole="student">
              <Attendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assignments"
          element={
            <ProtectedRoute allowedRole="student">
              <Assignments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/marks"
          element={
            <ProtectedRoute allowedRole="student">
              <Marks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/classes"
          element={
            <ProtectedRoute allowedRole="faculty">
              <FacultyClasses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/attendance"
          element={
            <ProtectedRoute allowedRole="faculty">
              <FacultyAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/assignments"
          element={
            <ProtectedRoute allowedRole="faculty">
              <FacultyAssignments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/marks"
          element={
            <ProtectedRoute allowedRole="faculty">
              <FacultyMarks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/faculty"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminFaculty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminReports />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}