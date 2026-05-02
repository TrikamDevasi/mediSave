const janAushadhiStores = [
  { name: 'Jan Aushadhi Store - Satellite', address: 'Satellite Road, Ahmedabad', lat: 23.025, lng: 72.569, phone: '9876543210' },
  { name: 'Jan Aushadhi Store - Navrangpura', address: 'Navrangpura, Ahmedabad', lat: 23.036, lng: 72.562, phone: '9876543211' },
  { name: 'Jan Aushadhi Store - Maninagar', address: 'Maninagar, Ahmedabad', lat: 22.999, lng: 72.600, phone: '9876543212' },
  { name: 'Jan Aushadhi Store - Bopal', address: 'Bopal, Ahmedabad', lat: 23.017, lng: 72.511, phone: '9876543213' },
  { name: 'Jan Aushadhi Store - Vastrapur', address: 'Vastrapur, Ahmedabad', lat: 23.041, lng: 72.540, phone: '9876543214' }
];

const janAushadhiPrices = {
  'Atorvastatin 10mg': 8,
  'Atorvastatin 20mg': 12,
  'Metformin 500mg': 6,
  'Amlodipine 5mg': 5,
  'Pantoprazole 40mg': 7,
  'Azithromycin 500mg': 25,
  'Paracetamol 500mg': 3,
  'Ciprofloxacin 500mg': 10,
  'Losartan 50mg': 8,
  'Omeprazole 20mg': 6,
  'Cetirizine 10mg': 4,
  'Amoxicillin 500mg': 12,
  'Ibuprofen 400mg': 8,
  'Montelukast 10mg': 15,
  'Ramipril 5mg': 7
};

const findNearbyJanAushadhi = (lat, lng, radiusKm) => {
  const storesWithDistance = janAushadhiStores.map(store => {
    const distance = calculateDistance(lat, lng, store.lat, store.lng);
    return { ...store, distance: Math.round(distance) };
  });
  
  return storesWithDistance
    .filter(store => store.distance <= radiusKm * 1000)
    .sort((a, b) => a.distance - b.distance);
};

const getJanAushadhiPrice = (genericName) => {
  return janAushadhiPrices[genericName] || null;
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = { findNearbyJanAushadhi, getJanAushadhiPrice, janAushadhiStores, janAushadhiPrices };
