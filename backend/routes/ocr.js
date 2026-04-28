const express = require('express');
const router = express.Router();
const axios = require('axios');
const Medicine = require('../models/Medicine');

router.post('/scan', async (req, res) => {
  try {
    const { image, mimeType = 'image/jpeg' } = req.body;
    if (!image) return res.status(400).json({ success: false, error: 'No image provided' });

    const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/ml/ocr/scan`, {
      image,
      mimeType
    }, { timeout: 30000 });

    const { medicines, source, confidence } = mlResponse.data;

    const matchedMedicines = await Promise.all(
      medicines.map(async (med) => {
        const found = await Medicine.findOne({
          $text: { $search: med.name }
        }).lean();
        return { extracted: med, matched: found || null };
      })
    );

    res.json({
      success: true,
      data: {
        extractedMedicines: medicines,
        matchedMedicines,
        ocrSource: source,
        confidence
      }
    });
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({ success: false, error: 'ML service unavailable. Try manual search.' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/manual', async (req, res) => {
  try {
    const { medicineName } = req.body;
    if (!medicineName) {
      return res.status(400).json({ success: false, error: 'Medicine name is required' });
    }
    
    const medicine = await Medicine.findOne({
      $or: [
        { brandName: new RegExp(medicineName, 'i') },
        { genericName: new RegExp(medicineName, 'i') },
        { composition: new RegExp(medicineName, 'i') }
      ]
    }).lean();
    
    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }
    
    res.json({ success: true, data: medicine });
  } catch (error) {
    console.error('Manual search error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to search medicine' });
  }
});

module.exports = router;
