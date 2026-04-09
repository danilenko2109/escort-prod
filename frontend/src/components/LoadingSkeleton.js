import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="bg-[#0A0A0A] border border-white/5 rounded-sm overflow-hidden" data-testid="loading-skeleton">
        <div className="aspect-[3/4] bg-[#121212] animate-pulse relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        </div>
        <div className="p-6 space-y-3">
          <div className="h-6 bg-[#121212] rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-[#121212] rounded w-1/2 animate-pulse" />
          <div className="h-4 bg-[#121212] rounded w-full animate-pulse" />
          <div className="h-4 bg-[#121212] rounded w-5/6 animate-pulse" />
        </div>
      </div>
    );
  }

  if (type === 'hero') {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-hero">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;