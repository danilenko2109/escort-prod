const db = require("../src/database/db");

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "simple-admin-token";

const adminLogin = async (req, res) => {
  const { username, password } = req.body || {};
  const admin = await db
    .prepare("SELECT username FROM admins WHERE username = ? AND password = ?")
    .get(username, password);

  if (!admin) {
    return res.status(401).json({ detail: "Invalid credentials" });
  }

  return res.json({ token: ADMIN_TOKEN, username: admin.username });
};

const getAdminMe = (_req, res) => {
  res.json({ username: "admin" });
};

const getAdminStats = async (_req, res) => {
  const totalProfiles = (await db.prepare("SELECT COUNT(*) AS c FROM profiles").get()).c;
  const activeProfiles = (await db.prepare("SELECT COUNT(*) AS c FROM profiles WHERE is_active = 1").get()).c;
  const featuredProfiles = (await db.prepare("SELECT COUNT(*) AS c FROM profiles WHERE is_featured = 1").get()).c;
  const totalMessages = (await db.prepare("SELECT COUNT(*) AS c FROM contact_messages").get()).c;

  res.json({
    total_profiles: totalProfiles,
    active_profiles: activeProfiles,
    featured_profiles: featuredProfiles,
    total_messages: totalMessages,
  });
};

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ detail: "Unauthorized" });
  }
  return next();
};

module.exports = { adminLogin, getAdminMe, getAdminStats, requireAdmin };
