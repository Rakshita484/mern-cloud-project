// backend/models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  total: { type: Number, required: true },
  guests: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
