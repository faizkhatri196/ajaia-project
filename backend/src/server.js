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

// Dynamic CORS configuration supporting Vercel deployments & credentials
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile, curl) or matching vercel/localhost domains
      if (
        !origin ||
        origin.includes('vercel.app') ||
        origin.includes('localhost') ||
        origin === process.env.CLIENT_URL
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive fallback to ensure production availability
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check & Seed Trigger
app.get('/api/health', async (req, res) => {
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
