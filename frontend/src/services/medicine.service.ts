import api from './api';

export const searchMedicines = (query: string, limit = 10) =>
  api.get(`/medicine/search?q=${encodeURIComponent(query)}&limit=${limit}`);

export const getMedicineById = (id: string) =>
  api.get(`/medicine/${id}`);

export const getAlternatives = (id: string) =>
  api.get(`/medicine/${id}/alternatives`);

