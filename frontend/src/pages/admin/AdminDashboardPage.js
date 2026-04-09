import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, MessageSquare, Star, LogOut, Plus } from 'lucide-react';
import { adminAPI, settingsAPI } from '../../services/api';
import { toast } from 'sonner';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingPhone, setBookingPhone] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminAPI.getStats();
      setStats(data);
      const phoneData = await settingsAPI.getBookingPhone();
      setBookingPhone(phoneData.phone || '');
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (String(error.message).toLowerCase().includes('unauthorized')) {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSavePhone = async () => {
    const value = bookingPhone.trim();
    if (value.length < 5) {
      toast.error('Укажите корректный номер карты');
      return;
    }
    setSavingPhone(true);
    try {
      const data = await settingsAPI.updateBookingPhone(value);
      setBookingPhone(data.phone || value);
      toast.success('Реквизиты подтверждения обновлен');
    } catch (error) {
      toast.error(error.message || 'Не удалось сохранить реквизиты');
    } finally {
      setSavingPhone(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#D4AF37] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-20" data-testid="admin-dashboard">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-xs font-semibold">EG</div>
            <h1 className="text-2xl font-medium text-[#D4AF37]">Админ-панель</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
            data-testid="logout-button"
          >
            <LogOut size={18} />
            <span>Выход</span>
          </button>
        </div>

        <div className="mb-12 bg-[#0A0A0A] border border-white/10 p-6 rounded-sm">
          <h2 className="text-2xl font-medium text-[#D4AF37] mb-2">Настройки заявок</h2>
          <p className="text-sm text-[#A1A1AA] mb-6">
            Этот номер карты показывается в модальном окне после отправки заявки на анкете.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">
                Реквизиты
              </label>
              <input
                type="text"
                value={bookingPhone}
                onChange={(e) => setBookingPhone(e.target.value)}
                placeholder="0000 0000 0000 0000"
                className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 px-0 outline-none"
              />
            </div>
            <button
              onClick={handleSavePhone}
              disabled={savingPhone}
              className="bg-[#D4AF37] text-[#050505] hover:bg-[#F3E5AB] transition-colors px-8 py-3 uppercase tracking-widest text-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {savingPhone ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0A0A0A] border border-white/10 p-6 rounded-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <LayoutDashboard className="text-[#D4AF37]" size={24} />
              <span className="text-3xl font-medium text-[#F8F8F8]">{stats?.total_profiles || 0}</span>
            </div>
            <p className="text-sm text-[#A1A1AA] uppercase tracking-widest">Всего профилей</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0A0A0A] border border-white/10 p-6 rounded-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="text-[#D4AF37]" size={24} />
              <span className="text-3xl font-medium text-[#F8F8F8]">{stats?.active_profiles || 0}</span>
            </div>
            <p className="text-sm text-[#A1A1AA] uppercase tracking-widest">Активных</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0A0A0A] border border-white/10 p-6 rounded-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <Star className="text-[#D4AF37]" size={24} />
              <span className="text-3xl font-medium text-[#F8F8F8]">{stats?.featured_profiles || 0}</span>
            </div>
            <p className="text-sm text-[#A1A1AA] uppercase tracking-widest">VIP</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0A0A0A] border border-white/10 p-6 rounded-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <MessageSquare className="text-[#D4AF37]" size={24} />
              <span className="text-3xl font-medium text-[#F8F8F8]">{stats?.total_messages || 0}</span>
            </div>
            <p className="text-sm text-[#A1A1AA] uppercase tracking-widest">Сообщений</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-medium text-[#D4AF37] mb-6">Быстрые действия</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/admin/profiles"
              className="bg-[#0A0A0A] border border-white/10 hover:border-[#D4AF37]/30 p-6 rounded-sm transition-colors group"
              data-testid="manage-profiles-link"
            >
              <Users className="text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-lg font-medium text-[#F8F8F8] mb-2">Управление профилями</h3>
              <p className="text-sm text-[#A1A1AA]">Просмотр, редактирование и удаление профилей</p>
            </Link>

            <Link
              to="/admin/profiles/new"
              className="bg-[#0A0A0A] border border-white/10 hover:border-[#D4AF37]/30 p-6 rounded-sm transition-colors group"
              data-testid="create-profile-link"
            >
              <Plus className="text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-lg font-medium text-[#F8F8F8] mb-2">Создать профиль</h3>
              <p className="text-sm text-[#A1A1AA]">Добавить новый профиль в каталог</p>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-white/5 pt-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
          >
            <span>← Вернуться на сайт</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
