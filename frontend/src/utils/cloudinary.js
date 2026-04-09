import { cloudinaryAPI } from './api';

export const uploadToCloudinary = async (file, folder = 'profiles') => {
  try {
    // Get signature from backend
    const { data: sig } = await cloudinaryAPI.getSignature({ 
      resource_type: 'image',
      folder 
    });

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sig.api_key);
    formData.append('timestamp', sig.timestamp);
    formData.append('signature', sig.signature);
    formData.append('folder', sig.folder);

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};