import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import universityRoutes from './routes/universityRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import industryRoutes from './routes/industryRoutes.js';
import governmentRoutes from './routes/governmentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();

// Connect Database


// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://triveni-sih-2026.netlify.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
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
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/industry', industryRoutes);
app.use('/api/dashboard', governmentRoutes);
app.use('/api/notifications', notificationRoutes);

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

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
