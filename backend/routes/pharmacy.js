const express = require('express');
const router = express.Router();
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 50000, medicine } = req.query;
    
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      return res.status(400).json({ success: false, error: 'Invalid coordinates.' });
    }
    if (!lat || !lng) return res.status(400).json({ success: false, error: 'lat and lng required' });

    const geoQuery = {
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [lngNum, latNum] },
          $maxDistance: parseInt(radius)
        }
      }
    };

    if (medicine) {
      const med = await Medicine.findOne({ 
        $or: [
          { brandName: new RegExp(medicine, 'i') },
          { genericName: new RegExp(medicine, 'i') }
        ] 
      }).lean();
      if (med) geoQuery['inventory.medicineId'] = med._id;
      geoQuery['inventory.inStock'] = true;
    }

    let pharmacies;
    try {
      pharmacies = await Pharmacy.find(geoQuery).limit(20).lean();
    } catch (geoErr) {
      // 2dsphere index may not exist yet — fall back to plain find
      console.warn('[pharmacy/nearby] geo query failed, falling back to plain find:', geoErr.message);
      pharmacies = await Pharmacy.find({}).limit(20).lean();
    }

    res.json({ success: true, data: { pharmacies, count: pharmacies.length } });
  } catch (err) {
    console.error('[pharmacy/nearby] error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/janaushadhi', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: 'lat and lng are required' });
    }
    
    const longitude = parseFloat(lng);
    const latitude = parseFloat(lat);
    const radiusMeters = 5000;
    
    const pharmacies = await Pharmacy.find({
      type: 'janaushadhi',
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: radiusMeters
        }
      }
    }).limit(10).lean();
    
    res.json({ success: true, data: { pharmacies } });
  } catch (error) {
    console.error('Jan Aushadhi error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to find Jan Aushadhi stores' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let pharmacy;
    
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      pharmacy = await Pharmacy.findById(id).populate('inventory.medicineId').lean();
    } else {
      pharmacy = await Pharmacy.findOne({ 
        $or: [{ name: new RegExp('^' + id.replace(/-/g, ' ') + '$', 'i') }] 
      }).populate('inventory.medicineId').lean();
    }

    if (!pharmacy) {
      return res.status(404).json({ success: false, error: 'Pharmacy not found' });
    }
    res.json({ success: true, data: pharmacy });
  } catch (error) {
    console.error('Pharmacy fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch pharmacy' });
  }
});

module.exports = router;
