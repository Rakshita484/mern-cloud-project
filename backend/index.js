// backend/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan"); // optional but useful
require("dotenv").config(); // safe: this will only read local .env if present (we DO NOT commit .env)

const authRoutes = require("./routes/auth");
const hotelsRoutes = require("./routes/hotels");
const bookingsRoutes = require("./routes/bookings");

// Create express app
const app = express();

// --- Middlewares ---
app.use(express.json());            // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies
app.use(cookieParser());            // parse cookies
app.use(morgan("dev"));            // HTTP logging (dev); remove if not wanted

// CORS configuration
// If FRONTEND_URL is set in environment it will be used.
// For quick testing you can set FRONTEND_URL="true" to allow all origins (NOT recommended for prod).
// Robust CORS configuration
// Supports:
//  - FRONTEND_URL = "true"  -> allow any origin (testing)
//  - FRONTEND_URL = "https://your-vercel-app.vercel.app" -> allow that origin
//  - FRONTEND_URL = "https://a.vercel.app,https://b.example.com" -> allow either
const rawFrontend = process.env.FRONTEND_URL || "";
const frontendTrimmed = rawFrontend.trim();

let corsOptions = {
  origin: true,
  credentials: true
};

if (frontendTrimmed && frontendTrimmed.toLowerCase() !== "true") {
  const allowed = frontendTrimmed.split(",").map(s => s.trim()).filter(Boolean);

  if (allowed.length === 1) {
    // single origin
    corsOptions.origin = allowed[0];
  } else if (allowed.length > 1) {
    // multiple allowed origins
    corsOptions.origin = function (origin, callback) {
      // allow non-browser requests (curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowed.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy: origin not allowed"), false);
      }
    };
  } else {
    // fallback to allow all
    corsOptions.origin = true;
  }
} else if (frontendTrimmed.toLowerCase() === "true") {
  corsOptions.origin = true; // allow all origins (testing)
} else {
  corsOptions.origin = true; // default allow all
}

app.use(require("cors")(corsOptions));

// --- Connect to MongoDB ---
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI is not set in environment variables.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // do not exit here automatically; Render will show logs — you may want to process.exit(1) in some cases
  });

// --- Routes ---
// Mount your existing route files. Make sure these modules export express routers.
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelsRoutes);
app.use("/api/bookings", bookingsRoutes);

// optional: a quick healthcheck route
app.get("/api/ping", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Error handling middleware (simple)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
   