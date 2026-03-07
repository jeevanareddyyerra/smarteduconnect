import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function FacultyRegister() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", dept: "", password: "" });

  function submit(e) {
    e.preventDefault();
    nav("/faculty/login");
  }

  return (
    <div className="centerScreen">
      <div className="card authCard">
        <div className="authTitle">Faculty Register</div>
        <div className="authSub">Create a new faculty account</div>

        <form className="form" onSubmit={submit}>
          <label className="label">Full Name</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" />

          <label className="label">Email</label>
          <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter email" />

          <label className="label">Department</label>
          <input className="input" value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} placeholder="CSE / ECE / ..." />

          <label className="label">Password</label>
          <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create password" />

          <button className="primaryBtn" type="submit">Create Account</button>

          <div className="bottomLine">
            Already have an account? <Link to="/faculty/login">Login</Link>
          </div>

          <button type="button" className="linkBtn" onClick={() => nav("/")}>← Back to role selection</button>
        </form>
      </div>
    </div>
  );
}