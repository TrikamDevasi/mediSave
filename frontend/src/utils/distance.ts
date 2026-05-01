/**
 * Distance calculation utilities using the Haversine formula.
 */

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate distance between two lat/lng points in km.
 */
export function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Format a distance in km to a human-readable string.
 * e.g. 0.8 → "0.8 km", 1.25 → "1.3 km"
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 10) / 10} km`;
  return `${km.toFixed(1)} km`;
}

/**
 * Sort an array of items by their distance from a reference point.
 */
export function sortByDistance<T extends { lat: number; lng: number }>(
  items: T[],
  refLat: number,
  refLng: number
): T[] {
  return [...items].sort(
    (a, b) =>
      haversine(refLat, refLng, a.lat, a.lng) -
      haversine(refLat, refLng, b.lat, b.lng)
  );
}
