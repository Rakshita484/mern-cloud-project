// backend/index.js
const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// debug: log incoming requests
app.use((req, res, next) => {
  console.log('[REQ]', req.method, req.originalUrl);
  next();
});

// health
app.get("/api/ping", (req, res) => res.json({ ok: true, time: new Date() }));
app.get("/api/hotels-debug", (req, res) => res.json({ ok: true, serverTime: new Date() }));

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mern_local";
mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// register routes and log if loaded
try {
  const authRouter = require('./routes/auth'); console.log('Loaded routes/auth');
  app.use('/api/auth', authRouter);

  const hotelsRouter = require('./routes/hotels'); console.log('Loaded routes/hotels');
  app.use('/api/hotels', hotelsRouter);

  const bookingsRouter = require('./routes/bookings'); console.log('Loaded routes/bookings');
  app.use('/api/bookings', bookingsRouter);
} catch (err) {
  console.warn("One or more route files not found or failed to load.");
  console.warn(err && err.stack || err);
}


// generic 404 for API
app.use('/api', (req, res) => res.status(404).json({ msg: 'API endpoint not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
