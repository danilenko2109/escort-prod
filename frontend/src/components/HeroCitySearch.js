import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const HeroCitySearch = ({ onSearch }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative"
      data-testid="hero-city-search"
    >
      <form onSubmit={handleSubmit} className="flex items-center space-x-0">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Введите ваш город..."
          className="flex-1 bg-transparent border-b-2 border-white/20 focus:border-[#D4AF37] text-white placeholder:text-zinc-600 py-4 px-0 text-lg outline-none transition-colors"
          data-testid="city-input"
        />
        <button
          type="submit"
          className="ml-4 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] transition-all duration-300 uppercase tracking-widest text-sm py-4 px-8 flex items-center space-x-2"
          data-testid="search-button"
        >
          <Search size={18} />
          <span>Найти</span>
        </button>
      </form>
    </motion.div>
  );
};

export default HeroCitySearch;