import { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import WordPage from './pages/WordPage';
import ChatPage from './pages/ChatPage';
import RoleplayPage from './pages/RoleplayPage';
import QuizPage from './pages/QuizPage';
import WrongAnswerPage from './pages/WrongAnswerPage';
import StatsPage from './pages/StatsPage';
import NotFoundPage from './pages/NotFoundPage';

export const api = axios.create({ baseURL: 'http://localhost:8080/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.params = { ...config.params, token };
    if (config.data && typeof config.data === 'object') {
      config.data = { ...config.data, token };
    }
  }
  return config;
});

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
        .catch(() => {
          localStorage.removeItem('memberId');
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('memberId', res.data.memberId);
    localStorage.setItem('token', res.data.token);
    const meRes = await api.get('/members/me', { params: { memberId: res.data.memberId } });
    setUser(meRes.data);
  };

  const signup = async (email, password, nickname) => {
    await api.post('/auth/signup', { email, password, nickname });
  };

  const logout = () => {
    localStorage.removeItem('memberId');
    localStorage.removeItem('token');
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
          <Route path="/" element={<Protected><MainPage /></Protected>} />
          <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
          <Route path="/word" element={<Protected><WordPage /></Protected>} />
          <Route path="/chat" element={<Protected><ChatPage /></Protected>} />
          <Route path="/chat/:id" element={<Protected><ChatPage /></Protected>} />
          <Route path="/roleplay" element={<Protected><RoleplayPage /></Protected>} />
          <Route path="/quiz" element={<Protected><QuizPage /></Protected>} />
          <Route path="/wrong-answers" element={<Protected><WrongAnswerPage /></Protected>} />
          <Route path="/stats" element={<Protected><StatsPage /></Protected>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
