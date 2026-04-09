import React from 'react';
import { motion } from 'framer-motion';

const TermsPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-24" data-testid="terms-page">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] font-medium text-[#D4AF37] mb-4">
            Документы
          </p>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tighter leading-none text-[#F8F8F8] mb-12">
            Условия использования
          </h1>

          <div className="space-y-8 text-base text-[#A1A1AA] leading-relaxed">
            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">1. Общие условия</h2>
              <p>
                Используя сайт L'Aura, вы соглашаетесь с настоящими Условиями использования. Пожалуйста, внимательно прочитайте эти условия перед использованием сайта.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">2. Услуги</h2>
              <p>
                L'Aura предоставляет информационную платформу для знакомства с профилями премиум-компаньонок. Мы не несем ответственности за качество услуг, предоставляемых третьими лицами.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">3. Возрастные ограничения</h2>
              <p>
                Использование сайта разрешено только лицам, достигшим 18-летнего возраста. Используя сайт, вы подтверждаете, что достигли совершеннолетия.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">4. Правила поведения</h2>
              <p>
                При использовании сайта запрещается:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                <li>Использовать сайт в незаконных целях</li>
                <li>Нарушать права других пользователей</li>
                <li>Публиковать ложную информацию</li>
                <li>Попытки взлома или нарушения работы сайта</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">5. Интеллектуальная собственность</h2>
              <p>
                Все материалы сайта, включая текст, изображения, дизайн и логотипы, защищены авторским правом и являются собственностью L'Aura или ее партнеров.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">6. Ограничение ответственности</h2>
              <p>
                L'Aura не несет ответственности за:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                <li>Действия третьих лиц</li>
                <li>Перерывы в работе сайта</li>
                <li>Убытки, возникшие в результате использования сайта</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">7. Конфиденциальность</h2>
              <p>
                Мы гарантируем полную конфиденциальность всех обращений и персональных данных пользователей в соответствии с нашей Политикой конфиденциальности.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">8. Изменения условий</h2>
              <p>
                L'Aura оставляет за собой право изменять настоящие Условия использования в любое время. Актуальная версия всегда доступна на сайте.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">9. Применимое право</h2>
              <p>
                Настоящие Условия регулируются законодательством Российской Федерации. Все споры подлежат разрешению в соответствии с действующим законодательством.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">10. Контакты</h2>
              <p>
                По всем вопросам, связанным с использованием сайта, обращайтесь по адресу info@elegant.ru
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
