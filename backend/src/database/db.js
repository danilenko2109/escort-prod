const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dataDir = path.join(__dirname, "../../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "agency.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    age INTEGER NOT NULL DEFAULT 21,
    city TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT 'Россия',
    description_short TEXT NOT NULL DEFAULT '',
    description_full TEXT NOT NULL DEFAULT '',
    images TEXT NOT NULL DEFAULT '[]',
    height INTEGER NOT NULL DEFAULT 170,
    weight INTEGER NOT NULL DEFAULT 55,
    languages TEXT NOT NULL DEFAULT '[]',
    tags TEXT NOT NULL DEFAULT '[]',
    is_active INTEGER NOT NULL DEFAULT 1,
    is_featured INTEGER NOT NULL DEFAULT 0,
    rate_1h INTEGER NOT NULL DEFAULT 10000,
    rate_2h INTEGER NOT NULL DEFAULT 18000,
    rate_3h INTEGER NOT NULL DEFAULT 25000,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

const now = new Date().toISOString();
const adminExists = db.prepare("SELECT id FROM admins WHERE username = ?").get("admin");
if (!adminExists) {
  db.prepare(
    "INSERT INTO admins (username, password, created_at) VALUES (?, ?, ?)"
  ).run("admin", "admin123", now);
}

const bookingPhoneSetting = db.prepare("SELECT key FROM settings WHERE key = ?").get("booking_phone");
if (!bookingPhoneSetting) {
  db.prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)").run(
    "booking_phone",
    "+7 (900) 000-00-00",
    now
  );
}

module.exports = db;