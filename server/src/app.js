const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const healthRoutes = require('./routes/healthRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const courseRoutes = require('./routes/courseRoutes');
const batchRoutes = require('./routes/batchRoutes');
const projectRoutes = require('./routes/projectRoutes');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Serve uploaded images when we implement image uploads.
// Helmet blocks other origins from embedding our files by default.
// The React app (port 5173) must be able to show uploaded images.
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirname, '../uploads'), { index: false })
);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ME Technologies API is running.',
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

// Keep these after the valid routes.
app.use(notFound);
app.use(errorHandler);

module.exports = app;
