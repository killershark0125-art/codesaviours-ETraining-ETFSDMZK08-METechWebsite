require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Project = require('../models/Project');
const Post = require('../models/Post');

const note = 'Demonstration entry for API testing. Not real company content.';

const projects = [
  { title: 'Sample Project A (test data)', slug: 'sample-project-a', sector: 'residential', systemType: 'solar-pv', description: note, isSample: true },
  { title: 'Sample Project B (test data)', slug: 'sample-project-b', sector: 'commercial', systemType: 'ev-charging', description: note, isSample: true },
];

const posts = [
  { title: 'Sample Article One (test data)', slug: 'sample-article-one', category: 'solar', content: note, isPublished: true, publishedAt: new Date() },
  { title: 'Sample Article Two (test data)', slug: 'sample-article-two', category: 'ev-charging', content: note, isPublished: true, publishedAt: new Date() },
  { title: 'Sample Draft Article (test data)', slug: 'sample-draft-article', category: 'solar', content: note, isPublished: false },
];

const run = async () => {
  try {
    await connectDB();

    if (process.argv[2] === 'remove') {
      await Project.deleteMany({ slug: { $in: projects.map((p) => p.slug) } });
      await Post.deleteMany({ slug: { $in: posts.map((p) => p.slug) } });
      console.log('Sample data removed.');
    } else {
      for (const p of projects) {
        if (!(await Project.exists({ slug: p.slug }))) await Project.create(p);
      }
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