// server/tests/auth.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({ name: 'Test User', email: 'test@example.com', password: 'pass123', role: 'learn' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User registered successfully!');
  });

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'pass123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
