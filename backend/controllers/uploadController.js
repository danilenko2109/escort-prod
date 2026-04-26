const path = require("path");
const { uploadFileToCloudinary } = require("../utils/cloudinaryUpload");

const mirrorToExternalStorage = async (filePath, folder) => {
  try {
    return await uploadFileToCloudinary(filePath, { folder });
  } catch (error) {
    console.error("External image mirror failed:", error.message);
    return null;
  }
};

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ detail: "No file uploaded" });
  }

  const localPath = `/uploads/${path.basename(req.file.path)}`;
  const externalUrl = await mirrorToExternalStorage(req.file.path, "escort-prod/general");

  if (!externalUrl) {
    return res.status(503).json({
      detail:
        "Cloudinary недоступен или не настроен. Задайте CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY и CLOUDINARY_API_SECRET.",
    });
  }

  return res.status(201).json({
    url: externalUrl,
    localUrl: localPath,
    externalUrl,
  });
};

const uploadProfileImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ detail: "Файл изображения не передан" });
  }

  const filename = path.basename(req.file.path);
  const localPath = `/uploads/profiles/${filename}`;
  const externalUrl = await mirrorToExternalStorage(req.file.path, "escort-prod/profiles");

  if (!externalUrl) {
    return res.status(503).json({
      detail:
        "Cloudinary недоступен или не настроен. Задайте CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY и CLOUDINARY_API_SECRET.",
    });
  }

  return res.status(201).json({
    url: externalUrl,
    localUrl: localPath,
    externalUrl,
  });
};

module.exports = { uploadImage, uploadProfileImage };
