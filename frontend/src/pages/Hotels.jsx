import React, { useEffect, useState } from "react";
import API from "../api/client";
import { Link } from "react-router-dom";

// Correct imports
import images1 from "../assets/hotelImg/images1.jpeg";
import images2 from "../assets/hotelImg/images2.jpeg";
import images3 from "../assets/hotelImg/images3.jpeg";
import images4 from "../assets/hotelImg/images4.jpeg";
import images5 from "../assets/hotelImg/images5.jpeg";
import images6 from "../assets/hotelImg/images6.jpeg";
import images7 from "../assets/hotelImg/images7.jpeg";
import images8 from "../assets/hotelImg/images8.jpeg";
import images9 from "../assets/hotelImg/images9.jpeg";

const images = [
  images1, images2, images3,
  images4, images5, images6,
  images7, images8, images9
];

export default function Hotels(){
  const [q,setQ] = useState("");
  const [hotels,setHotels] = useState([]);

  async function fetchHotels(term=""){
    const res = await API.get(`/hotels${term ? '?q=' + term : ''}`);
    setHotels(res.data);
  }

  useEffect(()=>{ fetchHotels(); },[]);

  function onSearch(e){
    e.preventDefault();
    fetchHotels(q);
  }

  return (
    <div className="container">

      <form onSubmit={onSearch}>
        <input value={q} onChange={e=>setQ(e.target.value)} />
        <button>Search</button>
      </form>

      <div className="grid">
        {hotels.map((h, index) => (
          <div className="card" key={h._id}>

            <img 
              src={images[index % images.length]}
              style={{width:"100%", height:150, objectFit:"cover"}}
            />

            <div>{h.name}</div>
            <div>{h.city}</div>
            <div>₹{h.price}</div>

            {/* BOOK BUTTON */}
            <Link 
              to={`/book/${h._id}`} 
              className="small"
              style={{
                marginTop:10,
                padding:"6px 12px",
                background:"#1976d2",
                color:"#fff",
                borderRadius:6,
                textDecoration:"none",
                display:"inline-block"
              }}
            >
              Book
            </Link>

          </div>
        ))}
      </div>

    </div>
  );
}
