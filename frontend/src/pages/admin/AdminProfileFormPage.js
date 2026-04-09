import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { profilesAPI, uploadsAPI } from '../../services/api';
import { toast } from 'sonner';
import { resolveMediaUrl } from '../../lib/mediaUrl';

const AdminProfileFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    age: 21,
    city: '',
    country: 'Россия',
    descriptionShort: '',
    descriptionFull: '',
    height: 170,
    weight: 55,
    languages: [],
    tags: [],
    lat: 55.7558,
    lng: 37.6173,
    isActive: true,
    isFeatured: false,
    rate1h: 10000,
    rate2h: 18000,
    rate3h: 25000,
    images: []
  });

  const [languageInput, setLanguageInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (isEdit) {
      fetchProfile();
    }
  }, [id, isEdit]);

  const fetchProfile = async () => {
    try {
      const data = await profilesAPI.getById(id);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Ошибка загрузки профиля');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, languageInput.trim()]
      });
      setLanguageInput('');
    }
  };

  const handleRemoveLanguage = (lang) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter(l => l !== lang)
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleRemoveImage = (img) => {
    setFormData({
      ...formData,
      images: formData.images.filter(i => i !== img)
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (formData.images.length >= 3) {
      toast.error('Можно загрузить максимум 3 фото');
      return;
    }

    setUploadingImage(true);
    try {
      const data = await uploadsAPI.uploadProfileImage(file);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, data.url].slice(0, 3)
      }));
      toast.success('Фото загружено');
    } catch (error) {
      toast.error(error.message || 'Не удалось загрузить фото');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.images.length < 1) {
        toast.error('Добавьте минимум 1 фото');
        setLoading(false);
        return;
      }
      if (formData.images.length > 3) {
        toast.error('Допустимо максимум 3 фото');
        setLoading(false);
        return;
      }
      if (isEdit) {
        await profilesAPI.update(id, formData);
        toast.success('Профиль обновлен');
      } else {
        await profilesAPI.create(formData);
        toast.success('Профиль создан');
      }
      navigate('/admin/profiles');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-20 pb-12" data-testid="admin-profile-form-page">
      {/* Header */}
      <div className="border-b border-white/5 mb-8">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-6">
          <h1 className="text-3xl font-medium text-[#D4AF37] mb-4">
            {isEdit ? 'Редактировать профиль' : 'Создать профиль'}
          </h1>
          <Link
            to="/admin/profiles"
            className="inline-flex items-center space-x-2 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            <span>Назад к списку</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <form onSubmit={handleSubmit} className="space-y-8" data-testid="profile-form">
          {/* Basic Info */}
          <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-sm">
            <h2 className="text-xl font-medium text-[#D4AF37] mb-6">Основная информация</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">Код анкеты *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="anna-001"
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 px-0 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">Имя *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 px-0 outline-none"
                  data-testid="profile-name-input"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">Возраст *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="18"
                  max="50"
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 px-0 outline-none"
                  data-testid="profile-age-input"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">Место рождения *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 px-0 outline-none"
                  data-testid="profile-city-input"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">Рост (см) *</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 px-0 outline-none"
                  data-testid="profile-height-input"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">Вес (кг) *</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 px-0 outline-none"
                  data-testid="profile-weight-input"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">Координаты</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="lat"
                    value={formData.lat}
                    onChange={handleChange}
                    step="0.0001"
                    placeholder="Широта"
                    className="w-1/2 bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 px-0 outline-none text-sm"
                  />
                  <input
                    type="number"
                    name="lng"
                    value={formData.lng}
                    onChange={handleChange}
                    step="0.0001"
                    placeholder="Долгота"
                    className="w-1/2 bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 px-0 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">Краткое описание *</label>
              <textarea
                name="descriptionShort"
                value={formData.descriptionShort}
                onChange={handleChange}
                required
                rows={2}
                className="w-full bg-transparent border border-white/20 focus:border-[#D4AF37] text-white py-3 px-4 outline-none resize-none"
                data-testid="profile-desc-short-input"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">Полное описание *</label>
              <textarea
                name="descriptionFull"
                value={formData.descriptionFull}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-transparent border border-white/20 focus:border-[#D4AF37] text-white py-3 px-4 outline-none resize-none"
                data-testid="profile-desc-full-input"
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-sm">
            <h2 className="text-xl font-medium text-[#D4AF37] mb-6">Изображения</h2>
            <p className="text-sm text-[#A1A1AA] mb-4">
              Загружайте только файлы изображений. Максимум 3 фото, размер каждого до 5MB.
            </p>
            
            <div className="mb-4">
              <label className={`block w-full cursor-pointer ${formData.images.length >= 3 ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <div className="border-2 border-dashed border-white/20 hover:border-[#D4AF37] p-8 text-center transition-colors">
                  <p className="text-sm text-[#A1A1AA]">
                    {uploadingImage
                      ? 'Загрузка фото...'
                      : formData.images.length >= 3
                        ? 'Достигнут лимит 3 фото'
                        : 'Нажмите, чтобы выбрать и загрузить фото'}
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage || formData.images.length >= 3}
                />
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={resolveMediaUrl(img)} alt="" className="w-full h-32 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-sm">
            <h2 className="text-xl font-medium text-[#D4AF37] mb-6">Услуги и цены</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">1 час</label>
                <input type="number" name="rate1h" value={formData.rate1h} onChange={handleChange} className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 px-0 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">2 часа</label>
                <input type="number" name="rate2h" value={formData.rate2h} onChange={handleChange} className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 px-0 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">3 часа</label>
                <input type="number" name="rate3h" value={formData.rate3h} onChange={handleChange} className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 px-0 outline-none" />
              </div>
            </div>
          </div>

          {/* Languages & Tags */}
          <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-sm">
            <h2 className="text-xl font-medium text-[#D4AF37] mb-6">Языки и теги</h2>
            
            <div className="mb-6">
              <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">Языки</label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                  placeholder="Русский"
                  className="flex-1 bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-2 px-0 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="bg-[#D4AF37] text-[#050505] px-4 py-2 text-sm"
                >
                  Добавить
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-2 bg-white/5 border border-white/20 px-3 py-1 text-sm text-[#F8F8F8]"
                  >
                    <span>{lang}</span>
                    <button type="button" onClick={() => handleRemoveLanguage(lang)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">Теги</label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="VIP"
                  className="flex-1 bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-2 px-0 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-[#D4AF37] text-[#050505] px-4 py-2 text-sm"
                >
                  Добавить
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-2 border border-[#D4AF37]/30 text-[#D4AF37] px-3 py-1 text-sm"
                  >
                    <span>{tag}</span>
                    <button type="button" onClick={() => handleRemoveTag(tag)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-sm">
            <h2 className="text-xl font-medium text-[#D4AF37] mb-6">Статус</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5"
                  data-testid="profile-is-active-checkbox"
                />
                <span className="text-[#F8F8F8]">Активен</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-5 h-5"
                  data-testid="profile-is-featured-checkbox"
                />
                <span className="text-[#F8F8F8]">VIP (избранный)</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#D4AF37] text-[#050505] hover:bg-[#F3E5AB] py-4 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="profile-submit-button"
            >
              {loading ? 'Сохранение...' : isEdit ? 'Обновить' : 'Создать'}
            </button>
            <Link
              to="/admin/profiles"
              className="px-8 py-4 border border-white/20 text-white hover:border-[#D4AF37] transition-colors text-center uppercase tracking-widest text-sm"
            >
              Отмена
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfileFormPage;
