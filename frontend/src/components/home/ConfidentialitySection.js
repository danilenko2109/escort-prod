import React from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, ShieldCheck } from 'lucide-react';

const ConfidentialitySection = () => {
  return (
    <section className="py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden border border-[#D4AF37]/25 bg-gradient-to-r from-[#0A0A0A] via-[#0D0B07] to-[#0A0A0A] p-7 md:p-10 rounded-sm"
        >
          <div className="absolute -top-14 -right-8 w-44 h-44 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5 md:gap-6 items-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
              <LockKeyhole className="text-[#D4AF37]" size={24} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2">Гарантии конфиденциальности</p>
              <h3 className="text-2xl sm:text-3xl text-[#F8F8F8] mb-3">Ваше обращение остается только между вами и Elegant</h3>
              <p className="text-sm sm:text-base text-[#C7C7CC] leading-relaxed">
                Мы используем закрытую коммуникацию, ограниченный доступ к заявкам и персональное сопровождение.
                Данные не передаются третьим лицам без вашего согласия.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-[#D4AF37] text-sm">
                <ShieldCheck size={16} />
                <span>Премиальный стандарт приватности</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConfidentialitySection;
