// backend/routes/hotels.js
const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const auth = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');

// GET /api/hotels?q=searchTerm
router.get('/', async (req, res) => {
  try {
    const q = req.query.q;
    let filter = {};
    if (q) {
      const regex = new RegExp(q, 'i');
      filter = { $or: [{ name: regex }, { city: regex }, { description: regex }] };
    }
    const hotels = await Hotel.find(filter).limit(50);
    res.json(hotels);
  } catch (err) {
    console.error('Hotels GET error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/hotels/:id
router.get('/:id', async (req, res) => {
  try {
    const h = await Hotel.findById(req.params.id);
    if (!h) return res.status(404).json({ msg: 'Hotel not found' });
    res.json(h);
  } catch (err) {
    console.error('Get hotel by id error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/hotels (admin only)
router.post('/', auth, adminCheck, async (req, res) => {
  try {
    const { name, city, price } = req.body;
    if (!name || !city || price === undefined) return res.status(400).json({ msg: 'Missing required fields' });
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json(hotel);
  } catch (err) {
    console.error('Create hotel error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/hotels/:id (admin only) — replace existing delete handler
router.delete('/:id', auth, adminCheck, async (req, res) => {
  try {
    console.log('[HOTEL DELETE] req.user:', req.user, 'hotelId:', req.params.id);
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ msg: 'Hotel not found' });

    await Hotel.findByIdAndDelete(req.params.id);
    console.log('[HOTEL DELETE] deleted:', req.params.id);
    return res.json({ msg: 'Hotel deleted' });
  } catch (err) {
    console.error('[HOTEL DELETE] error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
