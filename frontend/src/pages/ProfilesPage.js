import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { profilesAPI } from '../services/api';
import { toast } from 'sonner';

const ProfilesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [city, setCity] = useState(searchParams.get('city') || localStorage.getItem('searchCity') || '');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [sortBy, setSortBy] = useState('nearest');
  const [codeQuery, setCodeQuery] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, [searchParams]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = {
        min_age: minAge || undefined,
        max_age: maxAge || undefined,
        sort_by: sortBy,
        active_only: true,
      };
      
      const data = await profilesAPI.getAll(params);
      setProfiles(data);
    } catch (error) {
      toast.error(error.message || 'Ошибка загрузки анкет');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByCode = async () => {
    if (!codeQuery.trim()) {
      return;
    }
    setLoading(true);
    try {
      const profile = await profilesAPI.searchByCode(codeQuery.trim());
      setProfiles([profile]);
    } catch (error) {
      setProfiles([]);
      toast.error(error.message || 'Анкета не найдена');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    const normalizedCity = city.trim();
    const params = {};
    if (normalizedCity) params.city = normalizedCity;
    if (minAge) params.min_age = minAge;
    if (maxAge) params.max_age = maxAge;
    if (sortBy) params.sort_by = sortBy;

    if (normalizedCity) {
      localStorage.setItem('searchCity', normalizedCity);
      setCity(normalizedCity);
    } else {
      localStorage.removeItem('searchCity');
      setCity('');
    }

    setSearchParams(params);
    fetchProfiles();
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setCity('');
    setMinAge('');
    setMaxAge('');
    setSortBy('nearest');
    setSearchParams({});
    localStorage.removeItem('searchCity');
    fetchProfiles();
  };

  return (
    <div className="min-h-screen pt-32 pb-24" data-testid="profiles-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] font-medium text-[#D4AF37] mb-4">
            Каталог
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tighter leading-none text-[#F8F8F8] mb-4">
            Профили
          </h1>
          {city ? (
            <p className="text-base text-[#A1A1AA]">
              Показываем {profiles.length} анкет для города <span className="text-[#D4AF37]">{city}</span>.
            </p>
          ) : (
            <p className="text-base text-[#A1A1AA]">
              Чтобы открыть анкету, сначала укажите ваш город в фильтрах.
            </p>
          )}
          <div className="mt-6 flex max-w-lg items-center gap-3">
            <input
              type="text"
              value={codeQuery}
              onChange={(e) => setCodeQuery(e.target.value)}
              placeholder="Поиск по коду анкеты, например anna-001"
              className="flex-1 bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-2 px-0 outline-none"
            />
            <button
              onClick={handleSearchByCode}
              className="bg-[#D4AF37] text-[#050505] hover:bg-[#F3E5AB] transition-colors py-2 px-4 text-sm uppercase tracking-widest"
            >
              Найти
            </button>
          </div>
        </motion.div>

        {/* Filters Bar */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-[#D4AF37] hover:text-[#F3E5AB] transition-colors"
            data-testid="filter-toggle-button"
          >
            <Filter size={20} />
            <span className="text-sm uppercase tracking-widest">Фильтры</span>
          </button>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setTimeout(fetchProfiles, 100);
              }}
              className="bg-[#0A0A0A] border border-white/20 text-white text-sm py-2 px-4 focus:border-[#D4AF37] outline-none"
              data-testid="sort-select"
            >
              <option value="nearest">Рекомендуемые</option>
              <option value="newest">Новые</option>
              <option value="featured">VIP</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 backdrop-blur-xl bg-[#0A0A0A]/60 border border-white/10 p-6 rounded-sm"
            data-testid="filters-panel"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">
                  Город
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Москва"
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-2 px-0 outline-none"
                  data-testid="filter-city-input"
                />
                <p className="mt-2 text-xs text-[#71717A]">
                  Город используется для персонализации витрины: анкеты показываются как доступные в выбранном городе.
                </p>
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">
                  Возраст от
                </label>
                <input
                  type="number"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  placeholder="21"
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-2 px-0 outline-none"
                  data-testid="filter-min-age-input"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">
                  Возраст до
                </label>
                <input
                  type="number"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  placeholder="35"
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-2 px-0 outline-none"
                  data-testid="filter-max-age-input"
                />
              </div>

              <div className="flex items-end space-x-2">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-[#D4AF37] text-[#050505] hover:bg-[#F3E5AB] transition-colors py-2 px-4 text-sm uppercase tracking-widest"
                  data-testid="apply-filters-button"
                >
                  Применить
                </button>
                <button
                  onClick={handleResetFilters}
                  className="bg-white/10 hover:bg-white/20 text-white transition-colors p-2"
                  data-testid="reset-filters-button"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Profiles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingSkeleton key={i} type="card" />
            ))}
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} city={city} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-xl text-[#A1A1AA]">Профили не найдены</p>
            <button
              onClick={handleResetFilters}
              className="mt-6 text-[#D4AF37] hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilesPage;