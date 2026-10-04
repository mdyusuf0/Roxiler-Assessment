/**
 * Seed script — populates the database with test data.
 * Usage: node config/seed.js
 *
 * Creates:
 *  - 1 admin user
 *  - 2 store owners
 *  - 2 normal users
 *  - 3 stores (2 owned, 1 unowned)
 *  - Several sample ratings
 */
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const env = require('./env');

async function seed() {
  const pool = new Pool({
    host: env.db.host,
    port: env.db.port,
    database: env.db.name,
    user: env.db.user,
    password: env.db.password,
  });

  try {
    // Clear existing data (respects FK order)
    await pool.query('DELETE FROM ratings');
    await pool.query('DELETE FROM stores');
    await pool.query('DELETE FROM users');

    const hash = async (pw) => bcrypt.hash(pw, 10);

    // ── Users ──────────────────────────────────
    const adminPw = await hash('Admin@123');
    const owner1Pw = await hash('Owner@123');
    const owner2Pw = await hash('Owner@123');
    const user1Pw = await hash('User@1234');
    const user2Pw = await hash('User@1234');

    const usersResult = await pool.query(
      `INSERT INTO users (name, email, password, address, role) VALUES
        ('System Administrator Account', 'admin@storerating.com', $1, '123 Admin Street, Tech City', 'admin'),
        ('Store Owner One Account', 'owner@store1.com', $2, '456 Market Lane, Commerce Town', 'store_owner'),
        ('Store Owner Two Account', 'owner@store2.com', $3, '789 Business Blvd, Trade City', 'store_owner'),
        ('Regular User One Account', 'user@example.com', $4, '321 User Ave, Normal Town', 'user'),
        ('Regular User Two Account', 'user2@example.com', $5, '654 Consumer Road, Buyer City', 'user')
      RETURNING id, name, email, role`,
      [adminPw, owner1Pw, owner2Pw, user1Pw, user2Pw]
    );

    const users = usersResult.rows;
    console.log(`✅ Seeded ${users.length} users`);

    const admin = users.find((u) => u.role === 'admin');
    const owner1 = users.find((u) => u.email === 'owner@store1.com');
    const owner2 = users.find((u) => u.email === 'owner@store2.com');
    const normalUser1 = users.find((u) => u.email === 'user@example.com');
    const normalUser2 = users.find((u) => u.email === 'user2@example.com');

    // ── Stores ─────────────────────────────────
    const storesResult = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id) VALUES
        ('TechMart Electronics Store', 'contact@techmart.com', '100 Tech Plaza, Silicon Valley', $1),
        ('Fresh Grocers Supermarket', 'hello@freshgrocers.com', '200 Green Street, Organic Town', $2),
        ('City Books And Stationery', 'info@citybooks.com', '300 Literature Lane, Book City', NULL)
      RETURNING id, name`,
      [owner1.id, owner2.id]
    );

    const stores = storesResult.rows;
    console.log(`✅ Seeded ${stores.length} stores`);

    // ── Ratings ────────────────────────────────
    const ratingsResult = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating) VALUES
        ($1, $3, 4),
        ($1, $4, 5),
        ($1, $5, 3),
        ($2, $3, 5),
        ($2, $4, 4)
      RETURNING id`,
      [normalUser1.id, normalUser2.id, stores[0].id, stores[1].id, stores[2].id]
    );

    console.log(`✅ Seeded ${ratingsResult.rowCount} ratings`);
    console.log('\n📋 Test accounts:');
    console.log('   Admin:       admin@storerating.com / Admin@123');
    console.log('   Store Owner: owner@store1.com      / Owner@123');
    console.log('   Store Owner: owner@store2.com      / Owner@123');
    console.log('   Normal User: user@example.com      / User@1234');
    console.log('   Normal User: user2@example.com     / User@1234\n');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
