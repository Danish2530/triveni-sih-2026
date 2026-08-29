const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load Environment Variables
dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Triveni Platform API',
    tagline: 'From Community Problems to Real Solutions (SIH 2026 PS 26043)',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/problems', require('./routes/problemRoutes'));
app.use('/api/universities', require('./routes/universityRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/industry', require('./routes/industryRoutes'));
app.use('/api/dashboard', require('./routes/governmentRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: `API Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Triveni Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});
