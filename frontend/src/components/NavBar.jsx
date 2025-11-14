import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <header className="nav">
      <div className="inner">
        <Link to="/" className="logo" style={{color:'white',textDecoration:'none'}}>MernHolidays</Link>

        <div>
          <Link to="/" style={{color:'white',textDecoration:'none',marginLeft:12}}>Explore</Link>
          {user?.role === "admin" && <Link to="/admin" style={{color:'white',textDecoration:'none',marginLeft:12}}>Admin</Link>}
          {user ? (
            <>
              <Link to="/mybookings" style={{color:'white',textDecoration:'none',marginLeft:12}}>My Bookings</Link>
              <button onClick={logout} className="btn" style={{marginLeft:12}}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn" style={{marginLeft:12}}>Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
