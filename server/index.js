const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/env');
const healthRoute = require('./routes/health');
const { errorHandler, sendResponse } = require('./middleware/errorHandler');

const app = express();

// ── Security ────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));

// ── Body parsing ────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ─────────────────────────────────────
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// ── Routes ──────────────────────────────────────
app.use('/api/health', healthRoute);

// ── 404 catch-all ───────────────────────────────
app.use((req, res) => {
  return sendResponse(res, 404, null, `Route not found: ${req.method} ${req.originalUrl}`);
});

// ── Global error handler (must be last) ─────────
app.use(errorHandler);

// ── Start server ────────────────────────────────
app.listen(env.port, () => {
  console.log(`\n🚀 Server running on http://localhost:${env.port}`);
  console.log(`   Environment: ${env.nodeEnv}`);
  console.log(`   Health check: http://localhost:${env.port}/api/health\n`);
});

module.exports = app;
