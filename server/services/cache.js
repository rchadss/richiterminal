const NodeCache = require('node-cache');

// TTL constants (seconds)
const TTL = {
  FX:     60,        // FX rates — 1 minute
  MARKET: 30,        // Stock quotes — 30 seconds
  NEWS:   300,       // News articles — 5 minutes
  MACRO:  86400,     // Macro data — 24 hours
};

const cache = new NodeCache({ checkperiod: 60 });

/**
 * Get a cached value or compute and store it.
 * @param {string} key   Cache key
 * @param {number} ttl   TTL in seconds
 * @param {Function} fn  Async function to compute the value on miss
 */
async function getOrSet(key, ttl, fn) {
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  const value = await fn();
  cache.set(key, value, ttl);
  return value;
}

function invalidate(key) {
  cache.del(key);
}

module.exports = { getOrSet, invalidate, TTL };
