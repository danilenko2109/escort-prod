import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { profilesAPI } from '../../services/api';
import { toast } from 'sonner';

const AdminProfilesPage = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const data = await profilesAPI.getAll({ active_only: false });
      setProfiles(data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Ошибка загрузки профилей');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (profileId, currentStatus) => {
    try {
      await profilesAPI.update(profileId, { isActive: !currentStatus });
      toast.success('Статус обновлен');
      fetchProfiles();
    } catch (error) {
      console.error('Error toggling profile:', error);
      toast.error('Ошибка обновления');
    }
  };

  const handleDelete = async (profileId, profileName) => {
    if (window.confirm(`Удалить профиль "${profileName}"?`)) {
      try {
        await profilesAPI.delete(profileId);
        toast.success('Профиль удален');
        fetchProfiles();
      } catch (error) {
        console.error('Error deleting profile:', error);
        toast.error('Ошибка удаления');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#D4AF37] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-20 pb-12" data-testid="admin-profiles-page">
      {/* Header */}
      <div className="border-b border-white/5 mb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-medium text-[#D4AF37]">Управление профилями</h1>
            <Link
              to="/admin/profiles/new"
              className="inline-flex items-center space-x-2 bg-[#D4AF37] text-[#050505] hover:bg-[#F3E5AB] px-6 py-3 transition-colors"
              data-testid="create-new-profile-button"
            >
              <Plus size={18} />
              <span className="uppercase tracking-widest text-sm">Создать</span>
            </Link>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center space-x-2 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            <span>Назад к панели</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {profiles.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-lg text-[#A1A1AA] mb-6">Профили не найдены</p>
            <Link
              to="/admin/profiles/new"
              className="inline-block bg-[#D4AF37] text-[#050505] px-8 py-3 uppercase tracking-widest text-sm"
            >
              Создать первый профиль
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="profiles-table">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-sm text-[#A1A1AA] uppercase tracking-widest py-4 px-4">Фото</th>
                  <th className="text-left text-sm text-[#A1A1AA] uppercase tracking-widest py-4 px-4">Имя</th>
                  <th className="text-left text-sm text-[#A1A1AA] uppercase tracking-widest py-4 px-4">Возраст</th>
                  <th className="text-left text-sm text-[#A1A1AA] uppercase tracking-widest py-4 px-4">Место рождения</th>
                  <th className="text-left text-sm text-[#A1A1AA] uppercase tracking-widest py-4 px-4">Статус</th>
                  <th className="text-left text-sm text-[#A1A1AA] uppercase tracking-widest py-4 px-4">VIP</th>
                  <th className="text-right text-sm text-[#A1A1AA] uppercase tracking-widest py-4 px-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <motion.tr
                    key={profile.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-[#0A0A0A] transition-colors"
                    data-testid={`profile-row-${profile.id}`}
                  >
                    <td className="py-4 px-4">
                      <img
                        src={profile.images?.[0] || 'https://via.placeholder.com/100'}
                        alt={profile.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-4 px-4 text-[#F8F8F8]">{profile.name}</td>
                    <td className="py-4 px-4 text-[#A1A1AA]">{profile.age}</td>
                    <td className="py-4 px-4 text-[#A1A1AA]">{profile.city}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleActive(profile.id, profile.isActive)}
                        className={`flex items-center space-x-2 text-sm ${
                          profile.isActive ? 'text-green-500' : 'text-red-500'
                        }`}
                        data-testid={`toggle-active-${profile.id}`}
                      >
                        {profile.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                        <span>{profile.isActive ? 'Активен' : 'Скрыт'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm ${profile.isFeatured ? 'text-[#D4AF37]' : 'text-[#71717A]'}`}>
                        {profile.isFeatured ? 'Да' : 'Нет'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-3">
                        <Link
                          to={`/admin/profiles/${profile.id}/edit`}
                          className="text-[#D4AF37] hover:text-[#F3E5AB] transition-colors"
                          data-testid={`edit-profile-${profile.id}`}
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(profile.id, profile.name)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          data-testid={`delete-profile-${profile.id}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfilesPage;
