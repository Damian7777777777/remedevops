const request = require('supertest');
const app = require('../index');

let token = '';
let username = `testuser_${Date.now()}`; // evita errores por usuario existente

beforeAll(async () => {
  // Registrar usuario
  await request(app)
    .post('/api/auth/register')
    .send({ username, password: '123456' });

  // Login
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username, password: '123456' });

  token = res.body.token;
});

describe('Auth Routes', () => {
  test('Login devuelve token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username, password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});

describe('Tasks Routes', () => {
  test('GET /api/tasks - debe retornar lista de tareas', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/tasks - debe crear una tarea', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tarea green', description: 'Test en green' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  test('GET /health - debe responder version green', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.version).toBe('green');
  });

  test('GET /version - endpoint exclusivo de green', async () => {
    const res = await request(app).get('/version');

    expect(res.statusCode).toBe(200);
    expect(res.body.version).toBe('2.0');
  });
});