const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

export interface NearbyPlace {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  opening_hours?: { open_now: boolean };
  geometry: { location: { lat: number; lng: number } };
  types: string[];
  distance?: number;
  type?: string;
  isOpen?: boolean;
  address?: string;
  lat?: number;
  lng?: number;
  mapsUrl?: string;
}

// Fetch real nearby pharmacies/chemists using Google Places API (via backend proxy)
export const getNearbyPharmaciesFromGoogle = async (
  lat: number,
  lng: number,
  radius = 1500
): Promise<NearbyPlace[]> => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching pharmacies from Google:', error);
    return [];
  }
};

// Calculate distance between two coords (Haversine)
export const calculateDistance = (
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number => {
  const R = 6371000; // meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

// Detect if a place is Jan Aushadhi store
export const isJanAushadhi = (name: string): boolean => {
  const lower = name.toLowerCase();
  return (
    lower.includes('jan aushadhi') ||
    lower.includes('pradhan mantri') ||
    lower.includes('pmbjp') ||
    lower.includes('generic')
  );
};

// Classify pharmacy type from name
export const classifyPharmacy = (name: string): string => {
  const lower = name.toLowerCase();
  if (isJanAushadhi(lower)) return 'janaushadhi';
  if (lower.includes('apollo')) return 'apollo';
  if (lower.includes('medplus')) return 'medplus';
  if (lower.includes('netmeds')) return 'netmeds';
  if (lower.includes('1mg') || lower.includes('tata 1mg')) return 'netmeds';
  return 'local';
};
