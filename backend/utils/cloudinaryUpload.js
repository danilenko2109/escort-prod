const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
};

const buildSignature = (params, apiSecret) => {
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(`${sorted}${apiSecret}`).digest("hex");
};

const uploadFileToCloudinary = async (filePath, options = {}) => {
  const config = getCloudinaryConfig();
  if (!config) {
    return null;
  }

  const folder = options.folder || process.env.CLOUDINARY_UPLOAD_FOLDER || "escort-prod/profiles";
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = buildSignature({ folder, timestamp }, config.apiSecret);

  const fileBuffer = await fs.readFile(filePath);
  const filename = path.basename(filePath);

  const formData = new FormData();
  formData.append("file", new Blob([fileBuffer]), filename);
  formData.append("api_key", config.apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Cloudinary upload failed: ${response.status} ${text}`);
  }

  const payload = await response.json();
  return payload.secure_url || null;
};

module.exports = { uploadFileToCloudinary };
