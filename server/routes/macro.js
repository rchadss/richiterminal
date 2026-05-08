const express = require('express');
const axios   = require('axios');
const { getOrSet, TTL } = require('../services/cache');

const router = express.Router();

// World Bank indicator codes
const WB_INDICATORS = {
  gdpGrowth:    'NY.GDP.MKTP.KD.ZG',   // GDP growth (annual %)
  inflation:    'FP.CPI.TOTL.ZG',       // CPI inflation (annual %)
  unemployment: 'SL.UEM.TOTL.ZS',       // Unemployment (% of labour force)
  debtGdp:      'GC.DOD.TOTL.GD.ZS',   // Central government debt (% GDP)
  currentAcct:  'BN.CAB.XOKA.GD.ZS',   // Current account balance (% GDP)
};

const COUNTRIES = {
  us:          'US',
  switzerland: 'CH',
  chile:       'CL',
  mexico:      'MX',
};

async function fetchIndicator(indicator, countryCodes) {
  const codes = countryCodes.join(';');
  const url   = `https://api.worldbank.org/v2/country/${codes}/indicator/${indicator}?format=json&mrv=1&per_page=10`;
  try {
    const { data } = await axios.get(url, { timeout: 8000 });
    if (!Array.isArray(data) || !data[1]) return {};
    const result = {};
    data[1].forEach(entry => {
      if (entry.value !== null) {
        result[entry.countryiso3code || entry.country?.id] = {
          value: entry.value,
          year:  entry.date,
        };
      }
    });
    return result;
  } catch {
    return {};
  }
}

// GET /api/macro
// Returns live World Bank macro indicators for US, CH, CL, MX.
router.get('/', async (req, res) => {
  try {
    const data = await getOrSet('macro:wb', TTL.MACRO, async () => {
      const codes   = Object.values(COUNTRIES);
      const [gdpGrowth, inflation, unemployment, debtGdp, currentAcct] =
        await Promise.all(Object.values(WB_INDICATORS).map(ind => fetchIndicator(ind, codes)));

      return {
        countries: Object.entries(COUNTRIES).map(([key, iso2]) => ({
          key,
          iso2,
          gdpGrowth:    gdpGrowth[iso2]    || null,
          inflation:    inflation[iso2]     || null,
          unemployment: unemployment[iso2]  || null,
          debtGdp:      debtGdp[iso2]      || null,
          currentAcct:  currentAcct[iso2]   || null,
        })),
        fetchedAt: new Date().toISOString(),
      };
    });

    res.json(data);
  } catch (err) {
    console.error('[MACRO]', err.message);
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
