const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const rootUploadDir = path.join(__dirname, "../uploads");
const profileUploadDir = path.join(rootUploadDir, "profiles");
[rootUploadDir, profileUploadDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const isProfileUpload = req.originalUrl.includes("/api/uploads/profile-image");
    cb(null, isProfileUpload ? profileUploadDir : rootUploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = ALLOWED_EXT.has(ext) ? ext : ".jpg";
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${safeExt}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ok = /^image\/(jpeg|png|gif|webp)$/i.test(file.mimetype || "");
  if (ok) cb(null, true);
  else cb(new Error("Only JPEG, PNG, GIF or WebP images are allowed"));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

const handleMultipartFile = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ detail: "File too large (maximum 5 MB)" });
      }
      return res.status(400).json({ detail: err.message || "Upload failed" });
    }
    next();
  });
};

const handleProfileImageUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ detail: "Файл слишком большой. Максимум 5MB" });
      }
      return res.status(400).json({ detail: err.message || "Ошибка загрузки" });
    }
    next();
  });
};

module.exports = { upload, handleMultipartFile, handleProfileImageUpload };
