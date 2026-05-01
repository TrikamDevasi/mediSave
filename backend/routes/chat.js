const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }
    
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:3000';
    console.time('chat-request');
    const response = await axios.post(
      `${mlServiceUrl}/ml/chat`,
      { message, sessionId },
      { timeout: 30000 }
    );
    console.timeEnd('chat-request');
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to process chat message' });
  }
});

module.exports = router;
