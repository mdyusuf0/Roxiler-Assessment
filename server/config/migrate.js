/**
 * Database migration script
 * Reads schema.sql and runs it against the configured database.
 * Usage: node config/migrate.js
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const env = require('./env');

async function migrate() {
  // First, connect to default 'postgres' DB to ensure our target DB exists
  const adminPool = new Pool({
    host: env.db.host,
    port: env.db.port,
    database: 'postgres',
    user: env.db.user,
    password: env.db.password,
  });

  try {
    const dbExists = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [env.db.name]
    );

    if (dbExists.rowCount === 0) {
      await adminPool.query(`CREATE DATABASE "${env.db.name}"`);
      console.log(`✅ Database "${env.db.name}" created`);
    } else {
      console.log(`📦 Database "${env.db.name}" already exists`);
    }
  } finally {
    await adminPool.end();
  }

  // Now connect to the target DB and run schema
  const appPool = new Pool({
    host: env.db.host,
    port: env.db.port,
    database: env.db.name,
    user: env.db.user,
    password: env.db.password,
  });

  try {
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf-8');
    await appPool.query(sql);
    console.log('✅ Schema migration completed successfully');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await appPool.end();
  }
}

migrate();
