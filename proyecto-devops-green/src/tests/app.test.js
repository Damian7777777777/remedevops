const request = require('supertest');
const app = require('../index');
const Database = require('better-sqlite3');
const path = require('path');

let token = '';

const db = new Database(path.join(__dirname, '../../database.db'));

beforeAll(() => {
  db.prepare("DELETE FROM tasks WHERE user_id = (SELECT id FROM users WHERE username = 'testuser')").run();
  db.prepare("DELETE FROM users WHERE username = 'testuser'").run();
});

afterAll(() => {
  db.prepare("DELETE FROM tasks WHERE user_id = (SELECT id FROM users WHERE username = 'testuser')").run();
  db.prepare("DELETE FROM users WHERE username = 'testuser'").run();
  db.close();
});

describe('Auth Routes', () => {
  test('POST /api/auth/register - debe registrar usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: '123456' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  test('POST /api/auth/login - debe hacer login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: '123456' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
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
      .send({ title: 'Tarea test', description: 'Descripcion test' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  test('GET /health - debe responder ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
