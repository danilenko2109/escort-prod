const db = require("../src/database/db");

const getBookingPhone = async (_req, res) => {
  const row = await db.prepare("SELECT value FROM settings WHERE key = ?").get("booking_phone");
  return res.json({ phone: row?.value || "" });
};

const updateBookingPhone = async (req, res) => {
  const phone = String(req.body?.phone || "").trim();
  if (phone.length < 5) {
    return res.status(400).json({ detail: "Укажите корректный номер телефона" });
  }

  await db.prepare(
    `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at`
  ).run(
    "booking_phone",
    phone,
    new Date().toISOString()
  );

  return res.json({ phone });
};

module.exports = {
  getBookingPhone,
  updateBookingPhone,
};
