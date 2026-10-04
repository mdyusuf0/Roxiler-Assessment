const fs = require('fs');
const path = require('path');
const { pool, query } = require('./db');
const { seed } = require('./seed');

async function autoInitDb(force = false) {
  try {
    let usersExist = false;

    if (!force) {
      const res = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `);
      usersExist = res.rows[0]?.exists;
    }

    if (!usersExist || force) {
      console.log('🔄 Initializing database schema...');
      const schemaPath = path.resolve(__dirname, 'schema.sql');
      const sql = fs.readFileSync(schemaPath, 'utf-8');
      await pool.query(sql);
      console.log('✅ Schema migration executed successfully.');

      console.log('🌱 Seeding database with demo accounts & sample stores...');
      await seed(pool);
      console.log('✅ Auto-seed completed successfully.');

      return {
        status: 'initialized',
        message: 'Database migrated and seeded successfully with demo accounts.',
      };
    } else {
      console.log('📦 Database tables already exist. Skipping auto-migration.');
      return {
        status: 'ready',
        message: 'Database tables already exist. Ready to serve requests.',
      };
    }
  } catch (err) {
    console.error('❌ Database auto-init error:', err.message);
    throw err;
  }
}

module.exports = autoInitDb;
