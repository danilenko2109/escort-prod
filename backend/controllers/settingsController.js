const db = require("../src/database/db");

const getBookingPhone = (_req, res) => {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get("booking_phone");
  return res.json({ phone: row?.value || "" });
};

const updateBookingPhone = (req, res) => {
  const phone = String(req.body?.phone || "").trim();
  if (phone.length < 5) {
    return res.status(400).json({ detail: "Укажите корректный номер телефона" });
  }

  db.prepare("INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?)").run(
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
