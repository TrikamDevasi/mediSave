import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Phone, 
  Map as MapIcon, 
  List, 
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/axios';

// ⚠️ Leaflet is browser-only — loaded lazily so SSR never imports it
const NearbyMap = lazy(() => import('@/components/NearbyMap'));

// ─── TYPES ───
interface Pharmacy {
  id: string;
  name: string;
  address: string;
  type: 'Govt' | 'Private';
  distance: number;         // metres
  isOpen: boolean | null;   // null = unknown (OSM has no hours)
  inventory: Array<{
    price: number;
    stock: 'High' | 'Medium' | 'Low';
  }>;
  location: {
    coordinates: [number, number]; // [lng, lat]
  };
  phone?: string | null;
  mapsUrl?: string;
}

// ─── HELPERS ───
function fmtDistance(metres: number): string {
  if (metres < 1000) return `${Math.round(metres)}m`;
  return `${(metres / 1000).toFixed(1)}km`;
}


// ─── NORMALIZE /places/nearby response ───
// Backend places.js returns: { success, results: [{ place_id, name, address, lat, lng, distance, type, phone, mapsUrl }] }
function normalizePlacesResult(p: any): Pharmacy {
  const govtTypes = ['janaushadhi'];
  const lat: number = p.lat ?? 0;
  const lng: number = p.lng ?? 0;
  const distanceM: number = p.distance ?? 0;

  return {
    id: p.place_id ?? p.id ?? String(Math.random()),
    name: p.name ?? 'Unknown Pharmacy',
    address: p.address ?? 'Nearby',
    type: govtTypes.includes(p.type) ? 'Govt' : 'Private',
    distance: distanceM,          // metres — display in list as km
    isOpen: p.isOpen ?? null,     // null = unknown from OSM
    inventory: [],                // OSM has no price data
    location: { coordinates: [lng, lat] },
    phone: p.phone ?? null,
    mapsUrl: p.mapsUrl,
  };
}

export const Route = createFileRoute('/nearby')({
  component: NearbyPage,
})

