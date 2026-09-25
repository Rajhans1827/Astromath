import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDB } from './db.js';
import { ephemerisService } from './swisseph-service.js';
import authRoutes from './routes/auth.js';
import chartRoutes from './routes/chart.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database & Swiss Ephemeris
initDB();
ephemerisService.init().then(() => {
  console.log('🌌 Swiss Ephemeris WASM Engine Initialized successfully.');
});

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chart', chartRoutes);
app.use('/api/ai', aiRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'AstroMath AI SaaS',
    engine: 'Swiss Ephemeris WASM (Lahiri Ayanamsa)',
    brain: 'Google Gemini 3.8 Flash',
    timestamp: new Date().toISOString(),
  });
});

// Serve Frontend in Production
const clientDistPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`🚀 ASTROMATH SERVER IS RUNNING ON: http://localhost:${PORT}`);
  console.log(`📡 API Endpoints: /api/auth, /api/chart, /api/ai`);
  console.log(`🔮 Cloudflare & SQL Ready: SQLite WAL Mode Enabled`);
  console.log(`=============================================================\n`);
});
