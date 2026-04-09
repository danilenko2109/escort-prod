import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { toast } from 'sonner';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await adminAPI.login(credentials);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_username', data.username);
      toast.success('Вход выполнен успешно');
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Неверные учетные данные');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center grain" data-testid="admin-login-page">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md mx-6"
      >
        <div className="backdrop-blur-xl bg-[#0A0A0A]/80 border border-white/10 p-8 rounded-sm">
          <div className="text-center mb-8">
            <div className="h-12 w-12 mx-auto mb-4 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-sm font-semibold">EG</div>
            <h1 className="text-3xl font-medium text-[#D4AF37] mb-2">Админ-панель</h1>
            <p className="text-sm text-[#A1A1AA]">Войдите, чтобы продолжить</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-login-form">
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">
                Логин
              </label>
              <div className="relative">
                <User className="absolute left-0 top-3 text-[#D4AF37]" size={18} />
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 pl-8 pr-0 outline-none transition-colors"
                  data-testid="admin-username-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-0 top-3 text-[#D4AF37]" size={18} />
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 pl-8 pr-0 outline-none transition-colors"
                  data-testid="admin-password-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-[#050505] hover:bg-[#F3E5AB] transition-colors py-4 uppercase tracking-widest text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="admin-login-button"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
