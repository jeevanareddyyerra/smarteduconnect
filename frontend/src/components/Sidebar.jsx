import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar({ active = "Dashboard", role = "student" }) {
  const navigate = useNavigate();

  const itemClass = (name) => (active === name ? "sbItem active" : "sbItem");

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const menuByRole = {
    student: [
      { name: "Dashboard", path: "/student/dashboard" },
      { name: "Courses", path: "/courses" },
      { name: "Attendance", path: "/attendance" },
      { name: "Assignments", path: "/assignments" },
      { name: "Marks", path: "/marks" },
    ],
    faculty: [
      { name: "Dashboard", path: "/faculty/dashboard" },
      { name: "Classes", path: "/faculty/classes" },
      { name: "Attendance", path: "/faculty/attendance" },
      { name: "Assignments", path: "/faculty/assignments" },
      { name: "Marks", path: "/faculty/marks" },
    ],
    admin: [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Students", path: "/admin/students" },
      { name: "Faculty", path: "/admin/faculty" },
      { name: "Courses", path: "/admin/courses" },
      { name: "Reports", path: "/admin/reports" },
    ],
  };

  const menuItems = menuByRole[role] || menuByRole.student;

  return (
    <aside className="sb">
      <div className="sbBrand">
        <div className="sbLogo">🎓</div>
        <div className="sbName">SmartEduConnect</div>
      </div>

      <nav className="sbNav">
        {menuItems.map((item) => (
          <Link key={item.name} to={item.path} className={itemClass(item.name)}>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="sbBottom">
        <button className="sbLogout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}