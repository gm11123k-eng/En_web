import { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

export const api = axios.create({ baseURL: 'http://localhost:8080/api' });

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const memberId = localStorage.getItem('memberId');
    if (memberId) {
      api.get('/members/me', { params: { memberId } })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('memberId'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('memberId', res.data.memberId);
    const meRes = await api.get('/members/me', { params: { memberId: res.data.memberId } });
    setUser(meRes.data);
  };

  const signup = async (email, password, nickname) => {
    await api.post('/auth/signup', { email, password, nickname });
  };

  const logout = () => {
    localStorage.removeItem('memberId');
    setUser(null);
  };

  const Protected = ({ children }) => {
    if (loading) return <div>로딩 중...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<Protected><div>메인</div></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
