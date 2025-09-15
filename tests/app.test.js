const request = require('supertest');
const app = require('../src/app');

describe('Health endpoint', () => {
  test('GET /health returns status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

describe('Items API', () => {
  test('GET /api/items returns empty array initially', async () => {
    const response = await request(app).get('/api/items');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /api/items creates new item', async () => {
    const newItem = { name: 'Test Item' };
    const response = await request(app)
      .post('/api/items')
      .send(newItem);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: 1, name: 'Test Item' });
  });

  test('PUT /api/items/:id updates item', async () => {
    await request(app).post('/api/items').send({ name: 'Original' });
    const response = await request(app)
      .put('/api/items/1')
      .send({ name: 'Updated' });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: 1, name: 'Updated' });
  });

  test('DELETE /api/items/:id removes item', async () => {
    await request(app).post('/api/items').send({ name: 'To Delete' });
    const response = await request(app).delete('/api/items/1');
    expect(response.status).toBe(204);
  });
});