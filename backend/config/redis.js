const Redis = require('ioredis');

let redisClient;

try {
  redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) {
        return null; // Stop retrying after 3 attempts
      }
      return Math.min(times * 1000, 3000);
    },
    enableOfflineQueue: false
  });
  
  redisClient.on('error', (err) => {
    // Only log if it's not a connection error to keep the console clean
    if (err.code !== 'ECONNREFUSED') {
      console.error('Redis Error:', err.message);
    }
  });
  
  redisClient.on('connect', () => {
    console.log('✅ Redis Connected');
  });
} catch (error) {
  console.error('Failed to initialize Redis:', error.message);
  redisClient = null;
}

async function getCache(key) {
  if (!redisClient || redisClient.status !== 'ready') return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    // Only log if it's not a connection issue
    if (err.message.indexOf('closed') === -1) {
      console.error('Redis getCache error:', err.message);
    }
    return null;
  }
}

async function setCache(key, value, ttl) {
  if (!redisClient || redisClient.status !== 'ready') return;
  try {
    await redisClient.setex(key, ttl, JSON.stringify(value));
  } catch (err) {
    if (err.message.indexOf('closed') === -1) {
      console.error('Redis setCache error:', err.message);
    }
  }
}

module.exports = { redisClient, getCache, setCache };
