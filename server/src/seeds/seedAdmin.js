require('dotenv').config();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error('ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set in server/.env');
    }

    if (ADMIN_PASSWORD.length < 10) {
      throw new Error('ADMIN_PASSWORD must be at least 10 characters');
    }

    await connectDB();

    const email = ADMIN_EMAIL.trim().toLowerCase();
    const exists = await User.findOne({ email });

    if (exists) {
      console.log('Admin already exists. Nothing changed.');
      return;
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      name: ADMIN_NAME,
      email,
      passwordHash,
      role: 'admin',
    });

    console.log(`Admin created: ${email}`);
  } catch (error) {
    console.error('Admin seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();