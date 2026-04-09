import React from 'react';
import { motion } from 'framer-motion';
import { Gem, ShieldCheck, Sparkles, Clock3 } from 'lucide-react';
import SectionHeading from './SectionHeading';

const FEATURES = [
  {
    icon: Gem,
    title: 'Премиум отбор анкет',
    text: 'Каждый профиль проходит ручную проверку по стандартам Elegant.',
  },
  {
    icon: ShieldCheck,
    title: 'Конфиденциальный сервис',
    text: 'Личные данные и детали общения защищены на всех этапах.',
  },
  {
    icon: Sparkles,
    title: 'Индивидуальный подбор',
    text: 'Формат встречи и пожелания подбираются с учетом ваших приоритетов.',
  },
  {
    icon: Clock3,
    title: 'Быстрое подтверждение',
    text: 'Оперативная обработка заявок и поддержка менеджера без ожидания.',
  },
];

const WhyElegantSection = () => {
  return (
    <section className="py-24 md:py-28 bg-[#0A0A0A]/45">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          eyebrow="Почему выбирают Elegant"
          title="Сервис, где важна каждая деталь"
          description="Мы сохранили премиальную атмосферу бренда и усилили практичность сервиса для комфортного бронирования."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="group rounded-sm border border-white/10 bg-[#050505]/70 p-6"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/5 mb-4">
                  <Icon className="text-[#D4AF37]" size={20} />
                </div>
                <h3 className="text-xl text-[#F8F8F8] mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#A1A1AA]">{item.text}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyElegantSection;
