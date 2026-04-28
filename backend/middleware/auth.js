const { redisClient } = require('../config/redis');

const rateLimiter = async (req, res, next) => {
  if (!redisClient) return next();
  
  const ip = req.ip || req.connection.remoteAddress;
  const key = `rate_limit:${ip}`;
  const windowSeconds = 15 * 60;
  const maxRequests = 100;
  
  try {
    const requests = await redisClient.incr(key);
    if (requests === 1) {
      await redisClient.expire(key, windowSeconds);
    }
    if (requests > maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests'
      });
    }
    next();
  } catch (err) {
    console.error('Rate limiter error:', err.message);
    next();
  }
};

module.exports = rateLimiter;
