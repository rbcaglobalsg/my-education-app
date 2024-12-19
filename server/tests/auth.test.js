// server/tests/auth.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  it('should register a new user', async () => {
    const uniqueEmail = `test+${Date.now()}@example.com`; // 유니크한 이메일
    const res = await request(app)
      .post('/api/signup')
      .send({ name: 'Test User', email: uniqueEmail, password: 'pass123', role: 'learn' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User registered successfully!');
  });

  it('should login the user', async () => {
    // 로그인 테스트도 동일한 uniqueEmail을 사용하고 싶다면, 위 it 블록과 공유할 수 있는 방법을 고민하거나,
    // beforeAll에서 uniqueEmail을 변수로 선언해 두 테스트에서 공유할 수 있게 하십시오.
    const loginEmail = `test+${Date.now()}@example.com`;
    // 먼저 회원가입
    await request(app)
      .post('/api/signup')
      .send({ name: 'Login User', email: loginEmail, password: 'pass123', role: 'learn' });
    // 다음에 로그인 시도
    const res = await request(app)
      .post('/api/login')
      .send({ email: loginEmail, password: 'pass123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
