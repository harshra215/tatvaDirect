import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Test server is running!',
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    mongodb: process.env.MONGODB_URI ? 'Configured' : 'Not configured'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'Tatva Direct API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

console.log(`🚀 Starting test server...`);
console.log(`📍 Host: ${HOST}`);
console.log(`🔌 Port: ${PORT}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV}`);

const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Test server running on http://${HOST}:${PORT}`);
  console.log(`🏥 Health check: http://${HOST}:${PORT}/health`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});