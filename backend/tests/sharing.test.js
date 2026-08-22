import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { seedUsers } from '../src/seeders/seed.js';

describe('Ajaia Docs Authentication & Security Test Suite', () => {
  let alexCookie = '';
  let sarahCookie = '';
  let johnCookie = '';
  let testDocumentId = '';

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
    await seedUsers();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('1. Valid login sets HttpOnly cookie and returns safe user information without passwordHash', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alex@ajaia.demo', password: 'demo123' });

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.name).toBe('Alex');
    expect(res.body.user.email).toBe('alex@ajaia.demo');
    expect(res.body.user.passwordHash).toBeUndefined();

    // Check set-cookie header for HttpOnly ajaia_token cookie
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((c) => c.includes('ajaia_token='))).toBe(true);
    expect(cookies.some((c) => c.includes('HttpOnly'))).toBe(true);

    alexCookie = cookies.find((c) => c.includes('ajaia_token='));
  });

  it('2. Invalid password returns 401 with generic error message', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alex@ajaia.demo', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password.');
  });

  it('3. Protected API without authentication returns 401 Unauthorized', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Authentication required');
  });

  it('4. Owner creates document and shares with Sarah', async () => {
    // Authenticate Sarah & John cookies
    const sarahRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'sarah@ajaia.demo', password: 'demo123' });
    sarahCookie = sarahRes.headers['set-cookie'].find((c) => c.includes('ajaia_token='));

    const johnRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john@ajaia.demo', password: 'demo123' });
    johnCookie = johnRes.headers['set-cookie'].find((c) => c.includes('ajaia_token='));

    // Alex creates document
    const createRes = await request(app)
      .post('/api/documents')
      .set('Cookie', [alexCookie])
      .send({ title: 'Q3 Strategy Roadmap', content: '<p>Strategy Overview</p>' });

    expect(createRes.status).toBe(201);
    testDocumentId = createRes.body.document._id;

    // Alex shares with Sarah
    const shareRes = await request(app)
      .post(`/api/documents/${testDocumentId}/share`)
      .set('Cookie', [alexCookie])
      .send({ email: 'sarah@ajaia.demo', permission: 'EDITOR' });

    expect(shareRes.status).toBe(200);
    expect(shareRes.body.share.permission).toBe('EDITOR');
  });

  it('5. Owner can access their document -> 200 OK & Sarah shared access -> 200 OK', async () => {
    // Owner (Alex) access
    const alexGet = await request(app)
      .get(`/api/documents/${testDocumentId}`)
      .set('Cookie', [alexCookie]);

    expect(alexGet.status).toBe(200);
    expect(alexGet.body.userAccess.isOwner).toBe(true);

    // Shared Editor (Sarah) access
    const sarahGet = await request(app)
      .get(`/api/documents/${testDocumentId}`)
      .set('Cookie', [sarahCookie]);

    expect(sarahGet.status).toBe(200);
    expect(sarahGet.body.userAccess.permission).toBe('EDITOR');
  });

  it('6. Unauthorized user (John) accessing another user document returns 403 Forbidden', async () => {
    const johnGet = await request(app)
      .get(`/api/documents/${testDocumentId}`)
      .set('Cookie', [johnCookie]);

    expect(johnGet.status).toBe(403);
    expect(johnGet.body.error).toContain("don't have permission");
  });

  it('7. Logout API clears authentication cookie cleanly', async () => {
    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', [alexCookie]);

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.message).toBe('Logged out successfully');

    const cookies = logoutRes.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((c) => c.includes('ajaia_token=;'))).toBe(true);
  });
});
