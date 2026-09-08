import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import app from '../src/app.js';

test('GET /api/v1/health returns the API status', async () => {
  const response = await request(app).get('/api/v1/health');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body.data, { status: 'ok' });
  assert.equal(response.body.success, true);
});

test('unknown routes return a safe 404 response', async () => {
  const response = await request(app).get('/api/v1/missing');

  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'NOT_FOUND');
});
