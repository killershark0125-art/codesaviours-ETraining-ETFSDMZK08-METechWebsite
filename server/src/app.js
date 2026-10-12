const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const healthRoutes = require('./routes/healthRoutes');
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
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ME Technologies API is running.',
  });
});

app.use('/api/health', healthRoutes);

// Keep these after the valid routes.
app.use(notFound);
app.use(errorHandler);

module.exports = app;
