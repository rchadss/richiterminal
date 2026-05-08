const express = require('express');
const axios   = require('axios');
const { getOrSet, TTL } = require('../services/cache');

const router = express.Router();

// GET /api/fx
// Returns USD-based exchange rates for the currencies used in the terminal.
router.get('/', async (req, res) => {
  try {
    const data = await getOrSet('fx:usd', TTL.FX, async () => {
      const { data } = await axios.get('https://open.er-api.com/v6/latest/USD', {
        timeout: 8000,
      });
      if (data.result !== 'success') throw new Error('FX API returned non-success');
      return {
        base:      data.base_code,
        timestamp: data.time_last_update_unix,
        rates:     data.rates,
      };
    });

    res.json(data);
  } catch (err) {
    console.error('[FX]', err.message);
    res.status(502).json({ error: 'Could not fetch FX rates', detail: err.message });
  }
});

module.exports = router;
