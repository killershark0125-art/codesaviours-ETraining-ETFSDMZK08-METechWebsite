require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Project = require('../models/Project');
const Post = require('../models/Post');

const note = 'Demonstration entry for API testing. Not real company content.';

// Capacities and text are placeholders. City coordinates are real city locations.
const sampleProject = (slug, title, extra) => ({
  slug,
  title,
  isSample: true,
  description: note,
  problem: 'Test problem text. Not real company content.',
  solution: 'Test solution text. Not real company content.',
  result: 'Test result text. Not real company content.',
  ...extra,
});

const projects = [
  sampleProject('sample-project-a', 'Sample Project A (test data)', {
    sector: 'commercial', systemType: 'solar-pv', city: 'Lahore', province: 'Punjab',
    latitude: 31.5204, longitude: 74.3587, capacityValue: 100, capacityUnit: 'kW', capacity: '100 kW',
  }),
  sampleProject('sample-project-b', 'Sample Project B (test data)', {
    sector: 'ev', systemType: 'ev-charging', city: 'Lahore', province: 'Punjab',
    latitude: 31.5497, longitude: 74.3436, capacityValue: 50, capacityUnit: 'kW', capacity: '50 kW',
  }),
  sampleProject('sample-project-c', 'Sample Project C (test data)', {
    sector: 'agriculture', systemType: 'solar-pv', city: 'Multan', province: 'Punjab',
    latitude: 30.1575, longitude: 71.5249, capacityValue: 20, capacityUnit: 'kW', capacity: '20 kW',
  }),
  sampleProject('sample-project-d', 'Sample Project D (test data)', {
    sector: 'residential', systemType: 'solar-bess', city: 'Karachi', province: 'Sindh',
    latitude: 24.8607, longitude: 67.0011, capacityValue: 10, capacityUnit: 'kW', capacity: '10 kW',
  }),
  sampleProject('sample-project-draft', 'Sample Draft Project (test data)', {
    sector: 'industrial', systemType: 'bess', city: 'Islamabad', province: 'Islamabad Capital Territory',
    latitude: 33.6844, longitude: 73.0479, capacityValue: 500, capacityUnit: 'kWh', capacity: '500 kWh',
    isPublished: false,
  }),
];

const posts = [
  { title: 'Sample Article One (test data)', slug: 'sample-article-one', category: 'solar', content: note, isPublished: true, publishedAt: new Date() },
  { title: 'Sample Article Two (test data)', slug: 'sample-article-two', category: 'ev-charging', content: note, isPublished: true, publishedAt: new Date() },
  { title: 'Sample Draft Article (test data)', slug: 'sample-draft-article', category: 'solar', content: note, isPublished: false },
];

const run = async () => {
  try {
    await connectDB();

    const projectSlugs = projects.map((p) => p.slug);
    const postSlugs = posts.map((p) => p.slug);

    if (process.argv[2] === 'remove') {
      await Project.deleteMany({ slug: { $in: projectSlugs } });
      await Post.deleteMany({ slug: { $in: postSlugs } });
      console.log('Sample data removed.');
    } else {
      // Replace any older copy so the new fields are present.
      await Project.deleteMany({ slug: { $in: projectSlugs } });
      for (const p of projects) await Project.create(p);
      for (const p of posts) {
        if (!(await Post.exists({ slug: p.slug }))) await Post.create(p);
      }
      console.log('Sample data added.');
    }
  } catch (error) {
    console.error('Failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();