import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/client";

export default function BookingForm(){
  const { id } = useParams(); // hotel id
  const [hotel, setHotel] = useState(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [guests, setGuests] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get(`/hotels/${id}`);
        setHotel(res.data);
      } catch (err) {
        alert('Failed to load hotel');
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    // update total whenever from/to/guests or hotel changes
    if (!hotel || !from || !to) { setTotal(0); return; }
    const d1 = new Date(from);
    const d2 = new Date(to);
    if (isNaN(d1) || isNaN(d2) || d2 <= d1) { setTotal(0); return; }
    const msPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((d2 - d1) / msPerDay);
    const t = (hotel.price || 0) * nights * Number(guests || 1);
    setTotal(t);
  }, [hotel, from, to, guests]);

  async function submit(e){
    e.preventDefault();
    try {
      const payload = { hotel: id, from, to, guests };
      const res = await API.post('/bookings', payload);
      alert('Booking confirmed!');
      navigate('/mybookings');
    } catch (err) {
      alert(err.response?.data?.msg || 'Booking failed');
      console.error(err);
    }
  }

  if (!hotel) return <div className="container"><div className="small">Loading hotel...</div></div>;

  return (
    <div className="container">
      <h2>Book: {hotel.name}</h2>
      <div className="card" style={{marginBottom:12}}>
        <div className="hotel-meta">{hotel.city} • ₹{hotel.price} per night</div>
        <p>{hotel.description}</p>
      </div>

      <form className="form" onSubmit={submit}>
        <label className="small">Check-in</label>
        <input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        <label className="small">Check-out</label>
        <input className="input" type="date" value={to} onChange={e=>setTo(e.target.value)} />
        <label className="small">Guests</label>
        <input className="input" type="number" min="1" value={guests} onChange={e=>setGuests(e.target.value)} />
        <div style={{marginTop:8}}>Total: <strong>₹{total}</strong></div>
        <button className="btn" type="submit" style={{marginTop:10}}>Confirm booking</button>
      </form>
    </div>
  );
}
