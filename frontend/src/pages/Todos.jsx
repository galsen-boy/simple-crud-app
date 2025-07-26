import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/auth';

const API = 'http://localhost:3001/todos';

export default function Todos() {
  const token = useAuthStore(state => state.token);
  const logout = useAuthStore(state => state.logout);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // Fetch todos from backend
  const fetchTodos = async () => {
    const res = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } });
    setTodos(res.data);
  };

  useEffect(() => { fetchTodos(); }, []);

  // Add a new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await axios.post(API, { text: newTodo }, { headers: { Authorization: `Bearer ${token}` } });
    setNewTodo('');
    fetchTodos();
  };

  // Start editing a todo
  const startEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  // Save edited todo
  const saveEdit = async (id) => {
    await axios.put(`${API}/${id}`, { text: editText }, { headers: { Authorization: `Bearer ${token}` } });
    setEditId(null);
    setEditText('');
    fetchTodos();
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchTodos();
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>My Todos</h2>
      <button onClick={logout} style={{ float: 'right', marginBottom: 10 }}>Logout</button>
      <form onSubmit={addTodo} style={{ marginBottom: 16 }}>
        <input value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="Add a task" style={{ width: '80%' }} />
        <button type="submit">Add</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: 8 }}>
            {editId === todo.id ? (
              <>
                <input value={editText} onChange={e => setEditText(e.target.value)} />
                <button onClick={() => saveEdit(todo.id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>{todo.text}</span>
                <button onClick={() => startEdit(todo.id, todo.text)} style={{ marginLeft: 8 }}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: 4 }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 