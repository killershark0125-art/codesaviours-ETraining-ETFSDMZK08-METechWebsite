require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Service = require('../models/Service');
const Course = require('../models/Course');


const services = [
  {
    title: 'Electrical Engineering',
    slug: 'electrical-engineering',
    icon: 'electrical',
    shortText: 'Electrical engineering consultancy for residential, commercial and industrial projects.',
    order: 1,
  },
  {
    title: 'Solar PV',
    slug: 'solar-pv',
    icon: 'solar',
    shortText: 'Solar photovoltaic system design and consultancy.',
    order: 2,
  },
  {
    title: 'Battery Energy Storage Systems (BESS)',
    slug: 'bess',
    icon: 'battery',
    shortText: 'Battery energy storage system consultancy and integration.',
    order: 3,
  },
  {
    title: 'EV Charging',
    slug: 'ev-charging',
    icon: 'ev',
    shortText:
      'Charger infrastructure, load assessment, grid upgrades, BESS and solar PV integration, and energy management.',
    order: 4,
  },
  {
    title: 'Architecture and Building Design',
    slug: 'architecture-building-design',
    icon: 'architecture',
    shortText: 'Architectural and building design services.',
    order: 5,
  },
  {
    title: 'Civil and Structural Engineering',
    slug: 'civil-structural-engineering',
    icon: 'civil',
    shortText: 'Civil and structural engineering consultancy.',
    order: 6,
  },
];

// No fee, duration or schedule: those are not confirmed yet.
const course = {
  title: 'Online Solar Design Training Program',
  slug: 'online-solar-design-training',
  tools: ['PVsyst', 'SketchUp'],
};

const seed = async () => {
  try {
    await connectDB();

    for (const item of services) {
      const exists = await Service.findOne({ slug: item.slug });
      if (exists) {
        console.log(`Skipped service (already exists): ${item.slug}`);
      } else {
        await Service.create(item);
        console.log(`Created service: ${item.slug}`);
      }
    }

    const courseExists = await Course.findOne({ slug: course.slug });
    if (courseExists) {
      console.log(`Skipped course (already exists): ${course.slug}`);
    } else {
      await Course.create(course);
      console.log(`Created course: ${course.slug}`);
    }

    console.log('Seeding finished.');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();