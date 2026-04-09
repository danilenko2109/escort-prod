import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-24" data-testid="privacy-page">
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
            Политика конфиденциальности
          </h1>

          <div className="space-y-8 text-base text-[#A1A1AA] leading-relaxed">
            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">1. Общие положения</h2>
              <p>
                Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта L'Aura. Мы уважаем вашу конфиденциальность и обязуемся защищать вашу личную информацию.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">2. Сбор информации</h2>
              <p>
                Мы собираем информацию, которую вы предоставляете при использовании нашего сайта:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                <li>Имя и контактные данные</li>
                <li>Информация о поиске и предпочтениях</li>
                <li>Данные об использовании сайта</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">3. Использование информации</h2>
              <p>
                Собранная информация используется для:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                <li>Предоставления и улучшения наших услуг</li>
                <li>Персонализации вашего опыта</li>
                <li>Связи с вами по вопросам обслуживания</li>
                <li>Соблюдения законодательных требований</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">4. Защита данных</h2>
              <p>
                Мы применяем современные методы защиты информации и обеспечиваем конфиденциальность ваших данных. Доступ к персональной информации имеют только уполномоченные сотрудники.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">5. Cookies</h2>
              <p>
                Наш сайт использует файлы cookie для улучшения пользовательского опыта и аналитики. Вы можете настроить использование cookies в настройках вашего браузера.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">6. Ваши права</h2>
              <p>
                Вы имеете право:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                <li>Получить доступ к своим персональным данным</li>
                <li>Исправить неточную информацию</li>
                <li>Удалить свои данные</li>
                <li>Отозвать согласие на обработку данных</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">7. Изменения в политике</h2>
              <p>
                Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности. Актуальная версия всегда доступна на нашем сайте.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-4">8. Контакты</h2>
              <p>
                По вопросам, касающимся обработки персональных данных, вы можете обратиться к нам по адресу info@elegant.ru
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;
