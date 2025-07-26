const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Import the app (or recreate it for test)
let app;
beforeEach(() => {
  app = express();
  app.use(cors());
  app.use(bodyParser.json());
  const SECRET = 'supersecret';
  let todos = [
    { id: 1, text: 'First task', done: false },
    { id: 2, text: 'Second task', done: true }
  ];
  let nextId = 3;

  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
      const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(400).json({ error: 'Email and password required' });
    }
  });

  function authenticate(req, res, next) {
    const auth = req.headers['authorization'];
    if (!auth) return res.status(401).json({ error: 'Missing token' });
    const token = auth.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = user;
      next();
    });
  }

  app.get('/todos', authenticate, (req, res) => {
    res.json(todos);
  });

  app.post('/todos', authenticate, (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });
    const todo = { id: nextId++, text, done: false };
    todos.push(todo);
    res.status(201).json(todo);
  });

  app.put('/todos/:id', authenticate, (req, res) => {
    const id = parseInt(req.params.id);
    const { text, done } = req.body;
    const todo = todos.find(t => t.id === id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    if (typeof text === 'string') todo.text = text;
    if (typeof done === 'boolean') todo.done = done;
    res.json(todo);
  });

  app.delete('/todos/:id', authenticate, (req, res) => {
    const id = parseInt(req.params.id);
    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Todo not found' });
    todos.splice(idx, 1);
    res.status(204).end();
  });
});

describe('API Endpoints', () => {
  let token;
  beforeEach(async () => {
    // Get a valid token for authenticated requests
    const res = await request(app).post('/login').send({ email: 'test@example.com', password: 'pass' });
    token = res.body.token;
  });

  test('POST /login - success', async () => {
    const res = await request(app).post('/login').send({ email: 'a@b.com', password: '123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('POST /login - failure', async () => {
    const res = await request(app).post('/login').send({ email: '', password: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Email and password required');
  });

  test('GET /todos - with auth', async () => {
    const res = await request(app).get('/todos').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /todos - without auth', async () => {
    const res = await request(app).get('/todos');
    expect(res.statusCode).toBe(401);
  });

  test('POST /todos - valid', async () => {
    const res = await request(app).post('/todos').set('Authorization', `Bearer ${token}`).send({ text: 'Test Todo' });
    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe('Test Todo');
  });

  test('POST /todos - invalid body', async () => {
    const res = await request(app).post('/todos').set('Authorization', `Bearer ${token}`).send({});
    expect(res.statusCode).toBe(400);
  });

  test('PUT /todos/:id - valid', async () => {
    const res = await request(app).put('/todos/1').set('Authorization', `Bearer ${token}`).send({ text: 'Updated', done: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe('Updated');
    expect(res.body.done).toBe(true);
  });

  test('PUT /todos/:id - not found', async () => {
    const res = await request(app).put('/todos/999').set('Authorization', `Bearer ${token}`).send({ text: 'Nope' });
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /todos/:id - valid', async () => {
    const res = await request(app).delete('/todos/1').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });

  test('DELETE /todos/:id - not found', async () => {
    const res = await request(app).delete('/todos/999').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
}); 