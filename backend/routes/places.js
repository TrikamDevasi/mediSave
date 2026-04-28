const express = require('express');
const router = express.Router();
const axios = require('axios');

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

function classifyType(name) {
  const n = (name||'').toLowerCase();
  if (n.includes('jan aushadhi')||n.includes('pmbjp')||n.includes('pradhan mantri')) return 'janaushadhi';
  if (n.includes('apollo')) return 'apollo';
  if (n.includes('medplus')) return 'medplus';
  return 'local';
}

router.get('/nearby', async (req, res) => {
  const { lat, lng, radius = 5000 } = req.query;
  if (!lat || !lng) return res.status(400).json({ success: false, error: 'lat and lng required' });

  // This exact format works for India on Overpass
  const query = `[out:json][timeout:60];
(
  node["amenity"="pharmacy"](around:${radius},${lat},${lng});
  node["shop"="chemist"](around:${radius},${lat},${lng});
  node["amenity"="clinic"](around:${radius},${lat},${lng});
  node["healthcare"="pharmacy"](around:${radius},${lat},${lng});
  way["amenity"="pharmacy"](around:${radius},${lat},${lng});
  way["shop"="chemist"](around:${radius},${lat},${lng});
  relation["amenity"="pharmacy"](around:${radius},${lat},${lng});
);
out center tags;`;

  try {
    console.log(`🔍 Querying Overpass for pharmacies near ${lat},${lng}`);
    
    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      query,
      {
        headers: {
          'Content-Type': 'text/plain',
          'User-Agent': 'MediSave-HackathonApp/1.0'
        },
        timeout: 60000
      }
    );

    const elements = response.data?.elements || [];
    console.log(`📦 Overpass raw elements: ${elements.length}`);

    if (elements.length > 0) {
      const results = elements.map(el => {
        const elLat = el.lat || el.center?.lat;
        const elLng = el.lon || el.center?.lng; // Fixed: center.lon in OSM
        const finalLng = el.lon || el.center?.lon;
        
        const name = el.tags?.name || el.tags?.['name:en'] || el.tags?.['name:hi'] || 'Medical Store';
        return {
          place_id: String(el.id),
          name,
          address: [
            el.tags?.['addr:housenumber'],
            el.tags?.['addr:street'],
            el.tags?.['addr:suburb'],
            el.tags?.['addr:city']
          ].filter(Boolean).join(', ') || 'Nearby',
          lat: elLat,
          lng: finalLng,
          type: classifyType(name),
          mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}+near+${elLat},${finalLng}`,
          distance: haversine(parseFloat(lat), parseFloat(lng), elLat, finalLng),
          isOpen: null,
          rating: null,
          phone: el.tags?.phone || el.tags?.['contact:phone'] || null
        };
      })
      .filter(p => p.lat && p.lng)
      .sort((a, b) => a.distance - b.distance);

      console.log(`✅ Returning ${results.length} pharmacies`);
      return res.json({ success: true, results, source: 'openstreetmap' });
    }

    // Overpass returned 0 — area not mapped in OSM
    // Fall back to MongoDB local seed
    console.log('⚠️ No OSM data for this area, using local database');
    const Pharmacy = require('../models/Pharmacy');
    const dbResults = await Pharmacy.find({}).lean();
    const fallbackResults = dbResults.map(p => ({
      place_id: p._id.toString(),
      name: p.name,
      address: p.address,
      isOpen: true,
      lat: p.location.coordinates[1],
      lng: p.location.coordinates[0],
      type: p.type || 'local',
      distance: haversine(parseFloat(lat), parseFloat(lng), p.location.coordinates[1], p.location.coordinates[0]),
      source: 'mongodb'
    }));
    return res.json({ success: true, results: fallbackResults, source: 'mongodb', warning: 'Limited coverage in this area' });

  } catch (err) {
    console.error('Overpass error:', err.message);
    const Pharmacy = require('../models/Pharmacy');
    try {
      const dbResults = await Pharmacy.find({}).lean();
      const fallbackResults = dbResults.map(p => ({
        place_id: p._id.toString(),
        name: p.name,
        address: p.address,
        isOpen: true,
        lat: p.location.coordinates[1],
        lng: p.location.coordinates[0],
        type: p.type || 'local',
        distance: haversine(parseFloat(lat), parseFloat(lng), p.location.coordinates[1], p.location.coordinates[0]),
        source: 'mongodb'
      }));
      return res.json({ success: true, results: fallbackResults, source: 'mongodb' });
    } catch (dbErr) {
      return res.status(500).json({ success: false, error: 'All identification sources failed' });
    }
  }
});

module.exports = router;
