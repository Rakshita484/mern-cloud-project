import React, { useEffect, useState } from "react";
import API from "../api/client";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  async function fetchBookings() {
    try {
      const res = await API.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      alert("Failed to load bookings");
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function remove(id) {
  if (!window.confirm("Cancel booking?")) return;
  try {
    const res = await API.delete(`/bookings/${id}`);
    console.log('Delete booking res:', res);
    fetchBookings();
  } catch (err) {
    console.error("Delete booking error:", err);
    const status = err.response?.status;
    const data = err.response?.data;
    alert(`Cancel failed${status ? ' (HTTP ' + status + ')' : ''}\n${data?.msg || JSON.stringify(data) || err.message}`);
  }
}

  return (
    <div className="container">
      <h2>My bookings</h2>

      <div style={{ display: "grid", gap: 12 }}>
        {bookings.map((b) => (
          <div
            className="card"
            key={b._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>
                {b.hotel?.name || "Hotel"}
              </div>

              <div className="small">
                From: {new Date(b.from).toLocaleDateString()} • To:{" "}
                {new Date(b.to).toLocaleDateString()}
              </div>

              <div className="small">Guests: {b.guests}</div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700 }}>₹{b.total}</div>

              <button
                onClick={() => remove(b._id)}
                className="btn-ghost"
                style={{
                  marginTop: 8,
                  padding: "8px 10px",
                  background: "#ef4444",
                  color: "white",
                  borderRadius: 8,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="small">No bookings found.</div>
        )}
      </div>
    </div>
  );
}
