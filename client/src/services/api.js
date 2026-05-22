import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Admin API
export const createDemoAdmin = (data) => api.post("/admin/create-demo", data);
export const getAdminById = (adminId) => api.get(`/admin/${adminId}`);

// Menu API
export const createMenuItem = (data) => api.post("/menu", data);
export const getAdminMenuItems = (adminId) => api.get(`/menu/admin/${adminId}`);
export const getPublicMenuItems = (restoId) => api.get(`/menu/public/${restoId}`);
export const updateMenuItem = (itemId, data) => api.put(`/menu/${itemId}`, data);
export const deleteMenuItem = (itemId) => api.delete(`/menu/${itemId}`);
export const toggleMenuItemAvailability = (itemId) => api.patch(`/menu/${itemId}/availability`);

// Table API
export const createTable = (data) => api.post("/tables", data);
export const getAdminTables = (adminId) => api.get(`/tables/admin/${adminId}`);
export const getPublicTable = (restoId, tableToken) => api.get(`/tables/public/${restoId}/${tableToken}`);
export const deleteTable = (tableId) => api.delete(`/tables/${tableId}`);

export default api;
