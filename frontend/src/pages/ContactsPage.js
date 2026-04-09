import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { contactAPI } from '../services/api';
import { toast } from 'sonner';

const ContactsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactAPI.submit(formData);
      toast.success('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Ошибка отправки. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24" data-testid="contacts-page">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] font-medium text-[#D4AF37] mb-4">
            Контакты
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tighter leading-none text-[#F8F8F8] mb-6">
            Свяжитесь с нами
          </h1>
          <p className="text-base text-[#A1A1AA] max-w-2xl mx-auto">
            Мы всегда рады ответить на ваши вопросы и помочь с выбором
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-xl bg-[#0A0A0A]/60 border border-white/10 p-8 rounded-sm"
          >
            <h2 className="text-2xl font-medium text-[#D4AF37] mb-6">
              Отправить сообщение
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">
                  Имя *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 px-0 outline-none transition-colors"
                  data-testid="contact-name-input"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 px-0 outline-none transition-colors"
                  data-testid="contact-email-input"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">
                  Телефон *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#D4AF37] text-white py-3 px-0 outline-none transition-colors"
                  data-testid="contact-phone-input"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 uppercase tracking-widest">
                  Сообщение *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-transparent border border-white/20 focus:border-[#D4AF37] text-white py-3 px-4 outline-none transition-colors resize-none"
                  data-testid="contact-message-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4AF37] text-[#050505] hover:bg-[#F3E5AB] transition-colors py-4 uppercase tracking-widest text-sm font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="contact-submit-button"
              >
                {loading ? (
                  <span>Отправка...</span>
                ) : (
                  <>
                    <span>Отправить</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-medium text-[#D4AF37] mb-6">
                Наши контакты
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-[#D4AF37]" size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs text-[#71717A] uppercase tracking-widest mb-1">Email</p>
                    <a href="mailto:info@elegant.ru" className="text-[#F8F8F8] hover:text-[#D4AF37] transition-colors">
                      info@elegant.ru
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-[#D4AF37]" size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs text-[#71717A] uppercase tracking-widest mb-1">Телефон</p>
                    <a href="tel:+74951234567" className="text-[#F8F8F8] hover:text-[#D4AF37] transition-colors">
                      +7 (495) 123-45-67
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-[#D4AF37]" size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs text-[#71717A] uppercase tracking-widest mb-1">Адрес</p>
                    <p className="text-[#F8F8F8]">
                      Москва, Россия
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lips-divider my-8"></div>

            <div className="backdrop-blur-xl bg-[#0A0A0A]/60 border border-white/10 p-6 rounded-sm">
              <h3 className="text-lg font-medium text-[#D4AF37] mb-4">
                Часы работы
              </h3>
              <div className="space-y-2 text-sm text-[#A1A1AA]">
                <div className="flex justify-between">
                  <span>Понедельник - Пятница</span>
                  <span className="text-[#F8F8F8]">10:00 - 22:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Суббота - Воскресенье</span>
                  <span className="text-[#F8F8F8]">12:00 - 20:00</span>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-[#0A0A0A]/60 border border-white/10 p-6 rounded-sm">
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Мы гарантируем конфиденциальность всех обращений и персональный подход к каждому клиенту.
                Наши специалисты помогут вам с выбором и ответят на все вопросы.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
