const request = require('supertest');
const app = require('../index');

describe('API Health & Validation Tests', () => {
  describe('GET /api/health', () => {
    it('should return 200 with healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('healthy');
    });
  });

  describe('Validation & Security on Auth', () => {
    it('should reject signup with Name less than 20 characters', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Short Name',
          email: 'short@example.com',
          address: '123 Test Street',
          password: 'Password@123',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e) => e.field === 'name')).toBe(true);
    });

    it('should reject signup with invalid password (missing special char or uppercase)', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Valid Name Over Twenty Characters',
          email: 'valid@example.com',
          address: '123 Test Street',
          password: 'alllowercase123',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e) => e.field === 'password')).toBe(true);
    });

    it('should reject signup with address over 400 characters', async () => {
      const longAddress = 'a'.repeat(401);
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Valid Name Over Twenty Characters',
          email: 'valid@example.com',
          address: longAddress,
          password: 'Password@123',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e) => e.field === 'address')).toBe(true);
    });
  });

  describe('Role-Based Route Protection', () => {
    it('should return 401 when accessing admin dashboard without token', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 when rating a store without token', async () => {
      const res = await request(app)
        .put('/api/user/stores/1/rating')
        .send({ rating: 5 });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
