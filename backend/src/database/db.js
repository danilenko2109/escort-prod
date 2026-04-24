const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required. Configure external PostgreSQL (e.g. Supabase) before starting backend.");
}

const sslEnabled = process.env.PGSSLMODE !== "disable";

const pool = new Pool({
  connectionString,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
});

const normalizeSql = (sql) => {
  let index = 0;
  return sql.replace(/\?/g, () => {
    index += 1;
    return `$${index}`;
  });
};

const rawQuery = async (sql, params = []) => {
  const text = normalizeSql(sql);
  return pool.query(text, params);
};

const prepare = (sql) => ({
  get: async (...params) => {
    const result = await rawQuery(sql, params);
    return result.rows[0];
  },
  all: async (...params) => {
    const result = await rawQuery(sql, params);
    return result.rows;
  },
  run: async (...params) => {
    const result = await rawQuery(sql, params);
    return {
      changes: result.rowCount,
      lastInsertRowid: result.rows[0]?.id,
    };
  },
});

const init = async () => {
  await rawQuery(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id SERIAL PRIMARY KEY,
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
      id SERIAL PRIMARY KEY,
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

  await rawQuery(
    `INSERT INTO admins (username, password, created_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (username) DO NOTHING`,
    ["admin", "admin123", now]
  );

  await rawQuery(
    `INSERT INTO settings (key, value, updated_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (key) DO NOTHING`,
    ["booking_phone", "+7 (900) 000-00-00", now]
  );
};

module.exports = {
  init,
  prepare,
  query: rawQuery,
  pool,
};
