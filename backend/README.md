## PostgreSQL on Supabase (for Render Free web service)

This backend now requires an external PostgreSQL database via `DATABASE_URL`.

### 1) Create Supabase Postgres
1. Create a Supabase project.
2. Copy your connection string from **Project Settings → Database**.
3. Use the pooler connection string in Render env as `DATABASE_URL`.

Example:

```bash
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=require
```

### 2) Configure Render (free web service)
Set these env vars on Render service:
- `DATABASE_URL`
- `ADMIN_TOKEN`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

### 3) Migrate local SQLite data into PostgreSQL
From `backend/` directory:

```bash
# optional custom path
# export SQLITE_PATH=/absolute/path/to/agency.db

export DATABASE_URL='postgresql://...'
npm run migrate:sqlite-to-postgres
```

The migration script copies these tables:
- `admins`
- `profiles`
- `contact_messages`
- `settings`

### 4) Start locally

```bash
npm install
npm start
```

On startup the backend auto-creates required tables in PostgreSQL and seeds:
- default admin (`admin` / `admin123`) if missing
- `booking_phone` setting if missing
