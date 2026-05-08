const express   = require('express');
const RSSParser = require('rss-parser');
const { getOrSet, TTL } = require('../services/cache');

const router = express.Router();
const parser = new RSSParser({ timeout: 8000 });

// ── Feed definitions ──────────────────────────────────────────
const FEEDS = [
  // United States
  { name: 'Reuters Business',  url: 'https://feeds.reuters.com/reuters/businessNews',                                                                           tag: 'us',          icon: '🌐' },
  { name: 'MarketWatch',       url: 'https://feeds.marketwatch.com/marketwatch/topstories/',                                                                    tag: 'us',          icon: '📈' },
  { name: 'Yahoo Finance',     url: 'https://finance.yahoo.com/rss/topstories',                                                                                 tag: 'us',          icon: '💹' },
  { name: 'CNBC Finance',      url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html',                                                                     tag: 'us',          icon: '📺' },
  { name: 'Investing.com',     url: 'https://www.investing.com/rss/news.rss',                                                                                   tag: 'us',          icon: '💰' },
  { name: 'Google News US',    url: 'https://news.google.com/rss/search?q=US+economy+wall+street+federal+reserve+nasdaq&hl=en-US&gl=US&ceid=US:en',            tag: 'us',          icon: '🇺🇸' },

  // Switzerland
  { name: 'SwissInfo',         url: 'https://www.swissinfo.ch/eng/rss/economy',                                                                                 tag: 'switzerland', icon: '🇨🇭' },
  { name: 'Google News CH',    url: 'https://news.google.com/rss/search?q=switzerland+economy+SNB+franc+UBS&hl=en-US&gl=US&ceid=US:en',                       tag: 'switzerland', icon: '🇨🇭' },

  // Mexico
  { name: 'Google News MX',    url: 'https://news.google.com/rss/search?q=mexico+economia+peso+banxico&hl=es-419&gl=MX&ceid=MX:es-419',                       tag: 'mexico',      icon: '🇲🇽' },
  { name: 'Google News MX EN', url: 'https://news.google.com/rss/search?q=mexico+economy+peso+banxico+nearshoring&hl=en-US&gl=US&ceid=US:en',                 tag: 'mexico',      icon: '🇲🇽' },
  { name: 'El Economista MX',  url: 'https://www.eleconomista.com.mx/rss/finanzas.xml',                                                                         tag: 'mexico',      icon: '🇲🇽' },

  // Chile
  { name: 'Google News CL',    url: 'https://news.google.com/rss/search?q=chile+economia+peso+cobre+codelco&hl=es-419&gl=CL&ceid=CL:es-419',                  tag: 'chile',       icon: '🇨🇱' },
  { name: 'Google News CL EN', url: 'https://news.google.com/rss/search?q=chile+economy+copper+IPSA+peso+lithium&hl=en-US&gl=US&ceid=US:en',                  tag: 'chile',       icon: '🇨🇱' },
  { name: 'Emol Economía',     url: 'https://www.emol.com/rss/Noticias/rss_noticias_mundo_economico.xml',                                                       tag: 'chile',       icon: '🇨🇱' },

  // Commodities
  { name: 'Google Commodities', url: 'https://news.google.com/rss/search?q=gold+oil+copper+silver+commodities+prices&hl=en-US&gl=US&ceid=US:en',              tag: 'commodities', icon: '⚡' },
  { name: 'CNBC Commodities',   url: 'https://www.cnbc.com/id/100727362/device/rss/rss.html',                                                                   tag: 'commodities', icon: '🛢️' },
];

// Drone & Mobility feeds (separate endpoint)
const DRONE_FEEDS = [
  { name: 'Dronelife',           url: 'https://dronelife.com/feed/',                             icon: '🚁', droneSpecific: true  },
  { name: 'The Robot Report',    url: 'https://www.therobotreport.com/feed/',                    icon: '🤖', droneSpecific: true  },
  { name: 'Commercial UAV News', url: 'https://www.commercialuavnews.com/feed',                  icon: '🛸', droneSpecific: true  },
  { name: 'TechCrunch Robotics', url: 'https://techcrunch.com/category/robotics/feed/',          icon: '⚡', droneSpecific: false },
  { name: 'Freightwaves',        url: 'https://www.freightwaves.com/news/feed',                  icon: '🏭', droneSpecific: false },
  { name: 'IEEE Spectrum',       url: 'https://spectrum.ieee.org/feeds/feed.rss',                icon: '🔬', droneSpecific: false },
];

const DRONE_KEYWORDS = [
  'drone','uav','uas','evtol','air taxi','urban air mobility','vertiport',
  'autonomous delivery','last-mile delivery','delivery robot','delivery drone',
  'autonomous vehicle','self-driving','autonomous truck','autonomous logistics',
  'warehouse robot','logistics robot','logistics automation','cargo drone',
  'joby aviation','archer aviation','wisk','lilium','volocopter','zipline',
  'starship robot','nuro','serve robotics','droneup','aurora innovation',
  'boston dynamics','bvlos','unmanned aircraft','unmanned vehicle',
];

// ── Helpers ───────────────────────────────────────────────────
function stripHtml(str) {
  return (str || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

function detectTag(title, desc, sourceTag) {
  if (['us','switzerland','chile','mexico','commodities'].includes(sourceTag)) return sourceTag;
  const t = (title + ' ' + (desc || '')).toLowerCase();
  if (/\bmexico\b|mexican|banxico|\bmxn\b|nearshoring|pemex|sheinbaum/.test(t))  return 'mexico';
  if (/\bchile\b|chilean|ipsa\b|codelco|sqm\b|\bclp\b|boric/.test(t))           return 'chile';
  if (/switzerland|swiss|\bsnb\b|\bchf\b|zurich|ubs\b|novartis/.test(t))         return 'switzerland';
  if (/\bgold\b|\bsilver\b|\bcopper\b|\boil\b|\bcrude\b|brent|wti|natural gas|commodity|commodities/.test(t)) return 'commodities';
  if (/\bfed\b|federal reserve|inflation|\bgdp\b|interest rate|recession|\bimf\b/.test(t)) return 'economy';
  return 'markets';
}

function droneMatches(text) {
  const t = text.toLowerCase();
  return DRONE_KEYWORDS.some(kw => t.includes(kw.toLowerCase()));
}

async function parseFeed(feed) {
  try {
    const parsed = await parser.parseURL(feed.url);
    return (parsed.items || []).slice(0, 15).map(item => ({
      title:   stripHtml(item.title || ''),
      link:    item.link || item.guid || '#',
      pubDate: item.pubDate || item.isoDate || '',
      summary: stripHtml(item.contentSnippet || item.content || '').slice(0, 200),
      source:  feed.name,
      icon:    feed.icon,
    }));
  } catch {
    return [];
  }
}

// ── Routes ────────────────────────────────────────────────────

// GET /api/news            → all articles
// GET /api/news?tag=chile  → filtered by tag
router.get('/', async (req, res) => {
  try {
    const articles = await getOrSet('news:all', TTL.NEWS, async () => {
      const results = await Promise.allSettled(FEEDS.map(f => parseFeed(f)));

      const all = [];
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          r.value.forEach(item => {
            all.push({
              ...item,
              tag: detectTag(item.title, item.summary, FEEDS[i].tag),
            });
          });
        }
      });

      // Sort newest first
      all.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
      return all;
    });

    const { tag } = req.query;
    const filtered = tag ? articles.filter(a => a.tag === tag) : articles;

    res.json({ articles: filtered, total: filtered.length, fetchedAt: new Date().toISOString() });
  } catch (err) {
    console.error('[NEWS]', err.message);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/news/drone  → drone & mobility articles
router.get('/drone', async (req, res) => {
  try {
    const articles = await getOrSet('news:drone', TTL.NEWS, async () => {
      const results = await Promise.allSettled(DRONE_FEEDS.map(f => parseFeed(f)));

      const all = [];
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          const feed  = DRONE_FEEDS[i];
          const items = feed.droneSpecific
            ? r.value
            : r.value.filter(item => droneMatches(item.title + ' ' + item.summary));

          items.forEach(item => all.push({ ...item, droneSpecific: feed.droneSpecific }));
        }
      });

      all.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
      return all;
    });

    res.json({ articles, total: articles.length, fetchedAt: new Date().toISOString() });
  } catch (err) {
    console.error('[DRONE NEWS]', err.message);
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
