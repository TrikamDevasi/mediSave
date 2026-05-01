const express = require('express');
const router = express.Router();
const { chatWithRAG } = require('./langchain.chain');

router.post('/', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ success: false, error: 'message is required' });

    const result = await chatWithRAG(message, sessionId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
