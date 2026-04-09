const path = require("path");

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ detail: "No file uploaded" });
  }
  const publicPath = `/uploads/${path.basename(req.file.path)}`;
  return res.status(201).json({ url: publicPath });
};

const uploadProfileImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ detail: "Файл изображения не передан" });
  }
  const filename = path.basename(req.file.path);
  return res.status(201).json({ url: `/uploads/profiles/${filename}` });
};

module.exports = { uploadImage, uploadProfileImage };
