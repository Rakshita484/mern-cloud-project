// createAdmin.js  (run only locally)
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');

const mongo = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_local';
const ADMIN_EMAIL = process.argv[2] || 'admin@local';
const ADMIN_PW = process.argv[3] || 'admin123';

(async () => {
  try {
    await mongoose.connect(mongo);
    console.log('Connected to mongo');

    let user = await User.findOne({ email: ADMIN_EMAIL });
    if (user && user.role === 'admin') {
      console.log('Admin already exists — updating password...');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(ADMIN_PW, salt);
      await user.save();
      console.log('Admin password updated for', ADMIN_EMAIL);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(ADMIN_PW, salt);

    user = new User({ name: 'Admin', email: ADMIN_EMAIL, password: hash, role: 'admin' });
    await user.save();
    console.log('Admin user created:', ADMIN_EMAIL, 'password:', ADMIN_PW);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
