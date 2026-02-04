import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { boqRouter } from './routes/boq.js';
import { vendorRouter } from './routes/vendors.js';
import { substitutionRouter } from './routes/substitutions.js';
import { poRouter } from './routes/po.js';
import { authRouter } from './routes/auth.js';
import { profileRouter } from './routes/profile.js';
import { supplierRouter } from './routes/supplier.js';
import { dashboardRouter } from './routes/dashboard.js';
import { adminRouter } from './routes/admin.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB (don't block server startup)
connectDB().catch(err => {
  console.error('MongoDB connection failed, but server will continue:', err.message);
});

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Tatva Direct API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      admin: '/api/admin',
      dashboard: '/api/dashboard'
    }
  });
});

app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/supplier', supplierRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/admin', adminRouter);
app.use('/api/boq', boqRouter);
app.use('/api/vendors', vendorRouter);
app.use('/api/substitutions', substitutionRouter);
app.use('/api/po', poRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      status: 'error',
      message: `${field} already exists`
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expired'
    });
  }
  
  // Default error
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// Handle 404 routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

console.log(`🚀 Starting server...`);
console.log(`📍 Host: ${HOST}`);
console.log(`🔌 Port: ${PORT}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
console.log(`🗄️  MongoDB: ${process.env.MONGODB_URI ? '✅ Configured' : '❌ Not configured'}`);

const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server successfully running on http://${HOST}:${PORT}`);
  console.log(`🏥 Health check: http://${HOST}:${PORT}/api/health`);
  console.log(`📊 API docs: http://${HOST}:${PORT}/`);
});

server.on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
