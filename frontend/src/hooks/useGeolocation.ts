import { useState, useEffect } from 'react';

export interface Coords {
  lat: number;
  lng: number;
}

export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        // Default to Surat, Gujarat if denied
        setCoords({ lat: 21.1702, lng: 72.8311 });
        setError('Using default location (Surat). Enable location for accurate results.');
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  return { coords, error, loading };
}
