// debug-db.js (fixed)
const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }

  // show masked URI so you can confirm cluster name (password hidden)
  const masked = uri.replace(/:(\/\/.*:).*@/, ':$1***@');
  console.log('Connecting using:', masked);

  try {
    // connect with default/compatible options
    await mongoose.connect(uri); // don't pass keepAlive
    const db = mongoose.connection.db;
    console.log('Connected DB name:', db.databaseName);

    const collections = await db.listCollections().toArray();
    console.log('Collections in DB:', collections.map(c => c.name));

    // show users count if collection exists
    if (collections.some(c => c.name === 'users')) {
      const count = await db.collection('users').countDocuments();
      console.log('users count:', count);
      const one = await db.collection('users').findOne({}, { projection: { password: 0 }});
      console.log('one user (no password):', one);
    } else {
      console.log('No "users" collection found in this DB.');
    }

  } catch (err) {
    console.error('ERROR connecting/reading DB:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
