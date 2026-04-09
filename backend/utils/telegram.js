const escapeTelegramHtml = (value) => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

const sendTelegramMessage = async (text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы");
  }

  const tokenLooksValid = /^\d+:[\w-]{20,}$/.test(token);
  if (!tokenLooksValid) {
    throw new Error("TELEGRAM_BOT_TOKEN имеет некорректный формат");
  }

  const chatIdLooksValid = /^-?\d+$/.test(String(chatId)) || /^@[\w\d_]{5,}$/.test(String(chatId));
  if (!chatIdLooksValid) {
    throw new Error("TELEGRAM_CHAT_ID должен быть числом или @channel_username");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Telegram API error: ${response.status} ${detail}`);
  }

  return true;
};

module.exports = { sendTelegramMessage, escapeTelegramHtml };
