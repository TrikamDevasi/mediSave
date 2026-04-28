const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Medicine = require('../models/Medicine');
const cache = require('../middleware/cache');
const { findGenericAlternatives } = require('../services/domain/genericMatcher');

router.get('/search', cache(3600), async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Query must be at least 2 characters' });
    }

    let medicines;
    try {
      medicines = await Medicine.find(
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(parseInt(limit))
        .lean();
    } catch {
      const regex = new RegExp(q, 'i');
      medicines = await Medicine.find({
        $or: [{ brandName: regex }, { genericName: regex }, { composition: regex }]
      }).limit(parseInt(limit)).lean();
    }

    res.json({ success: true, data: { medicines, count: medicines.length } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', cache(21600), async (req, res) => {
  try {
    const id = req.params.id;
    
    const medicine = await Medicine.findOne({
      $or: [
        ...(mongoose.isValidObjectId(id) ? [{ _id: id }] : []),
        { slug: id },
        { brandName: new RegExp(id.replace(/-/g, ' '), 'i') },
        { genericName: new RegExp(id.replace(/-/g, ' '), 'i') }
      ]
    }).lean();

    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }
    res.json({ success: true, data: medicine });
  } catch (error) {
    console.error('Medicine fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch medicine' });
  }
});

router.get('/:id/alternatives', cache(21600), async (req, res) => {
  try {
    const id = req.params.id;
    
    const medicine = await Medicine.findOne({
      $or: [
        ...(mongoose.isValidObjectId(id) ? [{ _id: id }] : []),
        { slug: id },
        { brandName: new RegExp(id.replace(/-/g, ' '), 'i') },
        { genericName: new RegExp(id.replace(/-/g, ' '), 'i') }
      ]
    }).lean();

    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }
    const alternatives = await findGenericAlternatives(medicine.brandName);
    res.json({ success: true, data: alternatives });
  } catch (error) {
    console.error('Alternatives fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch alternatives' });
  }
});

module.exports = router;
