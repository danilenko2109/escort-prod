import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const STEPS = [
  { title: 'Выберите анкету', text: 'Откройте профиль, изучите параметры и подходящий формат встречи.' },
  { title: 'Заполните заявку', text: 'Укажите дату, время и пожелания в удобной форме без лишних шагов.' },
  { title: 'Подтвердите по телефону', text: 'Менеджер уточняет детали и подтверждает итоговые условия.' },
  { title: 'Наслаждайтесь сервисом', text: 'Elegant сопровождает вас на каждом этапе взаимодействия.' },
];

const BookingStepsSection = () => {
  return (
    <section className="py-24 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          eyebrow="Как проходит бронирование"
          title="Прозрачный процесс в 4 шага"
          description="Минимум действий на сайте и максимальная персонализация при подтверждении."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="relative border border-white/10 bg-[#0A0A0A]/60 p-6 rounded-sm"
            >
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">Шаг {idx + 1}</span>
              <h3 className="text-xl text-[#F8F8F8] mt-3 mb-2">{step.title}</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookingStepsSection;
