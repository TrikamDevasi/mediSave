const { redisClient } = require('../config/redis');

const cache = (ttlSeconds) => {
  return async (req, res, next) => {
    if (!redisClient || redisClient.status !== 'ready') return next();
    
    const key = `cache:${req.originalUrl || req.url}`;
    
    try {
      const cached = await redisClient.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    } catch (err) {
      if (err.message.indexOf('closed') === -1) {
        console.error('Redis cache read error:', err.message);
      }
    }
    
    const originalJson = res.json.bind(res);
    res.json = function (data) {
      if (redisClient && redisClient.status === 'ready' && data && data.success) {
        redisClient.setex(key, ttlSeconds, JSON.stringify(data)).catch(err => {
          if (err.message.indexOf('closed') === -1) {
            console.error('Redis cache write error:', err.message);
          }
        });
      }
      return originalJson(data);
    };
    
    next();
  };
};

module.exports = cache;
