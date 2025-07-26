import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Todos from './pages/Todos';
import { useAuthStore } from './store/auth';

function App() {
  const token = useAuthStore(state => state.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/todos" element={token ? <Todos /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token ? '/todos' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
