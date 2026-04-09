import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 mt-24" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-xs font-semibold">EG</div>
              <span className="text-2xl font-medium text-[#D4AF37]">Elegant</span>
            </div>
            <p className="text-sm text-[#71717A] leading-relaxed">
              Премиальный каталог избранных профилей. Утонченность, элегантность, конфиденциальность.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-[#D4AF37] mb-4">
              Навигация
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
                  data-testid="footer-link-home"
                >
                  Главная
                </Link>
              </li>
              <li>
                <Link
                  to="/profiles"
                  className="text-sm text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
                  data-testid="footer-link-profiles"
                >
                  Профили
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
                  data-testid="footer-link-about"
                >
                  О нас
                </Link>
              </li>
              <li>
                <Link
                  to="/contacts"
                  className="text-sm text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
                  data-testid="footer-link-contacts"
                >
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-[#D4AF37] mb-4">
              Информация
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
                  data-testid="footer-link-privacy"
                >
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
                  data-testid="footer-link-terms"
                >
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-[#D4AF37] mb-4">
              Контакты
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sm text-[#A1A1AA]">
                <Mail size={16} className="text-[#D4AF37]" />
                <span>info@elegant.ru</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-[#A1A1AA]">
                <Phone size={16} className="text-[#D4AF37]" />
                <span>+7 (495) 123-45-67</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-[#A1A1AA]">
                <MapPin size={16} className="text-[#D4AF37]" />
                <span>Москва, Россия</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="lips-divider mt-12 mb-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-[#71717A]">
            © {currentYear} Elegant. Все права защищены.
          </p>
          <p className="text-xs text-[#71717A] uppercase tracking-widest">
            Эскорт агентство
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;