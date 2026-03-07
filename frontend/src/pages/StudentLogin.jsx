import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./studentLogin.css";

export default function StudentLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("password", password);

      const response = await fetch(
        `${window.location.origin}/SmartEdu1/api/student/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        }
      );

      const xmlText = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "text/xml");

      const parseError = xml.getElementsByTagName("parsererror")[0];
      if (parseError) {
        setErrorMsg("Server returned an invalid response. Check Tomcat logs.");
        return;
      }

      const status = xml.getElementsByTagName("status")[0]?.textContent?.trim();

      if (status === "success") {
        const name =
          xml.getElementsByTagName("name")[0]?.textContent?.trim() || "Student";

        localStorage.setItem("role", "student");
        localStorage.setItem("userName", name);

        navigate("/student/dashboard");
      } else {
        const message =
          xml.getElementsByTagName("message")[0]?.textContent?.trim() ||
          "Login failed";
        setErrorMsg(message);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Server connection failed. Is Tomcat running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="slPage">
      <div className="slCard">
        <div className="slLeft">
          <h2 className="slTitle">Student Login</h2>
          <p className="slSub">Enter your credentials to access your account</p>

          <Link className="slBack" to="/">
            ← Back to role selection
          </Link>
        </div>

        <form className="slForm" onSubmit={onSubmit}>
          {errorMsg ? (
            <div className="slError" role="alert">
              {errorMsg}
            </div>
          ) : null}

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
            <button
              type="button"
              className="slLinkBtn"
              onClick={() => alert("Forgot password feature coming soon")}
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>

          <button className="slBtn" type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="slBottom">
            <span>Don’t have an account?</span>{" "}
            <Link className="slCreate" to="/student/register">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}