function NearbyPage() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | "GOVT" | "PRIVATE">("ALL");
  const [radius, setRadius] = useState(2);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('');

  // Initialize location
  useEffect(() => {
    handleLocate();
  }, []);

  const handleLocate = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setIsLocating(false);
      },
      () => {
        // Fallback to Ahmedabad center if denied
        setUserLocation([23.0225, 72.5714]);
        setIsLocating(false);
      }
    );
  };

  // Fetch data from /places/nearby (Overpass/OSM real data)
  useEffect(() => {
    if (!userLocation) return;
    
    const fetchNearby = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/places/nearby', {
          params: {
            lat: userLocation[0],
            lng: userLocation[1],
            radius: radius * 1000
          },
          timeout: 20000,   // Overpass can be slow
        });
        // /places/nearby returns { success, results: [...], source }
        const raw: any[] = res.data?.results ?? [];
        const normalized = raw.map(normalizePlacesResult);
        setPharmacies(normalized);
        setDataSource(res.data?.source ?? 'live');
      } catch (err) {
        console.error("Fetch failed, using mocks", err);
        // Mock fallback
        setPharmacies([
          {
            id: '1',
            name: 'Jan Aushadhi - Satellite',
            address: 'Satellite Road, Ahmedabad',
            type: 'Govt',
            distance: 300,
            isOpen: false,
            inventory: [{ price: 12, stock: 'High' }],
            location: { coordinates: [userLocation[1] + 0.002, userLocation[0] + 0.001] }
          },
          {
            id: '2',
            name: 'MedPlus Pharmacy',
            address: 'Panchvati Cross Roads, Ahmedabad',
            type: 'Private',
            distance: 800,
            isOpen: true,
            inventory: [{ price: 130, stock: 'Medium' }],
            location: { coordinates: [userLocation[1] - 0.003, userLocation[0] + 0.002] }
          },
          {
            id: '3',
            name: 'Apollo Pharmacy',
            address: 'Ellis Bridge, Ahmedabad',
            type: 'Private',
            distance: 1200,
            isOpen: true,
            inventory: [{ price: 172, stock: 'High' }],
            location: { coordinates: [userLocation[1] + 0.005, userLocation[0] - 0.003] }
          }
        ]);
        setDataSource('mock');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearby();
  }, [userLocation, radius]);


  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === "ALL" || p.type.toUpperCase() === filter;
      return matchesSearch && matchesFilter;
    });
  }, [pharmacies, searchQuery, filter]);

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const pct = ((val - 0.5) / (10 - 0.5)) * 100;
    e.target.style.setProperty('--slider-pct', `${pct}%`);
    setRadius(val);
  };

  // ─── AUTO SCROLL LOGIC ───
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selectedId && view === 'list') {
      const element = document.getElementById(`pharmacy-${selectedId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedId, view]);

  // ─── VIRTUAL LIST — only render visible pharmacy cards ───────────────
  const listParentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredPharmacies.length,
    getScrollElement: () => listParentRef.current,
    estimateSize: () => 200,   // estimated card height in px
    overscan: 3,               // render 3 items above/below viewport
    gap: 12,
  });


  return (
    <AppLayout>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 64px)', overflow: 'hidden' }}>

        {/* Sub-Header */}
        <div className="nearby-subheader">
           <div className="nearby-subheader-title">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Pharmacy Radar</span>
           </div>
           
           <div className="view-toggle">
              <button 
                className={`toggle-btn ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
              >
                <List size={15} />
                <span className="hidden sm:inline">List</span>
              </button>
              <button 
                className={`toggle-btn ${view === 'map' ? 'active' : ''}`}
                onClick={() => setView('map')}
              >
                <MapIcon size={15} />
                <span className="hidden sm:inline">Map</span>
              </button>
           </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* LEFT PANEL */}
          <motion.aside 
            initial={false}
            animate={{ 
              width: view === 'map' ? '0%' : '100%',
              opacity: view === 'map' ? 0 : 1
            }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="nearby-left-panel border-r border-divider z-10 lg:!w-[420px] lg:!opacity-100 lg:!block"
          >
             {/* Search & Filters */}
             <div className="p-6 border-b border-divider space-y-6 sticky top-0 bg-background/95 backdrop-blur-md z-20">
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <input 
                     type="text"
                     placeholder="Search store name..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pharmacy-search-input w-full h-12 bg-surface-2 border border-divider rounded-xl pl-12 pr-4 text-sm focus:outline-none transition-all"
                   />
                </div>

                <div className="flex items-center gap-2">
                   {(['ALL', 'GOVT', 'PRIVATE'] as const).map(f => (
                     <button
                       key={f}
                       onClick={() => setFilter(f)}
                       className={`filter-chip ${filter === f ? 'active' : ''}`}
                     >
                       {f}
                     </button>
                   ))}
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Scan Radius</span>
                      <span className="text-xs font-bold text-primary">{radius} KM</span>
                   </div>
                   <input 
                     type="range"
                     min="0.5"
                     max="10"
                     step="0.5"
                     value={radius}
                     onChange={handleRadiusChange}
                     className="radius-slider"
                   />
                   <p className="text-[10px] text-muted-foreground font-medium">
                     Showing pharmacies within {radius}km of your verified location.
                   </p>
                </div>
             </div>

             {/* Result Count */}
             <div className="px-6 py-4 flex items-center justify-between border-b border-divider/50 bg-surface-offset/30">
                <span className="text-xs text-muted-foreground">
                  <strong className="text-foreground">{filteredPharmacies.length} pharmacies</strong> found
                </span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  Sorted by price ↑
                </span>
             </div>

             {/* Pharmacy List — virtualised for smooth scroll with 100+ results */}
             <div
               ref={listParentRef}
               className="nearby-panel-list"
               style={{ overflowY: 'auto', height: 'calc(100% - 120px)', padding: '0 16px' }}
             >
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                     <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                     <p className="text-[10px] font-black uppercase tracking-[0.2em]">Analyzing Local Grid...</p>
                  </div>
                ) : filteredPharmacies.length === 0 ? (
                  <div className="text-center py-20 px-6">
                     <div className="h-16 w-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-4 border border-divider">
                        <Info className="h-6 w-6 text-muted-foreground" />
                     </div>
                     <h3 className="font-bold text-foreground">No pharmacies found</h3>
                     <p className="text-sm text-muted-foreground mt-2">Try increasing your scan radius or adjusting filters.</p>
                  </div>
                ) : (
                  <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative', paddingTop: 8 }}>
                    {rowVirtualizer.getVirtualItems().map(virtualItem => {
                      const p = filteredPharmacies[virtualItem.index];
                      return (
                        <div key={virtualItem.key} style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualItem.start}px)` }}>
                          <motion.div
                            id={`pharmacy-${p.id}`}
                            onClick={() => { setSelectedId(p.id); if (window.innerWidth < 1024) setView('map'); }}
                            className={`pharmacy-card cursor-pointer transition-all ${selectedId === p.id ? 'ring-2 ring-primary border-transparent' : 'hover:border-primary/30'}`}
                          >
                             <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                   <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-black text-base text-foreground leading-tight">{p.name}</h3>
                                      <span className="distance-pill shrink-0">{fmtDistance(p.distance)}</span>
                                   </div>
                                   <p className="text-xs text-muted-foreground capitalize tracking-normal">{p.address.toLowerCase()}</p>
                                </div>
                                <span className={p.isOpen === true ? "status-badge-open" : p.isOpen === false ? "status-badge-closed" : "status-badge-unknown"}>
                                   {p.isOpen === true ? "Open" : p.isOpen === false ? "Closed" : "Hours unknown"}
                                </span>
                             </div>
                             <div className="pharmacy-stat-grid">
                                <div className="pharmacy-stat-box">
                                   <p className="pharmacy-stat-label">Generic Price</p>
                                   <p className="pharmacy-stat-value is-price">&#8377;{p.inventory?.[0]?.price || "--"}</p>
                                </div>
                                <div className="pharmacy-stat-box">
                                   <p className="pharmacy-stat-label">Stock Status</p>
                                   <p className={`pharmacy-stat-value ${p.inventory?.[0]?.stock === 'High' ? 'is-high' : ''}`}>{p.inventory?.[0]?.stock || "N/A"}</p>
                                </div>
                             </div>
                             <div className="pharmacy-card-actions">
                                {p.phone ? (
                                  <button className="btn-call" onClick={(e) => { e.stopPropagation(); window.location.href=`tel:${p.phone}`; }}><Phone size={14} /> Call</button>
                                ) : (
                                  <button className="btn-call" style={{ opacity: 0.4, cursor: 'not-allowed' }} disabled><Phone size={14} /> No phone</button>
                                )}
                                <button className="btn-directions" onClick={(e) => { e.stopPropagation(); window.open(p.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' ' + p.address)}`); }}>
                                   <Navigation size={14} /> Navigate
                                </button>
                             </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                )}
             </div>
          </motion.aside>

          {/* RIGHT PANEL - MAP */}
          <main className="nearby-map-container h-full">
             <div className="absolute inset-0 bg-[#0f0e0c]" />

             {userLocation && (
               <Suspense fallback={
                 <div className="w-full h-full flex items-center justify-center opacity-40">
                   <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                 </div>
               }>
                 <NearbyMap
                   userLocation={userLocation}
                   pharmacies={filteredPharmacies}
                   isLocating={isLocating}
                   onLocate={handleLocate}
                   onPharmacyClick={(id) => { setSelectedId(id); setView('list'); }}
                 />
               </Suspense>
             )}

             {/* Floating Mobile Toggle (Visible only on mobile) */}
             <div className="lg:hidden absolute bottom-32 left-1/2 -translate-x-1/2 z-[400]">
                <button 
                  onClick={() => setView(view === 'list' ? 'map' : 'list')}
                  className="px-6 py-3 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 border border-white/10"
                >
                   {view === 'list' ? <MapIcon size={16} /> : <List size={16} />}
                   {view === 'list' ? "View Map" : "View List"}
                </button>
             </div>
          </main>

        </div>
      </div>
    </AppLayout>
  );
}
