import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as medicineService from '../../services/medicine.service';
import * as ocrService from '../../services/ocr.service';
import * as pharmacyService from '../../services/pharmacy.service';

// Types for the state
export interface MedicineState {
  searchResults: any[];
  selectedMedicine: any | null;
  alternatives: any[];
  nearbyPharmacies: any[];
  scanResult: any | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: MedicineState = {
  searchResults: [],
  selectedMedicine: null,
  alternatives: [],
  nearbyPharmacies: [],
  scanResult: null,
  loading: false,
  error: null,
  searchQuery: '',
};

// REAL API THUNKS — no mock data
export const searchMedicines = createAsyncThunk(
  'medicine/search',
  async (query: string, { rejectWithValue }) => {
    try {
      const res: any = await medicineService.searchMedicines(query);
      return res; // Expecting { medicines: [...], count: N } or array directly depending on backend
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getMedicineById = createAsyncThunk(
  'medicine/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res: any = await medicineService.getMedicineById(id);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getAlternatives = createAsyncThunk(
  'medicine/getAlternatives',
  async (id: string, { rejectWithValue }) => {
    try {
      const res: any = await medicineService.getAlternatives(id);
      return res; // Expecting { alternatives: [...] }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const scanPrescription = createAsyncThunk(
  'medicine/scan',
  async ({ base64Image, mimeType }: { base64Image: string; mimeType: string }, { rejectWithValue }) => {
    try {
      const res: any = await ocrService.scanPrescription(base64Image, mimeType);
      return res; // Expecting { extractedMedicines, matchedMedicines, ocrSource, confidence }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getNearbyPharmacies = createAsyncThunk(
  'medicine/nearbyPharmacies',
  async ({ lat, lng, radius = 1000, medicine }: { lat: number; lng: number; radius?: number; medicine?: string }, { rejectWithValue }) => {
    try {
      const res: any = await pharmacyService.getNearby(lat, lng, radius, medicine);
      return res; // Expecting { pharmacies: [...], count: N }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getJanAushadhi = createAsyncThunk(
  'medicine/janAushadhi',
  async ({ lat, lng }: { lat: number; lng: number }, { rejectWithValue }) => {
    try {
      const res: any = await pharmacyService.getJanAushadhi(lat, lng);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const medicineSlice = createSlice({
  name: 'medicine',
  initialState,
  reducers: {
    clearScanResult: (state) => { state.scanResult = null; },
    clearError: (state) => { state.error = null; },
    setSearchQuery: (state, action: PayloadAction<string>) => { state.searchQuery = action.payload; },
  },
  extraReducers: (builder) => {
    // searchMedicines
    builder
      .addCase(searchMedicines.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(searchMedicines.fulfilled, (state, action: any) => {
        state.loading = false;
        // Backend returns { success: true, data: { medicines, count } }
        state.searchResults = action.payload.data?.medicines || action.payload.medicines || [];
      })
      .addCase(searchMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.searchResults = [];
      });

    // getMedicineById
    builder
      .addCase(getMedicineById.pending, (state) => { state.loading = true; })
      .addCase(getMedicineById.fulfilled, (state, action: any) => {
        state.loading = false;
        // Backend returns { success: true, data: medicine }
        state.selectedMedicine = action.payload.data || action.payload.medicine || action.payload;
      })
      .addCase(getMedicineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // getAlternatives
    builder
      .addCase(getAlternatives.fulfilled, (state, action: any) => {
        // Backend returns { success: true, data: alternatives }
        state.alternatives = action.payload.data || action.payload.alternatives || [];
      });

    // scanPrescription
    builder
      .addCase(scanPrescription.pending, (state) => { state.loading = true; state.scanResult = null; })
      .addCase(scanPrescription.fulfilled, (state, action: any) => {
        state.loading = false;
        state.scanResult = action.payload;
      })
      .addCase(scanPrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // getNearbyPharmacies
    builder
      .addCase(getNearbyPharmacies.fulfilled, (state, action: any) => {
        // Backend returns { success: true, data: { pharmacies, count } }
        state.nearbyPharmacies = action.payload.data?.pharmacies || action.payload.pharmacies || [];
      });
  },
});

export const { clearScanResult, clearError, setSearchQuery } = medicineSlice.actions;
export default medicineSlice.reducer;

