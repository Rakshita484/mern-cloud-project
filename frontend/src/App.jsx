import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Hotels from "./pages/Hotels";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminHotels from "./pages/AdminHotels";
import MyBookings from "./pages/MyBookings";
import BookingForm from "./pages/BookingForm";

function isLoggedIn() {
  return !!localStorage.getItem("token");
}

function isAdmin() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user && user.role === "admin";
}

export default function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Hotels />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book/:id" element={isLoggedIn() ? <BookingForm /> : <Navigate to="/login" />} />

        <Route
          path="/admin"
          element={
            isLoggedIn() && isAdmin() ? (
              <AdminHotels />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/mybookings"
          element={
            isLoggedIn() ? <MyBookings /> : <Navigate to="/login" />
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
