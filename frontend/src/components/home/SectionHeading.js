import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({ eyebrow, title, description, centered = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className={centered ? 'text-center mb-12 md:mb-14' : 'mb-10 md:mb-12'}
    >
      {eyebrow ? (
        <p className="text-xs sm:text-sm uppercase tracking-[0.28em] font-medium text-[#D4AF37] mb-4">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#F8F8F8]">{title}</h2>
      {description ? (
        <p className="text-base sm:text-lg text-[#A1A1AA] font-light leading-relaxed max-w-3xl mx-auto mt-4">
          {description}
        </p>
      ) : null}
    </motion.div>
  );
};

export default SectionHeading;
