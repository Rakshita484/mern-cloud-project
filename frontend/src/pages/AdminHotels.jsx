import React, { useEffect, useState } from "react";
import API from "../api/client";

export default function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({ name: "", city: "", description: "", price: "" });
  const [loading, setLoading] = useState(false);

  async function fetchHotels() {
    try {
      const res = await API.get("/hotels");
      setHotels(res.data);
    } catch (err) {
      console.error("Fetch hotels error:", err);
      alert("Failed to load hotels");
    }
  }

  useEffect(() => {
    fetchHotels();
  }, []);

  async function add(e) {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price) };
      setLoading(true);
      await API.post("/hotels", payload);
      setForm({ name: "", city: "", description: "", price: "" });
      await fetchHotels();
    } catch (err) {
      console.error("Add hotel error:", err);
      const status = err.response?.status;
      const data = err.response?.data;
      alert(`Add failed${status ? " (HTTP " + status + ")" : ""}\n${data?.msg || JSON.stringify(data) || err.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Safe, debug-friendly remove handler
  async function remove(id) {
    if (!window.confirm("Delete hotel?")) return;

    // quick client-side checks
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in. Please login as admin.");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || user.role !== "admin") {
      alert("Only admins can delete hotels. Please login with an admin account.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.delete(`/hotels/${id}`);
      console.log("Hotel delete response:", res.status, res.data);
      await fetchHotels();
      alert("Hotel deleted.");
    } catch (err) {
      console.error("Delete hotel error:", err);
      const status = err.response?.status;
      const data = err.response?.data;
      alert(`Delete failed${status ? " (HTTP " + status + ")" : ""}\n${data?.msg || JSON.stringify(data) || err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2>Manage Hotels</h2>

      <form className="form" onSubmit={add} style={{ display: "grid", gap: 8 }}>
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input className="input" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <textarea className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn" type="submit" disabled={loading}>{loading ? "Working..." : "Add Hotel"}</button>
      </form>

      <div style={{ marginTop: 16 }} className="grid">
        {hotels.map((h) => (
          <div className="card" key={h._id}>
            <div style={{ fontWeight: 700 }}>{h.name}</div>
            <div className="hotel-meta">{h.city}</div>
            <div className="hotel-row">
              <div>₹{h.price}</div>
              <button onClick={() => remove(h._id)} className="btn-ghost" style={{ background: "#ef4444", color: "white" }}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {hotels.length === 0 && <div className="small">No hotels yet.</div>}
      </div>
    </div>
  );
}
