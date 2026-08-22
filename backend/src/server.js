import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedUsers } from './seeders/seed.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for credentials (HttpOnly cookies)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Ajaia Docs API' });
});

// API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Server Error]', err);
  return res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start Server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(async () => {
    await seedUsers();
    app.listen(PORT, () => {
      console.log(`[Ajaia Docs Server] Running on http://localhost:${PORT}`);
    });
  });
}

export default app;
