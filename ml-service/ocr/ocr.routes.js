const express = require('express');
const router = express.Router();
const { orchestratePrescriptionScan } = require('./ocr.orchestrator');

router.post('/scan', async (req, res) => {
  try {
    const { image, mimeType = 'image/jpeg' } = req.body;
    if (!image) return res.status(400).json({ success: false, error: 'image (base64) is required' });
    if (image.length > 15_000_000) return res.status(413).json({ success: false, error: 'Image too large. Max ~10MB.' });

    const result = await orchestratePrescriptionScan(image, mimeType);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
