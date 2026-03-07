import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./studentLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter email and password.");
      return;
    }

    if (email === "admin@smartedu.com" && password === "admin123") {
      localStorage.setItem("role", "admin");
      localStorage.setItem("userName", "Admin");
      navigate("/admin/dashboard");
    } else {
      setErrorMsg("Invalid admin credentials.");
    }
  };

  return (
    <div className="slPage">
      <div className="slCard">
        <div className="slLeft">
          <h2 className="slTitle">Admin Login</h2>
          <p className="slSub">Enter admin credentials to continue</p>

          <Link className="slBack" to="/">
            ← Back to role selection
          </Link>
        </div>

        <form className="slForm" onSubmit={handleSubmit}>
          {errorMsg ? (
            <div className="slError" role="alert">
              {errorMsg}
            </div>
          ) : null}

          <label className="slLabel">Email Address</label>
          <input
            className="slInput"
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="slLabel">Password</label>
          <input
            className="slInput"
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="slBtn" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}