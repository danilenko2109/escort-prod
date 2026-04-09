const { sendTelegramMessage, escapeTelegramHtml } = require('../utils/telegram');
const db = require("../src/database/db");

const ALLOWED_DURATIONS = ["1h", "2h", "3h"];

const submitBookingRequest = async (req, res) => {
  const {
    profileCode,
    duration,
    bookingDate,
    bookingTime,
    clientName,
    clientPhone,
    extras,
    comment,
  } = req.body || {};

  if (!profileCode || !ALLOWED_DURATIONS.includes(duration)) {
    return res.status(400).json({ detail: "profileCode и duration (1h|2h|3h) обязательны" });
  }

  if (bookingDate && !/^\d{4}-\d{2}-\d{2}$/.test(String(bookingDate))) {
    return res.status(400).json({ detail: "Некорректная дата заявки" });
  }
  if (bookingTime && !/^\d{2}:\d{2}$/.test(String(bookingTime))) {
    return res.status(400).json({ detail: "Некорректное время заявки" });
  }
  if (clientName && String(clientName).trim().length < 2) {
    return res.status(400).json({ detail: "Имя должно быть не короче 2 символов" });
  }
  if (clientPhone && String(clientPhone).replace(/\D/g, "").length < 10) {
    return res.status(400).json({ detail: "Некорректный телефон" });
  }
  if (extras !== undefined && !Array.isArray(extras)) {
    return res.status(400).json({ detail: "extras должен быть массивом" });
  }
  if (comment && String(comment).length > 2000) {
    return res.status(400).json({ detail: "Комментарий слишком длинный" });
  }

  const bookingPhone = db.prepare("SELECT value FROM settings WHERE key = ?").get("booking_phone")?.value || "";

  const telegramText = [
    '<b>Новая заявка на анкету</b>',
    '',
    `<b>Код анкеты:</b> ${escapeTelegramHtml(String(profileCode).trim())}`,
    `<b>Длительность:</b> ${escapeTelegramHtml(String(duration).trim())}`,
    `<b>Дата:</b> ${escapeTelegramHtml(String(bookingDate || 'не указана').trim())}`,
    `<b>Время:</b> ${escapeTelegramHtml(String(bookingTime || 'не указано').trim())}`,
    `<b>Имя клиента:</b> ${escapeTelegramHtml(String(clientName || 'не указано').trim())}`,
    `<b>Телефон:</b> ${escapeTelegramHtml(String(clientPhone || 'не указан').trim())}`,
    `<b>Экстра:</b> ${escapeTelegramHtml((extras || []).join(', ') || 'нет')}`,
    `<b>Комментарий:</b> ${escapeTelegramHtml(String(comment || 'нет').trim())}`,
    `<b>Создано:</b> ${new Date().toLocaleString('ru-RU')}`,
  ].join('\n');

  let telegramDelivered = true;
  try {
    await sendTelegramMessage(telegramText);
  } catch (error) {
    telegramDelivered = false;
    console.error('Telegram send failed:', error.message);
  }

  return res.status(201).json({
    message: 'Заявка принята',
    phone: bookingPhone || '+7 (900) 000-00-00',
    telegramDelivered,
  });
};

module.exports = { submitBookingRequest };
