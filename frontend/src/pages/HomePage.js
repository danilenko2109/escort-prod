import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroCitySearch from '../components/HeroCitySearch';
import ProfileCard from '../components/ProfileCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import WhyElegantSection from '../components/home/WhyElegantSection';
import ConfidentialitySection from '../components/home/ConfidentialitySection';
import MeetingFormatsSection from '../components/home/MeetingFormatsSection';
import FaqSection from '../components/home/FaqSection';
import FinalCtaSection from '../components/home/FinalCtaSection';
import { profilesAPI } from '../services/api';
import goldLips from '../assets/gold-lips.svg';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProfiles, setFeaturedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(localStorage.getItem('searchCity') || '');

  const showFullHome = useMemo(() => Boolean(selectedCity), [selectedCity]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await profilesAPI.getAll({ featured_only: true });
        setFeaturedProfiles(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching featured profiles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleCitySearch = (city) => {
    localStorage.setItem('searchCity', city);
    setSelectedCity(city);
    navigate(`/profiles?city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="min-h-screen grain">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        {/* Background */}
        <div className="absolute inset-0 z-0 hero-lips-bg">
          <div
            className="absolute inset-0 opacity-[0.18] bg-center bg-no-repeat bg-cover md:bg-contain"
            style={{ backgroundImage: `url(${goldLips})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/55 via-[#050505]/78 to-[#050505]" />
        </div>

        {/* Decorative floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl"
        />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] font-medium text-[#D4AF37] mb-6">
              Эскорт агентство
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tighter leading-none text-[#F8F8F8] mb-6" data-testid="hero-title">
              Откройте мир
              <br />
              <span className="text-[#D4AF37]">изысканности</span>
            </h1>
            <p className="text-base sm:text-lg text-[#A1A1AA] font-light leading-relaxed max-w-2xl mx-auto mb-12">
              Эксклюзивный каталог избранных профилей. Утонченность, элегантность и полная конфиденциальность для взыскательных клиентов.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <HeroCitySearch onSearch={handleCitySearch} />
          </div>

       

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-12"
          >
            <p className="text-sm text-[#71717A] uppercase tracking-widest">
              Найдите профили рядом с вами
            </p>
          </motion.div>
        </div>
      </section>

      {!showFullHome ? (
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <div className="rounded-sm border border-[#D4AF37]/30 bg-[#0A0A0A]/70 p-8 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">Старт</p>
              <h2 className="mt-3 text-2xl sm:text-3xl text-[#F8F8F8]">Введите ваш город, чтобы открыть каталог</h2>
              <p className="mt-3 text-[#A1A1AA]">
                После ввода города вы попадёте в каталог, где все анкеты будут отображаться как доступные в вашем городе.
              </p>
            </div>
          </div>
        </section>
      ) : (
      <>
      {/* Featured Profiles */}
      <section className="py-24 md:py-32 relative" data-testid="featured-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] font-medium text-[#D4AF37] mb-4">
              Избранные профили
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#F8F8F8]">
              VIP коллекция
            </h2>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <LoadingSkeleton key={i} type="card" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} city={selectedCity} />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => navigate('/profiles')}
              className="inline-flex items-center space-x-2 bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] transition-all duration-300 uppercase tracking-widest text-sm py-4 px-8"
              data-testid="view-all-profiles-button"
            >
              <span>Весь каталог</span>
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      <WhyElegantSection />
      {/* <BookingStepsSection /> */}
      <ConfidentialitySection />
      {/* <MeetingFormatsSection /> */}
      <FaqSection />
      <FinalCtaSection
        onViewProfiles={() => navigate('/profiles')}
        onOpenContacts={() => navigate('/contacts')}
      />
      </>
      )}
    </div>
  );
};

export default HomePage;
