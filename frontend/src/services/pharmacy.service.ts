import api from './api';

export const getNearby = (lat: number, lng: number, radius = 1000, medicine = '') =>
  api.get(`/pharmacy/nearby?lat=${lat}&lng=${lng}&radius=${radius}${medicine ? `&medicine=${encodeURIComponent(medicine)}` : ''}`);

export const getJanAushadhi = (lat: number, lng: number) =>
  api.get(`/pharmacy/janaushadhi?lat=${lat}&lng=${lng}`);

export const getPharmacyById = (id: string) =>
  api.get(`/pharmacy/${id}`);
