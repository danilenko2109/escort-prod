#!/usr/bin/env node
const path = require("path");
const sqlite3 = require("sqlite3");
const { Pool } = require("pg");

const sqlitePath = process.env.SQLITE_PATH || path.join(__dirname, "../data/agency.db");
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const sslEnabled = process.env.PGSSLMODE !== "disable";
const pool = new Pool({
  connectionString,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
});

const sqlite = new sqlite3.Database(sqlitePath, sqlite3.OPEN_READONLY);

const sqliteAll = (query) =>
  new Promise((resolve, reject) => {
    sqlite.all(query, (error, rows) => {
      if (error) return reject(error);
      resolve(rows);
    });
  });

const run = async (client, query, params) => client.query(query, params);

const migrateTable = async (client, table, rows) => {
  if (!rows.length) {
    console.log(`Skipping ${table}: no rows`);
    return;
  }

  if (table === "admins") {
    for (const row of rows) {
      await run(
        client,
        `INSERT INTO admins (id, username, password, created_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, password = EXCLUDED.password, created_at = EXCLUDED.created_at`,
        [row.id, row.username, row.password, row.created_at]
      );
    }
  }

  if (table === "profiles") {
    for (const row of rows) {
      await run(
        client,
        `INSERT INTO profiles (
          id, code, slug, name, age, city, country, description_short, description_full,
          images, height, weight, languages, tags, is_active, is_featured,
          rate_1h, rate_2h, rate_3h, created_at, updated_at
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,
          $10,$11,$12,$13,$14,$15,$16,
          $17,$18,$19,$20,$21
        )
        ON CONFLICT (id) DO UPDATE SET
          code = EXCLUDED.code,
          slug = EXCLUDED.slug,
          name = EXCLUDED.name,
          age = EXCLUDED.age,
          city = EXCLUDED.city,
          country = EXCLUDED.country,
          description_short = EXCLUDED.description_short,
          description_full = EXCLUDED.description_full,
          images = EXCLUDED.images,
          height = EXCLUDED.height,
          weight = EXCLUDED.weight,
          languages = EXCLUDED.languages,
          tags = EXCLUDED.tags,
          is_active = EXCLUDED.is_active,
          is_featured = EXCLUDED.is_featured,
          rate_1h = EXCLUDED.rate_1h,
          rate_2h = EXCLUDED.rate_2h,
          rate_3h = EXCLUDED.rate_3h,
          created_at = EXCLUDED.created_at,
          updated_at = EXCLUDED.updated_at`,
        [
          row.id,
          row.code,
          row.slug,
          row.name,
          row.age,
          row.city,
          row.country,
          row.description_short,
          row.description_full,
          row.images,
          row.height,
          row.weight,
          row.languages,
          row.tags,
          row.is_active,
          row.is_featured,
          row.rate_1h,
          row.rate_2h,
          row.rate_3h,
          row.created_at,
          row.updated_at,
        ]
      );
    }
  }

  if (table === "contact_messages") {
    for (const row of rows) {
      await run(
        client,
        `INSERT INTO contact_messages (id, name, email, phone, message, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            message = EXCLUDED.message,
            created_at = EXCLUDED.created_at`,
        [row.id, row.name, row.email, row.phone, row.message, row.created_at]
      );
    }
  }

  if (table === "settings") {
    for (const row of rows) {
      await run(
        client,
        `INSERT INTO settings (key, value, updated_at)
         VALUES ($1, $2, $3)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at`,
        [row.key, row.value, row.updated_at]
      );
    }
  }

  console.log(`Migrated ${rows.length} row(s) from ${table}`);
};

const resetSequences = async (client) => {
  await client.query(`SELECT setval(pg_get_serial_sequence('admins', 'id'), COALESCE(MAX(id), 1), true) FROM admins`);
  await client.query(`SELECT setval(pg_get_serial_sequence('profiles', 'id'), COALESCE(MAX(id), 1), true) FROM profiles`);
  await client.query(`SELECT setval(pg_get_serial_sequence('contact_messages', 'id'), COALESCE(MAX(id), 1), true) FROM contact_messages`);
};

const main = async () => {
  const client = await pool.connect();
  try {
    console.log(`Migrating SQLite -> Postgres from ${sqlitePath}`);
    await client.query("BEGIN");

    const tables = ["admins", "profiles", "contact_messages", "settings"];
    for (const table of tables) {
      const rows = await sqliteAll(`SELECT * FROM ${table}`);
      await migrateTable(client, table, rows);
    }

    await resetSequences(client);
    await client.query("COMMIT");
    console.log("Migration completed successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    sqlite.close();
    await pool.end();
  }
};

main();
