import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FinalCtaSection = ({ onViewProfiles, onOpenContacts }) => {
  return (
    <section className="py-24 md:py-28">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border border-[#D4AF37]/25 bg-gradient-to-b from-[#0A0A0A] to-[#050505] px-6 py-10 md:px-10 md:py-14 text-center rounded-sm"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.28em] font-medium text-[#D4AF37] mb-4">
            Финальный шаг
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#F8F8F8] mb-4">
            Готовы выбрать анкету?
          </h2>
          <p className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl mx-auto mb-10">
            Перейдите в каталог или оставьте заявку через форму связи. Мы поможем подобрать оптимальный формат встречи.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onViewProfiles}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-[#050505] hover:bg-[#F3E5AB] transition-colors uppercase tracking-widest text-xs py-4 px-8"
            >
              <span>Смотреть анкеты</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={onOpenContacts}
              className="w-full sm:w-auto border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] transition-colors uppercase tracking-widest text-xs py-4 px-8"
            >
              Оформить заявку
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
