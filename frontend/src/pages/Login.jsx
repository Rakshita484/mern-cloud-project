import React, { useState, useEffect } from "react";
import API from "../api/client";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Login.jsx (safe redirect on mount)
useEffect(() => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (token && user) {
    // redirect once and return — don't call setState here
    if (user.role === "admin") navigate("/admin");
    else navigate("/");
  }
  // intentionally empty deps so this runs only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  }

  return (
    <div className="container">
      <form className="form" onSubmit={submit}>
        <h2 style={{ marginTop: 0 }}>Sign in</h2>

        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn" type="submit">
          Login
        </button>

        <p className="small" style={{ marginTop: 12 }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
