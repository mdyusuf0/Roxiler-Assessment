const { Pool } = require('pg');
const env = require('./env');

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }
  : {
      host: env.db.host,
      port: env.db.port,
      database: env.db.name,
      user: env.db.user,
      password: String(env.db.password || 'postgres'),
    };

const pool = new Pool(poolConfig);

// Log connection status once on startup
pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err);
  process.exit(1);
});

// Helper: run a single query
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
