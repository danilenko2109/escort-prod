import React from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Heart, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-24" data-testid="about-page">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] font-medium text-[#D4AF37] mb-4">
            О нас
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tighter leading-none text-[#F8F8F8] mb-6">
            Elegant
          </h1>
          <p className="text-lg text-[#A1A1AA] leading-relaxed">
            Премиальное агентство по подбору элитных спутниц
          </p>
        </motion.div>

        <div className="lips-divider mb-16"></div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <h2 className="text-3xl sm:text-4xl font-medium text-[#D4AF37] mb-6">
            Наша история
          </h2>
          <div className="space-y-6 text-base text-[#A1A1AA] leading-relaxed">
            <p>
              L'Aura - это не просто агентство. Это философия утонченности, воплощенная в каждой детали нашей работы. Мы создали пространство, где элегантность встречается с изысканностью, а каждая встреча становится незабываемым опытом.
            </p>
            <p>
              За годы работы мы собрали коллекцию тщательно отобранных профилей, каждый из которых олицетворяет наши строгие стандарты качества, профессионализма и утонченности.
            </p>
            <p>
              Наше агентство основано на трех ключевых принципах: конфиденциальность, качество и индивидуальный подход. Мы понимаем, что каждый клиент уникален, и наша задача - создать идеальный опыт для каждого.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <h2 className="text-3xl sm:text-4xl font-medium text-[#D4AF37] mb-12">
            Наши ценности
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="backdrop-blur-xl bg-[#0A0A0A]/60 border border-white/10 p-8">
              <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center mb-6">
                <Star className="text-[#D4AF37]" size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-[#F8F8F8] mb-4">
                Премиальное качество
              </h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Тщательный отбор каждого профиля. Мы работаем только с лучшими, чтобы гарантировать высочайший уровень обслуживания.
              </p>
            </div>

            <div className="backdrop-blur-xl bg-[#0A0A0A]/60 border border-white/10 p-8">
              <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center mb-6">
                <Shield className="text-[#D4AF37]" size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-[#F8F8F8] mb-4">
                Конфиденциальность
              </h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Полная гарантия конфиденциальности и защиты личных данных. Ваше спокойствие - наш приоритет.
              </p>
            </div>

            <div className="backdrop-blur-xl bg-[#0A0A0A]/60 border border-white/10 p-8">
              <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center mb-6">
                <Heart className="text-[#D4AF37]" size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-[#F8F8F8] mb-4">
                Индивидуальный подход
              </h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Персонализированный сервис и внимание к каждой детали. Мы создаем уникальный опыт для каждого клиента.
              </p>
            </div>

            <div className="backdrop-blur-xl bg-[#0A0A0A]/60 border border-white/10 p-8">
              <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center mb-6">
                <Award className="text-[#D4AF37]" size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-[#F8F8F8] mb-4">
                Профессионализм
              </h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Многолетний опыт и безупречная репутация в индустрии. Мы знаем, как сделать ваш опыт идеальным.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="lips-divider mb-16"></div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-lg text-[#A1A1AA] mb-8">
            Готовы узнать больше?
          </p>
          <a
            href="/contacts"
            className="inline-block bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] transition-all duration-300 uppercase tracking-widest text-sm py-4 px-12"
            data-testid="contact-cta-button"
          >
            Связаться с нами
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;