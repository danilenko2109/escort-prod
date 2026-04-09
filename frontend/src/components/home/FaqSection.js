import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SectionHeading from './SectionHeading';

const FAQ_ITEMS = [
  {
    question: 'Как быстро подтверждается заявка?',
    answer: 'Обычно менеджер связывается в ближайшее время после отправки формы и уточняет детали встречи.',
  },
  {
    question: 'Можно ли указать дополнительные пожелания?',
    answer: 'Да, в форме есть поле комментария и экстра-услуги. Вы можете описать желаемый формат максимально подробно.',
  },
 
  {
    question: 'Сохраняется ли конфиденциальность обращения?',
    answer: 'Да, Elegant придерживается строгих правил конфиденциальности и ограниченного доступа к данным.',
  },
];

const FaqSection = () => {
  const [openId, setOpenId] = useState(0);

  return (
    <section className="py-24 md:py-28">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <SectionHeading
          eyebrow="FAQ"
          title="Ответы на частые вопросы"
          description="Коротко и по делу о бронировании, подтверждении и приватности."
        />

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openId === idx;
            return (
              <div key={item.question} className="border border-white/10 bg-[#0A0A0A]/60 rounded-sm">
                <button
                  type="button"
                  onClick={() => setOpenId((prev) => (prev === idx ? -1 : idx))}
                  className="w-full px-5 py-4 md:px-6 md:py-5 flex items-center justify-between gap-3 text-left"
                >
                  <span className="text-lg text-[#F8F8F8]">{item.question}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#D4AF37] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 md:px-6 md:pb-6 text-[#A1A1AA] leading-relaxed">{item.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
