const slugify = require("slugify");
const db = require("../src/database/db");

const parseList = (value) => {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

const normalizeImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, 3);
};

const toProfileResponse = (row) => {
  if (!row) return null;
  return {
    id: String(row.id),
    code: row.code,
    slug: row.slug,
    name: row.name,
    age: row.age,
    city: row.city,
    country: row.country,
    descriptionShort: row.description_short,
    descriptionFull: row.description_full,
    images: parseList(row.images),
    height: row.height,
    weight: row.weight,
    languages: parseList(row.languages),
    tags: parseList(row.tags),
    isActive: Boolean(row.is_active),
    isFeatured: Boolean(row.is_featured),
    rate1h: row.rate_1h,
    rate2h: row.rate_2h,
    rate3h: row.rate_3h,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const buildCode = (inputCode, name) => {
  if (inputCode && String(inputCode).trim()) {
    return slugify(String(inputCode), { lower: true, strict: true });
  }
  return slugify(String(name || "profile"), { lower: true, strict: true });
};

const listProfiles = (req, res) => {
  const { featured_only, active_only } = req.query;
  const conditions = [];
  const params = [];

  if (featured_only === "true") {
    conditions.push("is_featured = 1");
  }
  if (active_only !== "false") {
    conditions.push("is_active = 1");
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = db
    .prepare(`SELECT * FROM profiles ${whereClause} ORDER BY updated_at DESC`)
    .all(...params);

  res.json(rows.map(toProfileResponse));
};

const getProfileById = (req, res) => {
  const row = db.prepare("SELECT * FROM profiles WHERE id = ?").get(Number(req.params.id));
  if (!row) {
    return res.status(404).json({ detail: "Profile not found" });
  }
  return res.json(toProfileResponse(row));
};

const searchProfileByCode = (req, res) => {
  const code = slugify(String(req.query.code || ""), { lower: true, strict: true });
  if (!code) {
    return res.status(400).json({ detail: "code query is required" });
  }
  const row = db.prepare("SELECT * FROM profiles WHERE code = ?").get(code);
  if (!row) {
    return res.status(404).json({ detail: "Profile not found" });
  }
  return res.json(toProfileResponse(row));
};

const createProfile = (req, res) => {
  const body = req.body || {};
  if (!body.name) {
    return res.status(400).json({ detail: "name is required" });
  }
  const images = normalizeImages(body.images);
  if (!images.length) {
    return res.status(400).json({ detail: "Минимум 1 фото обязательно" });
  }
  if (Array.isArray(body.images) && body.images.length > 3) {
    return res.status(400).json({ detail: "Можно загрузить максимум 3 фото" });
  }

  const now = new Date().toISOString();
  const code = buildCode(body.code, body.name);
  const slug = code;

  try {
    const result = db
      .prepare(
        `INSERT INTO profiles (
          code, slug, name, age, city, country, description_short, description_full,
          images, height, weight, languages, tags, is_active, is_featured,
          rate_1h, rate_2h, rate_3h, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        code,
        slug,
        body.name,
        Number(body.age || 21),
        body.city || "",
        body.country || "Россия",
        body.descriptionShort || "",
        body.descriptionFull || "",
        JSON.stringify(images),
        Number(body.height || 170),
        Number(body.weight || 55),
        JSON.stringify(body.languages || []),
        JSON.stringify(body.tags || []),
        body.isActive === false ? 0 : 1,
        body.isFeatured ? 1 : 0,
        Number(body.rate1h || 10000),
        Number(body.rate2h || 18000),
        Number(body.rate3h || 25000),
        now,
        now
      );

    const created = db.prepare("SELECT * FROM profiles WHERE id = ?").get(result.lastInsertRowid);
    return res.status(201).json(toProfileResponse(created));
  } catch (error) {
    if (String(error.message).includes("UNIQUE")) {
      return res.status(409).json({ detail: "Profile code must be unique" });
    }
    return res.status(500).json({ detail: "Failed to create profile" });
  }
};

const updateProfile = (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM profiles WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ detail: "Profile not found" });
  }

  const body = req.body || {};
  const incomingImages = body.images === undefined ? parseList(existing.images) : normalizeImages(body.images);
  if (!incomingImages.length) {
    return res.status(400).json({ detail: "У анкеты должно быть хотя бы 1 фото" });
  }
  if (Array.isArray(body.images) && body.images.length > 3) {
    return res.status(400).json({ detail: "Можно загрузить максимум 3 фото" });
  }
  const updated = {
    code: buildCode(body.code ?? existing.code, body.name ?? existing.name),
    name: body.name ?? existing.name,
    age: Number(body.age ?? existing.age),
    city: body.city ?? existing.city,
    country: body.country ?? existing.country,
    description_short: body.descriptionShort ?? existing.description_short,
    description_full: body.descriptionFull ?? existing.description_full,
    images: JSON.stringify(incomingImages),
    height: Number(body.height ?? existing.height),
    weight: Number(body.weight ?? existing.weight),
    languages: JSON.stringify(body.languages ?? parseList(existing.languages)),
    tags: JSON.stringify(body.tags ?? parseList(existing.tags)),
    is_active: body.isActive === undefined ? existing.is_active : (body.isActive ? 1 : 0),
    is_featured: body.isFeatured === undefined ? existing.is_featured : (body.isFeatured ? 1 : 0),
    rate_1h: Number(body.rate1h ?? existing.rate_1h),
    rate_2h: Number(body.rate2h ?? existing.rate_2h),
    rate_3h: Number(body.rate3h ?? existing.rate_3h),
    updated_at: new Date().toISOString(),
  };

  try {
    db.prepare(
      `UPDATE profiles SET
        code = ?, slug = ?, name = ?, age = ?, city = ?, country = ?,
        description_short = ?, description_full = ?, images = ?, height = ?, weight = ?,
        languages = ?, tags = ?, is_active = ?, is_featured = ?, rate_1h = ?, rate_2h = ?, rate_3h = ?, updated_at = ?
      WHERE id = ?`
    ).run(
      updated.code,
      updated.code,
      updated.name,
      updated.age,
      updated.city,
      updated.country,
      updated.description_short,
      updated.description_full,
      updated.images,
      updated.height,
      updated.weight,
      updated.languages,
      updated.tags,
      updated.is_active,
      updated.is_featured,
      updated.rate_1h,
      updated.rate_2h,
      updated.rate_3h,
      updated.updated_at,
      id
    );
  } catch (error) {
    if (String(error.message).includes("UNIQUE")) {
      return res.status(409).json({ detail: "Profile code must be unique" });
    }
    return res.status(500).json({ detail: "Failed to update profile" });
  }

  const row = db.prepare("SELECT * FROM profiles WHERE id = ?").get(id);
  return res.json(toProfileResponse(row));
};

const deleteProfile = (req, res) => {
  const result = db.prepare("DELETE FROM profiles WHERE id = ?").run(Number(req.params.id));
  if (!result.changes) {
    return res.status(404).json({ detail: "Profile not found" });
  }
  return res.json({ message: "Profile deleted successfully" });
};

module.exports = {
  listProfiles,
  getProfileById,
  searchProfileByCode,
  createProfile,
  updateProfile,
  deleteProfile,
};