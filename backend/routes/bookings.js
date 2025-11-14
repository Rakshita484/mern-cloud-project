// backend/routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const auth = require('../middleware/auth');

// POST create booking (user)
router.post('/', auth, async (req, res) => {
  try {
    const { hotel: hotelId, from, to, guests } = req.body;
    if (!hotelId || !from || !to || !guests) return res.status(400).json({ msg: 'Missing booking fields' });

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ msg: 'Hotel not found' });

    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (isNaN(fromDate) || isNaN(toDate)) return res.status(400).json({ msg: 'Invalid date format' });
    if (toDate <= fromDate) return res.status(400).json({ msg: 'Check-out must be after check-in' });

    const msPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((toDate - fromDate) / msPerDay);
    const numGuests = Number(guests) || 1;
    const total = (hotel.price || 0) * nights * numGuests;

    const newBooking = new Booking({
      user: req.user.id,
      hotel: hotelId,
      from: fromDate,
      to: toDate,
      total,
      guests: numGuests
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET user bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('hotel');
    res.json(bookings);
  } catch (err) {
    console.error('Get bookings error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE booking (owner or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('[BOOKING DELETE] req.user:', req.user, 'bookingId:', req.params.id);
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    const ownerId = String(booking.user);
    const requesterId = String(req.user.id);
    console.log('[BOOKING DELETE] ownerId:', ownerId, 'requesterId:', requesterId, 'requesterRole:', req.user.role);

    if (ownerId !== requesterId && req.user.role !== 'admin') {
      console.warn('[BOOKING DELETE] Not authorized:', requesterId);
      return res.status(403).json({ msg: 'Not authorized to delete this booking' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    console.log('[BOOKING DELETE] deleted:', req.params.id);
    return res.json({ msg: 'Booking deleted' });
  } catch (err) {
    console.error('[BOOKING DELETE] error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
