export { profilesAPI, adminAPI, contactAPI, requestAPI } from "../services/api";

export const cloudinaryAPI = {
  getSignature: async () => {
    throw new Error("Cloudinary upload is disabled in simplified backend");
  },
};