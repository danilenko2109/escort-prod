import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { resolveMediaUrl } from '../lib/mediaUrl';

const ProfileCard = ({ profile, city }) => {
  const imageUrl = resolveMediaUrl(profile.images?.[0] || 'https://images.unsplash.com/photo-1759933512107-e02a1328190d');
  const displayCity = city || localStorage.getItem('searchCity') || profile.city;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="relative group overflow-hidden bg-[#0A0A0A] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 rounded-sm"
      data-testid={`profile-card-${profile.id}`}
    >
      {/* Featured Badge */}
      {profile.isFeatured && (
        <div className="absolute top-4 right-4 z-10 bg-[#D4AF37] text-[#050505] px-3 py-1 text-xs uppercase tracking-widest font-medium rounded-sm flex items-center space-x-1">
          <Star size={12} fill="currentColor" />
          <span>VIP</span>
        </div>
      )}

      {/* Image */}
      <Link to={`/profiles/${profile.id}${city ? `?city=${city}` : ''}`} className="block relative overflow-hidden aspect-[3/4]">
        <img
          src={imageUrl}
          alt={profile.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      {/* Content */}
      <div className="p-6 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <Link 
              to={`/profiles/${profile.id}${city ? `?city=${city}` : ''}`}
              className="text-xl font-medium text-[#F8F8F8] hover:text-[#D4AF37] transition-colors"
              data-testid={`profile-name-${profile.id}`}
            >
              {profile.name}
            </Link>
            <p className="text-sm text-[#A1A1AA] mt-1">
              {profile.age} лет • {displayCity} 
            </p>
          </div>
        </div>

        {/* Distance */}
        {profile.distance !== undefined && (
          <div className="flex items-center space-x-2 text-[#D4AF37] text-sm">
            <MapPin size={14} />
            <span data-testid={`profile-distance-${profile.id}`}>{profile.distance} км от вас</span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-[#71717A] line-clamp-2">
          {profile.descriptionShort}
        </p>

        {/* Tags */}
        {profile.tags && profile.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {profile.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 border border-[#D4AF37]/20 text-[#D4AF37] rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <Link
          to={`/profiles/${profile.id}${city ? `?city=${city}` : ''}`}
          className="block w-full mt-4 bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] transition-all duration-300 uppercase tracking-widest text-xs py-3 text-center"
          data-testid={`profile-view-button-${profile.id}`}
        >
          Смотреть профиль
        </Link>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 shadow-[0_10px_40px_-10px_rgba(212,175,55,0.15)]" />
      </div>
    </motion.div>
  );
};

export default ProfileCard;
