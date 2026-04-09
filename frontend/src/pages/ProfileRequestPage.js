import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ProfileBookingForm from '../components/ProfileBookingForm';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { profilesAPI } from '../services/api';

const ProfileRequestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const city = searchParams.get('city') || localStorage.getItem('searchCity') || '';
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) {
      navigate('/profiles', { replace: true });
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await profilesAPI.getById(id, { city });
        setProfile(data);
      } catch (_error) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, city, navigate]);

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

  return (
    <div className="min-h-screen pt-28 pb-20" data-testid="profile-request-page">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <Link
          to={`/profiles/${id}${city ? `?city=${encodeURIComponent(city)}` : ''}`}
          className="inline-flex items-center space-x-2 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm uppercase tracking-widest">Назад к анкете</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 backdrop-blur-xl bg-[#0A0A0A]/60 border border-white/10 p-6 sm:p-8 rounded-sm"
        >
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#F8F8F8]">Оформление заявки</h1>
          <p className="mt-2 text-[#A1A1AA]">Анкета: <span className="text-[#D4AF37]">{profile.name}</span></p>
          <div className="mt-6 border-t border-white/10 pt-6">
            <ProfileBookingForm profile={profile} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileRequestPage;
