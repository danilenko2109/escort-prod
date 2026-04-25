import axios from "axios";

const normalizeBaseUrl = (value) => String(value || "").trim().replace(/\/$/, "");

const getApiBaseUrl = () => {
  const configured = normalizeBaseUrl(process.env.REACT_APP_BACKEND_URL);
  if (configured) return configured;

  return "https://escort-prod.onrender.com";
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
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

const withApiPrefixFallback = async (requestFactory) => {
  try {
    return await requestFactory("/api");
  } catch (error) {
    if (error?.response?.status !== 404) {
      throw error;
    }
    return requestFactory("");
  }
};

const handleApiError = (error) => {
  const serverMessage = error?.response?.data?.detail;
  const isCorsOrNetwork = !error?.response && (error?.code === "ERR_NETWORK" || /Network Error/i.test(error?.message || ""));

  if (isCorsOrNetwork) {
    return new Error("Ошибка сети или CORS. Проверьте REACT_APP_BACKEND_URL и CORS на сервере.");
  }

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

const apiGet = (path, config) => withApiPrefixFallback((prefix) => apiClient.get(`${prefix}${path}`, config));
const apiPost = (path, data, config) => withApiPrefixFallback((prefix) => apiClient.post(`${prefix}${path}`, data, config));
const apiPut = (path, data, config) => withApiPrefixFallback((prefix) => apiClient.put(`${prefix}${path}`, data, config));
const apiDelete = (path, config) => withApiPrefixFallback((prefix) => apiClient.delete(`${prefix}${path}`, config));

export const profilesAPI = {
  getAll: (params) => wrap(() => apiGet("/profiles", { params })),
  getById: (id, params) => wrap(() => apiGet(`/profiles/${id}`, { params })),
  searchByCode: (code) => wrap(() => apiGet("/profiles/search", { params: { code } })),
  create: (data) => wrap(() => apiPost("/profiles", data)),
  update: (id, data) => wrap(() => apiPut(`/profiles/${id}`, data)),
  delete: (id) => wrap(() => apiDelete(`/profiles/${id}`)),
};

export const adminAPI = {
  login: (credentials) => wrap(() => apiPost("/admin/login", credentials)),
  getMe: () => wrap(() => apiGet("/admin/me")),
  getStats: () => wrap(() => apiGet("/admin/stats")),
};

export const settingsAPI = {
  getBookingPhone: () => wrap(() => apiGet("/settings/booking-phone")),
  updateBookingPhone: (phone) => wrap(() => apiPut("/settings/booking-phone", { phone })),
};

export const contactAPI = {
  submit: (data) => wrap(() => apiPost("/contact", data)),
};

export const requestAPI = {
  submit: (data) => wrap(() => apiPost("/requests", data)),
};

export const uploadsAPI = {
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await apiPost("/uploads/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
