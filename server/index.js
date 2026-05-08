require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const fxRoute     = require('./routes/fx');
const marketRoute = require('./routes/market');
const newsRoute   = require('./routes/news');
const macroRoute  = require('./routes/macro');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve the terminal frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/fx',     fxRoute);
app.use('/api/market', marketRoute);
app.use('/api/news',   newsRoute);
app.use('/api/macro',  macroRoute);

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Catch-all: serve index.html for any non-API route ─────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: err.message });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n📊 Anfossi Terminal running at http://localhost:${PORT}\n`);
});
