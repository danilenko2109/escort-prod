import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleApiError = (error) => {
  const serverMessage = error?.response?.data?.detail;
  return new Error(serverMessage || "Ошибка сети. Попробуйте позже.");
};

const wrap = async (requestFn) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const profilesAPI = {
  getAll: (params) => wrap(() => apiClient.get("/api/profiles", { params })),
  getById: (id, params) => wrap(() => apiClient.get(`/api/profiles/${id}`, { params })),
  searchByCode: (code) => wrap(() => apiClient.get("/api/profiles/search", { params: { code } })),
  create: (data) => wrap(() => apiClient.post("/api/profiles", data)),
  update: (id, data) => wrap(() => apiClient.put(`/api/profiles/${id}`, data)),
  delete: (id) => wrap(() => apiClient.delete(`/api/profiles/${id}`)),
};

export const adminAPI = {
  login: (credentials) => wrap(() => apiClient.post("/api/admin/login", credentials)),
  getMe: () => wrap(() => apiClient.get("/api/admin/me")),
  getStats: () => wrap(() => apiClient.get("/api/admin/stats")),
};

export const settingsAPI = {
  getBookingPhone: () => wrap(() => apiClient.get("/api/settings/booking-phone")),
  updateBookingPhone: (phone) => wrap(() => apiClient.put("/api/settings/booking-phone", { phone })),
};

export const contactAPI = {
  submit: (data) => wrap(() => apiClient.post("/api/contact", data)),
};

export const requestAPI = {
  submit: (data) => wrap(() => apiClient.post("/api/requests", data)),
};

export const uploadsAPI = {
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await apiClient.post("/api/uploads/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
