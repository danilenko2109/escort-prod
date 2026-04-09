import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, User, Ruler, Weight, Languages, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ProfileCard from '../components/ProfileCard';
import { profilesAPI } from '../services/api';
import { resolveMediaUrl } from '../lib/mediaUrl';

const ProfileDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const city = searchParams.get('city') || localStorage.getItem('searchCity') || '';
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProfiles, setRelatedProfiles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    if (!city) {
      navigate('/profiles', { replace: true });
    }
  }, [city, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = city ? { city } : {};
        const data = await profilesAPI.getById(id, params);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async () => {
      try {
        const data = await profilesAPI.getAll({ city, active_only: true });
        setRelatedProfiles(data.filter(p => p.id !== id).slice(0, 3));
      } catch (error) {
        console.error('Error fetching related profiles:', error);
      }
    };

    fetchData();
    fetchRelated();
  }, [id, city]);


  const nextImage = () => {
    if (profile?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % profile.images.length);
    }
  };

  const prevImage = () => {
    if (profile?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + profile.images.length) % profile.images.length);
    }
  };

  if (loading) {
    return <LoadingSkeleton type="hero" />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <p className="text-xl text-[#A1A1AA] mb-6">Профиль не найден</p>
          <Link to="/profiles" className="text-[#D4AF37] hover:underline">
            Вернуться к каталогу
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = resolveMediaUrl(
    profile.images?.[currentImageIndex] || profile.images?.[0] || 'https://images.unsplash.com/photo-1759933512107-e02a1328190d'
  );

  return (
    <div className="min-h-screen pt-20" data-testid="profile-detail-page">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        <Link
          to={`/profiles${city ? `?city=${city}` : ''}`}
          className="inline-flex items-center space-x-2 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
          data-testid="back-to-profiles"
        >
          <ArrowLeft size={20} />
          <span className="text-sm uppercase tracking-widest">Назад к каталогу</span>
        </Link>
      </div>

      {/* Hero Gallery */}
      <section className="relative" data-testid="profile-gallery">
        <div className="relative mx-auto h-[70vh] max-w-2xl overflow-hidden md:h-[75vh] md:rounded-sm">
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={imageUrl}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

          {/* Gallery Navigation */}
          {profile.images && profile.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 backdrop-blur-sm transition-colors"
                data-testid="prev-image-button"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 backdrop-blur-sm transition-colors"
                data-testid="next-image-button"
              >
                <ChevronRight size={24} />
              </button>

              {/* Image indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {profile.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-[#D4AF37] w-8' : 'bg-white/50'
                    }`}
                    data-testid={`image-indicator-${idx}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#F8F8F8] mb-2" data-testid="profile-name">
                      {profile.name}
                    </h1>
                    <p className="text-lg text-[#A1A1AA]">
                      {profile.age} лет • {city || profile.city}
                    </p>
                  </div>
                </div>

                {profile.distance !== undefined && (
                  <div className="flex items-center space-x-2 text-[#D4AF37] mb-6">
                    <MapPin size={18} />
                    <span data-testid="profile-distance">{profile.distance} км от вас</span>
                  </div>
                )}

                <div className="lips-divider my-8"></div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-medium text-[#D4AF37] mb-4">О профиле</h3>
                  <p className="text-base text-[#A1A1AA] leading-relaxed whitespace-pre-line">
                    {profile.descriptionFull || profile.descriptionShort}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="backdrop-blur-xl bg-[#0A0A0A]/60 border border-white/10 p-8 rounded-sm sticky top-24"
              >
                <h3 className="text-xl font-medium text-[#D4AF37] mb-6 uppercase tracking-widest">
                  Характеристики
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User size={20} className="text-[#D4AF37]" />
                    <div>
                      <p className="text-xs text-[#71717A] uppercase tracking-widest">Возраст</p>
                      <p className="text-sm text-[#F8F8F8]">{profile.age} лет</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Ruler size={20} className="text-[#D4AF37]" />
                    <div>
                      <p className="text-xs text-[#71717A] uppercase tracking-widest">Рост</p>
                      <p className="text-sm text-[#F8F8F8]">{profile.height} см</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Weight size={20} className="text-[#D4AF37]" />
                    <div>
                      <p className="text-xs text-[#71717A] uppercase tracking-widest">Вес</p>
                      <p className="text-sm text-[#F8F8F8]">{profile.weight} кг</p>
                    </div>
                  </div>

                  {profile.languages && profile.languages.length > 0 && (
                    <div className="flex items-center space-x-3">
                      <Languages size={20} className="text-[#D4AF37]" />
                      <div>
                        <p className="text-xs text-[#71717A] uppercase tracking-widest">Языки</p>
                        <p className="text-sm text-[#F8F8F8]">{profile.languages.join(', ')}</p>
                      </div>
                    </div>
                  )}

                  {profile.tags && profile.tags.length > 0 && (
                    <div>
                      <p className="text-xs text-[#71717A] uppercase tracking-widest mb-3">Теги</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 border border-[#D4AF37]/20 text-[#D4AF37] rounded-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <Link
                    to={`/profiles/${profile.id}/request${city ? `?city=${encodeURIComponent(city)}` : ''}`}
                    className="block w-full bg-[#D4AF37] py-3 text-center text-sm font-medium uppercase tracking-[0.2em] text-[#050505] transition-colors hover:bg-[#F3E5AB]"
                  >
                    Оформить заявку
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Profiles */}
      {relatedProfiles.length > 0 && (
        <section className="py-16 bg-[#0A0A0A]/50" data-testid="related-profiles">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h3 className="text-2xl sm:text-3xl font-medium text-[#D4AF37] mb-8">
              Похожие профили
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProfiles.map((relatedProfile) => (
                <ProfileCard key={relatedProfile.id} profile={relatedProfile} city={city} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default ProfileDetailPage;
