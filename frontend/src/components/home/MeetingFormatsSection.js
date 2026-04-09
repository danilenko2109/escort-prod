import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const FORMATS = [
  {
    title: 'Классическая встреча',
    text: 'Сбалансированный формат для комфортного вечера и спокойного общения.',
  },
  {
    title: 'VIP сопровождение',
    text: 'Приоритетный сервис с персональным сопровождением по вашим задачам.',
  },
  {
    title: 'Выездной формат',
    text: 'Гибкая организация встречи за пределами города по предварительному согласованию.',
  },
  {
    title: 'Срочное бронирование',
    text: 'Ускоренная обработка заявки для случаев, когда время критично.',
  },
];

const MeetingFormatsSection = () => {
  return (
    <section className="py-24 md:py-28 bg-[#0A0A0A]/35">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          eyebrow="Популярные форматы встреч"
          title="Выберите подходящий сценарий"
          description="Каждый формат адаптируется под ваши пожелания и подтверждается менеджером."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {FORMATS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="border border-white/10 bg-[#050505]/70 p-6 md:p-7 rounded-sm"
            >
              <h3 className="text-2xl text-[#D4AF37] mb-3">{item.title}</h3>
              <p className="text-sm md:text-base text-[#B0B0B7] leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetingFormatsSection;
