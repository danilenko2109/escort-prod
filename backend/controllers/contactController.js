const db = require("../src/database/db");

const { sendTelegramMessage, escapeTelegramHtml } = require('../utils/telegram');

const submitContact = async (req, res) => {
  const { name, email, phone, message } = req.body || {};
  if (!name || !phone || !message) {
    return res.status(400).json({ detail: "name, phone, message обязательны" });
  }
  if (String(name).trim().length < 2) {
    return res.status(400).json({ detail: "Имя должно быть не короче 2 символов" });
  }
  if (String(phone).replace(/\D/g, "").length < 10) {
    return res.status(400).json({ detail: "Некорректный телефон" });
  }
  if (email && !/^\S+@\S+\.\S+$/.test(String(email))) {
    return res.status(400).json({ detail: "Некорректный email" });
  }
  if (String(message).trim().length < 3) {
    return res.status(400).json({ detail: "Сообщение слишком короткое" });
  }

  const now = new Date().toISOString();
  const result = db
    .prepare(
      "INSERT INTO contact_messages (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, ?)"
    )
    .run(name, email || "", phone, message, now);

  const telegramText = [
    "<b>Новая заявка из формы связи</b>",
    "",
    `<b>Имя:</b> ${escapeTelegramHtml(String(name).trim())}`,
    `<b>Телефон:</b> ${escapeTelegramHtml(String(phone).trim())}`,
    `<b>Email:</b> ${escapeTelegramHtml(String(email || "не указан").trim())}`,
    `<b>Сообщение:</b> ${escapeTelegramHtml(String(message).trim())}`,
    `<b>Дата/время:</b> ${new Date().toLocaleString("ru-RU")}`,
  ].join("\n");

  let telegramDelivered = true;
  try {
    await sendTelegramMessage(telegramText);
  } catch (error) {
    telegramDelivered = false;
    console.error("Telegram send failed:", error.message);
  }

  return res.status(201).json({
    message: "Message sent successfully",
    id: String(result.lastInsertRowid),
    telegramDelivered,
  });
};

module.exports = { submitContact };
