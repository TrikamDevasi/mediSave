// MediSave OCR Service
import { mlApi } from './api';

export const scanPrescription = (base64Image: string, mimeType = 'image/jpeg') =>
  mlApi.post('/ocr/scan', { image: base64Image, mimeType });

export const manualSearch = (medicineName: string) =>
  mlApi.post('/ocr/manual', { medicineName });

