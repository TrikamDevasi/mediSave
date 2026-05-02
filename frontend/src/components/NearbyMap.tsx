// ⚠️  CLIENT-ONLY — all leaflet/react-leaflet imports live here so the SSR runner never touches them.
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Crosshair, Layers } from 'lucide-react';

// ─── Leaflet default icon fix (webpack/vite asset path issue) ───
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ─── TILE SOURCES ───
const TILES = {
  osm_dark: {
    label: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  osm_light: {
    label: 'Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  },
  osm_street: {
    label: 'Street',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};

type TileKey = keyof typeof TILES;

// ─── TYPES ───
export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  type: 'Govt' | 'Private';
  distance: number;
  isOpen: boolean | null;
  inventory: Array<{ price: number; stock: 'High' | 'Medium' | 'Low' }>;
  location: { coordinates: [number, number] }; // [lng, lat]
  phone?: string | null;
  mapsUrl?: string;
}

interface NearbyMapProps {
  userLocation: [number, number];
  pharmacies: Pharmacy[];
  isLocating: boolean;
  onLocate: () => void;
  onPharmacyClick: (id: string) => void;
}

// ─── Sync map view when user location updates ───
function MapSync({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

// ─── Pharmacy pill marker ───
const govtColor  = '#1d4ed8';
const apoColor   = '#dc2626';
const medColor   = '#16a34a';
const localColor = '#7c3aed';

function pharmacyMarkerColor(p: Pharmacy) {
  const n = p.name.toLowerCase();
  if (p.type === 'Govt' || n.includes('jan')) return govtColor;
  if (n.includes('apollo')) return apoColor;
  if (n.includes('medplus')) return medColor;
  return localColor;
}

function pharmacyMarkerLabel(p: Pharmacy) {
  const n = p.name.toLowerCase();
  if (p.type === 'Govt' || n.includes('jan')) return 'JAN';
  if (n.includes('apollo')) return 'APO';
  if (n.includes('medplus')) return 'MED';
  return p.name.slice(0, 3).toUpperCase();
}

function getMarkerHTML(p: Pharmacy) {
  const bg = pharmacyMarkerColor(p);
  const label = pharmacyMarkerLabel(p);
  const price = p.inventory?.[0]?.price?.toFixed(0);

  return `
    <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.4));">
      <div style="background:${bg};color:#fff;padding:4px 10px;border-radius:9999px;font-size:11px;font-weight:700;white-space:nowrap;border:2px solid rgba(255,255,255,0.35);display:flex;align-items:center;gap:4px;">
        <span style="opacity:0.75;font-size:8px;font-weight:900;letter-spacing:0.04em;">${label}</span>
        ${price ? `<span>₹${price}</span>` : ''}
      </div>
      <div style="width:8px;height:8px;background:${bg};margin-top:-1px;clip-path:polygon(0 0,100% 0,50% 100%);"></div>
    </div>
  `;
}

// ─── User location pulsing dot ───
const userIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:16px;height:16px;">
      <div style="position:absolute;inset:-10px;border-radius:50%;background:rgba(42,168,175,0.20);animation:location-pulse 2s ease-out infinite;"></div>
      <div style="width:16px;height:16px;border-radius:50%;background:#2aa8af;border:3px solid white;box-shadow:0 2px 10px rgba(42,168,175,0.6);"></div>
    </div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// ─── FAB style ───
const fabBase: React.CSSProperties = {
  width: 40, height: 40, borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'all 150ms ease',
  boxShadow: '0 4px 14px rgba(0,0,0,0.35)', border: 'none',
};

export default function NearbyMap({ userLocation, pharmacies, isLocating, onLocate, onPharmacyClick }: NearbyMapProps) {
  const [tileKey, setTileKey] = useState<TileKey>('osm_dark');
  const [showTilePicker, setShowTilePicker] = useState(false);
  const tile = TILES[tileKey];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={userLocation}
        zoom={15}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        preferCanvas
      >
        <TileLayer url={tile.url} attribution={tile.attribution} maxZoom={19} />
        {window.innerWidth >= 768 && <ZoomControl position="bottomright" />}
        <MapSync center={userLocation} />

        {/* User location marker */}
        <Marker position={userLocation} icon={userIcon}>
          <Tooltip permanent direction="top" offset={[0, -14]} className="location-tooltip">
            You are here
          </Tooltip>
        </Marker>

        {/* Pharmacy markers */}
        {pharmacies.map((p) => (
          <Marker
            key={p.id}
            position={[p.location.coordinates[1], p.location.coordinates[0]]}
            icon={L.divIcon({
              className: '',
              html: getMarkerHTML(p),
              iconSize: window.innerWidth < 768 ? [100, 50] : [90, 44],
              iconAnchor: window.innerWidth < 768 ? [50, 50] : [45, 44],
            })}
            eventHandlers={{ click: () => onPharmacyClick(p.id) }}
          >
            <Tooltip direction="top" offset={[0, -46]}>
              <strong>{p.name}</strong><br />
              {p.distance < 1000 ? `${p.distance}m` : `${(p.distance / 1000).toFixed(1)}km`} away
              {p.phone ? <><br />📞 {p.phone}</> : null}
            </Tooltip>
          </Marker>
        ))}

        {/* Coords badge */}
        <div className="map-coords-badge">
          {userLocation[0].toFixed(4)}°N&nbsp;&nbsp;{userLocation[1].toFixed(4)}°E
        </div>

        {/* Live badge */}
        <div className="map-live-badge">
          <div className="map-live-dot" />
          LIVE
        </div>
      </MapContainer>

      {/* ── FAB controls — rendered outside MapContainer so z-index works ── */}
      <div style={{ 
        position: 'absolute', 
        bottom: window.innerWidth < 768 ? 160 : 90, 
        right: 16, 
        zIndex: 500, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 8 
      }}>

        {/* Layer picker */}
        <div style={{ position: 'relative' }}>
          {showTilePicker && (
            <div style={{
              position: 'absolute', right: 48, bottom: 0,
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 12, padding: '6px 4px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              display: 'flex', flexDirection: 'column', gap: 2, minWidth: 120,
            }}>
              {(Object.keys(TILES) as TileKey[]).map(k => (
                <button
                  key={k}
                  onClick={() => { setTileKey(k); setShowTilePicker(false); }}
                  style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: tileKey === k ? 'var(--color-primary)' : 'transparent',
                    color: tileKey === k ? '#fff' : 'var(--color-text)',
                    transition: 'all 120ms ease',
                  }}
                >
                  {TILES[k].label}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowTilePicker(v => !v)}
            title="Switch map style"
            style={{ ...fabBase, background: showTilePicker ? 'var(--color-primary)' : 'var(--color-surface)', color: showTilePicker ? '#fff' : 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
          >
            <Layers size={17} />
          </button>
        </div>

        {/* Re-centre */}
        <button
          onClick={onLocate}
          disabled={isLocating}
          title="Go to my location"
          style={{ ...fabBase, background: 'var(--color-surface)', color: 'var(--color-primary)', border: '1px solid var(--color-border)' }}
        >
          <Crosshair size={17} style={{ animation: isLocating ? 'spin 1s linear infinite' : 'none' }} />
        </button>

        {/* Navigate (opens Google Maps) */}
        <button
          onClick={() => window.open(`https://www.google.com/maps/search/pharmacy/@${userLocation[0]},${userLocation[1]},15z`)}
          title="Open in Google Maps"
          style={{ ...fabBase, background: 'var(--color-primary)', color: '#fff' }}
        >
          <Navigation size={16} />
        </button>
      </div>
    </div>
  );
}
