const path = require("path");
const express = require("express");
const cors = require("cors");
const profileRoutes = require("../routes/profileRoutes");
const adminRoutes = require("../routes/adminRoutes");
const contactRoutes = require("../routes/contactRoutes");
const requestRoutes = require("../routes/requestRoutes");
const settingsRoutes = require("../routes/settingsRoutes");
const { uploadImage, uploadProfileImage } = require("../controllers/uploadController");
const { requireAdmin } = require("../controllers/adminController");
const { handleMultipartFile, handleProfileImageUpload } = require("../middleware/multerUpload");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

const uploadsPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "escort1000-node-express", bundle: "frontend/backend" });
});

const uploadApi = express.Router();
uploadApi.get("/upload/info", (_req, res) => {
  res.json({
    ok: true,
    service: "escort1000-node-express",
    bundle: "frontend/backend",
    method: "POST",
    path: "/api/upload",
    formField: "file",
  });
});
uploadApi.post("/upload", requireAdmin, handleMultipartFile, uploadImage);
uploadApi.post("/uploads/profile-image", requireAdmin, handleProfileImageUpload, uploadProfileImage);
app.use("/api", uploadApi);

app.use("/api/profiles", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/settings", settingsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ detail: "Internal server error" });
});

module.exports = app;
