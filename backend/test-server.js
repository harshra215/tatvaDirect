import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.json({ 
    message: 'Test server is running!',
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

console.log(`Starting server on ${HOST}:${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV}`);

app.listen(PORT, HOST, () => {
  console.log(`✅ Test server running on http://${HOST}:${PORT}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
});