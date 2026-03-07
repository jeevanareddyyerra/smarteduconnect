import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./studentLogin.css";   // reuse same css

export default function FacultyLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
 
    // Later connect backend
    navigate("/dashboard");
  };

  return (
    <div className="slPage">

      <div className="slCard">

        <div className="slLeft">
          <h2 className="slTitle">Faculty Login</h2>

          <p className="slSub">
            Enter your credentials to access your faculty account
          </p>

          <Link className="slBack" to="/">
            ← Back to role selection
          </Link>
        </div>

        <form className="slForm" onSubmit={handleSubmit}>

          <label className="slLabel">Email Address</label>

          <input
            className="slInput"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="slLabel">Password</label>

          <input
            className="slInput"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="slRow">
            <button className="slLinkBtn" type="button">
              Forgot Password?
            </button>
          </div>

          <button className="slBtn" type="submit">
            Sign In
          </button>

          <div className="slBottom">
            Don't have an account?{" "}
            <Link className="slCreate" to="/faculty/register">
              Create Account
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}