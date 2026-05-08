const express = require('express');
const { getOrSet, TTL } = require('../services/cache');

const router = express.Router();

// yahoo-finance2 is ESM-only — load it once via dynamic import
let _yf;
async function getYF() {
  if (!_yf) _yf = (await import('yahoo-finance2')).default;
  return _yf;
}

// Index symbols with metadata
const INDICES = [
  { symbol: '^GSPC',  name: 'S&P 500',    flag: '🇺🇸', region: 'us' },
  { symbol: '^IXIC',  name: 'NASDAQ',      flag: '🇺🇸', region: 'us' },
  { symbol: '^DJI',   name: 'DOW JONES',   flag: '🇺🇸', region: 'us' },
  { symbol: '^SSMI',  name: 'SMI',         flag: '🇨🇭', region: 'ch' },
  { symbol: '^IPSA',  name: 'IPSA',        flag: '🇨🇱', region: 'cl' },
  { symbol: '^MXX',   name: 'IPC (BMV)',   flag: '🇲🇽', region: 'mx' },
  { symbol: '^GDAXI', name: 'DAX',         flag: '🇩🇪', region: 'eu' },
  { symbol: '^N225',  name: 'NIKKEI 225',  flag: '🇯🇵', region: 'asia' },
  { symbol: '^FTSE',  name: 'FTSE 100',    flag: '🇬🇧', region: 'eu' },
  { symbol: '^FCHI',  name: 'CAC 40',      flag: '🇫🇷', region: 'eu' },
  { symbol: '^HSI',   name: 'HANG SENG',   flag: '🇭🇰', region: 'asia' },
];

// Commodities & crypto
const EXTRAS = [
  { symbol: 'GC=F',   name: 'GOLD',        flag: '🥇', region: 'commodity' },
  { symbol: 'CL=F',   name: 'WTI OIL',     flag: '🛢️', region: 'commodity' },
  { symbol: 'HG=F',   name: 'COPPER',       flag: '🟤', region: 'commodity' },
  { symbol: 'SI=F',   name: 'SILVER',       flag: '⚪', region: 'commodity' },
  { symbol: 'BTC-USD',name: 'BTC',          flag: '₿',  region: 'crypto' },
];

async function fetchQuote(symbol) {
  try {
    const yahooFinance = await getYF();
    const q = await yahooFinance.quote(symbol, {}, { validateResult: false });
    if (!q) return null;
    const price  = q.regularMarketPrice ?? 0;
    const change = q.regularMarketChangePercent ?? 0;
    return {
      symbol,
      price:    price,
      change:   change,
      up:       change >= 0,
      formatted: {
        price:  price > 10000
                  ? price.toLocaleString('en-US', { maximumFractionDigits: 0 })
                  : price.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        change: (change >= 0 ? '+' : '') + change.toFixed(2) + '%',
      },
    };
  } catch {
    return null;
  }
}

// GET /api/market
// Returns live quotes for all indices, commodities, and crypto.
router.get('/', async (req, res) => {
  try {
    const data = await getOrSet('market:all', TTL.MARKET, async () => {
      const all     = [...INDICES, ...EXTRAS];
      const results = await Promise.allSettled(all.map(i => fetchQuote(i.symbol)));

      const quotes = results.map((r, idx) => {
        const meta  = all[idx];
        const quote = r.status === 'fulfilled' ? r.value : null;
        return {
          ...meta,
          price:     quote?.price      ?? null,
          change:    quote?.change     ?? null,
          up:        quote?.up         ?? true,
          formatted: quote?.formatted  ?? { price: '—', change: '—' },
          live:      quote !== null,
        };
      });

      return { quotes, fetchedAt: new Date().toISOString() };
    });

    res.json(data);
  } catch (err) {
    console.error('[MARKET]', err.message);
    res.status(502).json({ error: 'Could not fetch market data', detail: err.message });
  }
});

// GET /api/market/:symbol — single symbol
router.get('/:symbol', async (req, res) => {
  try {
    const quote = await fetchQuote(req.params.symbol);
    if (!quote) return res.status(404).json({ error: 'Symbol not found' });
    res.json(quote);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
