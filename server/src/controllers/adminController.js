const Lead = require('../models/Lead');
const Enrollment = require('../models/Enrollment');
const Post = require('../models/Post');
const Project = require('../models/Project');

// GET /api/admin/dashboard  (admin)
const getDashboard = async (req, res) => {
  const [
    leadsTotal,
    leadsNew,
    enrollmentsTotal,
    enrollmentsPending,
    postsTotal,
    projectsTotal,
  ] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: 'new' }),
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ status: 'pending' }),
    Post.countDocuments(),
    Project.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      leads: { total: leadsTotal, new: leadsNew },
      enrollments: { total: enrollmentsTotal, pending: enrollmentsPending },
      posts: { total: postsTotal },
      projects: { total: projectsTotal },
    },
  });
};

module.exports = { getDashboard };