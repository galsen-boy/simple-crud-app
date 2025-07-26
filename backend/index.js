const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const SECRET = 'supersecret';

app.use(cors());
app.use(bodyParser.json());

// In-memory todos
let todos = [
  { id: 1, text: 'First task', done: false },
  { id: 2, text: 'Second task', done: true }
];
let nextId = 3;

// Simulated login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    // Always succeed, return fake token
    const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(400).json({ error: 'Email and password required' });
  }
});

// Auth middleware
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

// Get todos
app.get('/todos', authenticate, (req, res) => {
  res.json(todos);
});

// Add todo
app.post('/todos', authenticate, (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });
  const todo = { id: nextId++, text, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

// Edit todo
app.put('/todos/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const { text, done } = req.body;
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  if (typeof text === 'string') todo.text = text;
  if (typeof done === 'boolean') todo.done = done;
  res.json(todo);
});

// Delete todo
app.delete('/todos/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Todo not found' });
  todos.splice(idx, 1);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
