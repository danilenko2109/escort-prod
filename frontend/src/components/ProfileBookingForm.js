import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  Loader2,
  Sparkles,
  ShieldCheck,
  Send,
  X,
} from 'lucide-react';
import { requestAPI, settingsAPI } from '../services/api';

const SERVICES = [
  {
    key: 'meeting',
    title: 'Индивидуальная встреча',
    subtitle: 'Классический формат встречи',
  },
  {
    key: 'vip',
    title: 'VIP-сопровождение',
    subtitle: 'Расширенный сервис и приоритет',
  },
];

const DURATIONS = [
  { key: '1h', label: '1 час' },
  { key: '2h', label: '2 часа' },
  { key: '3h', label: '3 часа' },
];

const EXTRA_OPTIONS = [
  { key: 'out_of_city', label: 'Выезд за город' },
  { key: 'urgent_booking', label: 'Срочное бронирование' },
  { key: 'extra_support', label: 'Дополнительное сопровождение' },
];

function formatRub(n) {
  if (n == null || Number.isNaN(Number(n))) return '—';
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(Number(n));
}

function todayISODate() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

const ProfileBookingForm = ({ profile }) => {
  const [serviceKey, setServiceKey] = useState('meeting');
  const [duration, setDuration] = useState('1h');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [extras, setExtras] = useState([]);
  const [comment, setComment] = useState('');
  const [consent, setConsent] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingPhone, setBookingPhone] = useState('+7 (900) 000-00-00');

  useEffect(() => {
    const loadBookingPhone = async () => {
      try {
        const data = await settingsAPI.getBookingPhone();
        if (data?.phone) setBookingPhone(data.phone);
      } catch {
        // fallback to default is enough for UI
      }
    };
    loadBookingPhone();
  }, []);


  useEffect(() => {
    if (showSuccessModal) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showSuccessModal]);

  const price = useMemo(() => {
    if (!profile) return 0;
    if (duration === '1h') return profile.rate1h;
    if (duration === '2h') return profile.rate2h;
    return profile.rate3h;
  }, [profile, duration]);

  const serviceLabel = useMemo(
    () => SERVICES.find((s) => s.key === serviceKey)?.title || '',
    [serviceKey]
  );

  const durationLabel = useMemo(
    () => DURATIONS.find((d) => d.key === duration)?.label || '',
    [duration]
  );

  const validate = () => {
    const err = {};
    if (!bookingDate) err.bookingDate = 'Выберите дату';
    if (!bookingTime) err.bookingTime = 'Выберите время';
    if (!clientName.trim() || clientName.trim().length < 2) {
      err.clientName = 'Укажите имя (минимум 2 символа)';
    }
    const digits = clientPhone.replace(/\D/g, '');
    if (digits.length < 10) {
      err.clientPhone = 'Укажите корректный номер телефона';
    }
    if (!consent) err.consent = 'Необходимо согласие с политикой';
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setShowSuccessModal(false);
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await requestAPI.submit({
        profileCode: profile.code || String(profile.id),
        serviceKey,
        duration,
        bookingDate,
        bookingTime,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        extras,
        comment: comment.trim(),
        consent: true,
      });
      setBookingPhone(data.phone || bookingPhone);
      setShowSuccessModal(true);
    } catch (error) {
      setSubmitError(error.message || 'Не удалось отправить заявку');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBookingDate('');
    setBookingTime('');
    setClientName('');
    setClientPhone('');
    setExtras([]);
    setComment('');
    setConsent(false);
    setFieldErrors({});
    setSubmitError('');
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
      data-testid="profile-booking-form"
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#D4AF37]">Бронирование</p>
          <h3 className="mt-1 text-xl font-medium text-[#F8F8F8] sm:text-2xl">Премиум заявка</h3>
          <p className="mt-1 text-sm text-[#71717A]">Быстрая форма, проверка деталей и сопровождение менеджером до подтверждения</p>
        </div>
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#D4AF37]/25 bg-[#D4AF37]/5 sm:flex">
          <Sparkles className="text-[#D4AF37]" size={18} />
        </div>
      </div>

      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-sm border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-200/90"
          >
            {submitError}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <p className="mb-2 text-xs uppercase tracking-widest text-[#71717A]">Услуга</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setServiceKey(s.key)}
                className={`rounded-sm border px-4 py-3 text-left transition-all ${
                  serviceKey === s.key
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_24px_-8px_rgba(212,175,55,0.5)]'
                    : 'border-white/10 bg-[#050505]/40 hover:border-[#D4AF37]/30'
                }`}
              >
                <span className="block text-sm font-medium text-[#F8F8F8]">{s.title}</span>
                <span className="mt-0.5 block text-xs text-[#71717A]">{s.subtitle}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[#71717A]">
            <Clock size={14} className="text-[#D4AF37]" />
            Длительность
          </p>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setDuration(d.key)}
                className={`min-w-[5.5rem] flex-1 rounded-sm border px-3 py-2.5 text-center text-xs uppercase tracking-wider transition-colors sm:flex-none ${
                  duration === d.key
                    ? 'border-[#D4AF37] bg-[#D4AF37] text-[#050505]'
                    : 'border-white/15 text-[#A1A1AA] hover:border-[#D4AF37]/40'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[#71717A]">
              <Calendar size={14} className="text-[#D4AF37]" />
              Дата
            </label>
            <input
              type="date"
              min={todayISODate()}
              value={bookingDate}
              onChange={(e) => {
                setBookingDate(e.target.value);
                setFieldErrors((x) => ({ ...x, bookingDate: undefined }));
              }}
              className="w-full rounded-sm border border-white/15 bg-[#050505]/60 px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4AF37]"
            />
            {fieldErrors.bookingDate && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.bookingDate}</p>
            )}
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[#71717A]">
              <Clock size={14} className="text-[#D4AF37]" />
              Время
            </label>
            <input
              type="time"
              value={bookingTime}
              onChange={(e) => {
                setBookingTime(e.target.value);
                setFieldErrors((x) => ({ ...x, bookingTime: undefined }));
              }}
              className="w-full rounded-sm border border-white/15 bg-[#050505]/60 px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4AF37]"
            />
            {fieldErrors.bookingTime && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.bookingTime}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[#71717A]">
            <User size={14} className="text-[#D4AF37]" />
            Имя
          </label>
          <input
            type="text"
            autoComplete="name"
            value={clientName}
            onChange={(e) => {
              setClientName(e.target.value);
              setFieldErrors((x) => ({ ...x, clientName: undefined }));
            }}
            placeholder="Как к вам обращаться"
            className="w-full rounded-sm border border-white/15 bg-transparent px-0 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-[#D4AF37]"
          />
          {fieldErrors.clientName && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.clientName}</p>
          )}
        </div>
        <div>
          <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[#71717A]">
            <Phone size={14} className="text-[#D4AF37]" />
            Телефон
          </label>
          <input
            type="tel"
            autoComplete="tel"
            value={clientPhone}
            onChange={(e) => {
              setClientPhone(e.target.value);
              setFieldErrors((x) => ({ ...x, clientPhone: undefined }));
            }}
            placeholder="+7 (___) ___‑__‑__"
            className="w-full rounded-sm border border-white/15 bg-transparent px-0 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-[#D4AF37]"
          />
          {fieldErrors.clientPhone && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.clientPhone}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <p className="mb-2 text-xs uppercase tracking-widest text-[#71717A]">Экстра-услуги</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {EXTRA_OPTIONS.map((option) => (
              <label key={option.key} className="flex items-center gap-2 border border-white/10 px-3 py-2 rounded-sm">
                <input
                  type="checkbox"
                  checked={extras.includes(option.label)}
                  onChange={(e) => {
                    setExtras((prev) =>
                      e.target.checked
                        ? [...prev, option.label]
                        : prev.filter((item) => item !== option.label)
                    );
                  }}
                  className="h-4 w-4 accent-[#D4AF37]"
                />
                <span className="text-sm text-[#F8F8F8]">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[#71717A]">
            <MessageSquare size={14} className="text-[#D4AF37]" />
            Комментарий
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Пожелания по встрече, время уточнения и т.д."
            className="w-full resize-none rounded-sm border border-white/15 bg-[#050505]/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-sm border border-white/10 bg-white/[0.02] p-4">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            setFieldErrors((x) => ({ ...x, consent: undefined }));
          }}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#D4AF37]"
        />
        <span className="text-xs leading-relaxed text-[#A1A1AA]">
          Я согласен с{' '}
          <Link to="/privacy" className="text-[#D4AF37] underline underline-offset-2 hover:text-[#F3E5AB]">
            политикой конфиденциальности
          </Link>{' '}
          и обработкой персональных данных.
        </span>
      </label>
      {fieldErrors.consent && <p className="text-xs text-red-400">{fieldErrors.consent}</p>}

      <div className="rounded-sm border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06] p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37]">
          <ShieldCheck size={16} />
          Подтверждение заказа
        </div>
        <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
          <div className="flex justify-between gap-4 text-[#A1A1AA]">
            <span>Анкета</span>
            <span className="text-right text-[#F8F8F8]">{profile.name}</span>
          </div>
          <div className="flex justify-between gap-4 text-[#A1A1AA]">
            <span>Код</span>
            <span className="text-[#D4AF37]">{profile.code || profile.id}</span>
          </div>
          <div className="flex justify-between gap-4 text-[#A1A1AA]">
            <span>Услуга</span>
            <span className="text-right text-[#F8F8F8]">{serviceLabel}</span>
          </div>
          <div className="flex justify-between gap-4 text-[#A1A1AA]">
            <span>Длительность</span>
            <span className="text-[#F8F8F8]">{durationLabel}</span>
          </div>
          <div className="flex justify-between gap-4 pt-2 text-base font-medium text-[#F8F8F8]">
            <span>Итого (ориентир)</span>
            <span className="text-[#D4AF37]">{formatRub(price)}</span>
          </div>
          <p className="pt-2 text-xs text-[#71717A]">
            Оплата на сайте недоступна. Итоговая стоимость и детали подтверждаются менеджером по телефону.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] px-4 py-3 text-sm text-[#A1A1AA]">
        Квитанцию для связи с менеджером отправляйте в Telegram: <span className="text-[#D4AF37] font-medium">@aurasupportss_bot</span>.
      </div>

      <button
        type="submit"
        disabled={loading}
        className="relative flex w-full items-center justify-center gap-2 bg-[#D4AF37] py-4 text-sm font-medium uppercase tracking-[0.2em] text-[#050505] transition-colors hover:bg-[#F3E5AB] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Отправка...
          </>
        ) : (
          'Отправить заявку'
        )}
      </button>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-sm border border-[#D4AF37]/30 bg-[#0A0A0A] p-8 shadow-[0_0_80px_-20px_rgba(212,175,55,0.35)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-2xl font-medium text-[#D4AF37]">Заявка принята</h3>
                <p className="mt-4 text-sm uppercase tracking-widest text-[#A1A1AA]">Сумма к оплате</p>
              </div>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  resetForm();
                }}
                className="text-[#A1A1AA] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-2 text-4xl font-medium tracking-tight text-[#F8F8F8]">{formatRub(price)}</p>
            <p className="mt-5 text-[#A1A1AA]">Оплатите заявку по реквизитам ниже и сохраните квитанцию об оплате.</p>
            <p className="mt-2 text-3xl font-medium tracking-tight text-[#D4AF37]">{bookingPhone}</p>
            <div className="mt-6 rounded-sm border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-4 text-sm text-[#F8F8F8]">
После оплаты отправьте квитанцию в Telegram <span className="text-[#D4AF37] font-medium">@aurasupportss_bot</span>, чтобы менеджер подтвердил заказ и отправил детали.
            </div>
            <a
              href="https://t.me/aurasupportss_bot"
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 border border-[#D4AF37]/45 bg-transparent py-3 text-sm uppercase tracking-widest text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/10"
            >
              <Send size={16} />
              Перейти в Telegram
            </a>
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                resetForm();
              }}
              className="mt-8 w-full bg-[#D4AF37] text-[#050505] hover:bg-[#F3E5AB] py-3 uppercase tracking-widest text-sm"
            >
              Готово
            </button>
          </div>
        </div>
      )}
    </motion.form>
  );
};

export default ProfileBookingForm;
