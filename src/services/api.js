/* ============================================
   FILE: src/services/api.js
   ============================================ */

import axios from 'axios';

// ── News API ────────────────────────────────────────────────
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

const fallbackNews = [
  {
    source: 'OMEGA',
    title: 'Global energy shock exceeds 1970s crisis benchmarks',
  },
  {
    source: 'STRATCOM',
    title: 'Strait of Hormuz disruption choking 20% of global oil flow',
  },
  {
    source: 'BLACKROCK',
    title: 'Markets pricing in prolonged geopolitical instability',
  },
  {
    source: 'SENTINEL',
    title: 'Oil volatility triggering synchronized inflation fears worldwide',
  },
  {
    source: 'ORACLE',
    title: 'Food supply chains destabilizing due to fertilizer shortages',
  },
  {
    source: 'VANGUARD',
    title:
      'Global equities oscillate amid conflicting Iran negotiation signals',
  },
  {
    source: 'NEXUS',
    title: 'Safe haven assets failing as capital shifts to liquidity',
  },
  {
    source: 'HELIOS',
    title: 'Energy infrastructure damage reported across multiple regions',
  },
  {
    source: 'AEGIS',
    title:
      'Military escalation risk persists despite temporary diplomatic pauses',
  },
  {
    source: 'CIPHER',
    title: 'Trade routes rerouting as maritime risk premiums surge',
  },
  {
    source: 'QUANTUM',
    title:
      'Bond yields climbing amid inflationary pressure and rate uncertainty',
  },
  {
    source: 'PHOENIX',
    title: 'Emerging markets exposed to cascading fuel and currency shocks',
  },
  {
    source: 'ATLAS',
    title: 'Global GDP forecasts revised downward amid conflict uncertainty',
  },
  {
    source: 'ECLIPSE',
    title: 'China pivoting toward controlled growth under external pressure',
  },
  {
    source: 'TITAN',
    title: 'Western economies brace for stagflation scenarios',
  },
  {
    source: 'NEPTUNE',
    title: 'Shipping and logistics costs spike due to regional instability',
  },
  {
    source: 'HORIZON',
    title: 'Central banks reconsider rate cuts amid renewed inflation risks',
  },
  {
    source: 'SPECTER',
    title: 'Information warfare and narrative manipulation intensifying online',
  },
  {
    source: 'FALCON',
    title: 'Global security alerts rise as conflict spillover risk expands',
  },
  {
    source: 'LUMEN',
    title: 'Climate extremes compounding economic stress signals',
  },
];

export const fetchNews = async () => {
  try {
    const NEWS_COUNTRY = import.meta.env.VITE_NEWS_COUNTRY || 'in';
    const url = `https://newsapi.org/v2/top-headlines?country=${NEWS_COUNTRY}&category=business&apiKey=${NEWS_API_KEY}`;
    const res = await axios.get(url);
    return res.data.articles.map((a) => ({
      source: a.source?.name || 'Unknown',
      title: a.title,
    }));
  } catch (err) {
    console.error('News API failed:', err);
    return fallbackNews;
  }
};

// ── Currency Exchange API ───────────────────────────────────
// Uses exchangerate-api.com free tier — no key required for base INR
// Docs: https://www.exchangerate-api.com/docs/free
const EXCHANGE_BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

// Fallback rates relative to INR if API is down
const FALLBACK_RATES = {
  INR: 1,
  USD: 0.012,
  PHP: 0.69,
  EUR: 0.011,
  GBP: 0.0095,
  JPY: 1.78,
  AED: 0.044,
};

export const fetchExchangeRates = async (baseCurrency = 'INR') => {
  try {
    const res = await axios.get(`${EXCHANGE_BASE_URL}/${baseCurrency}`);
    return {
      base: res.data.base,
      rates: res.data.rates,
    };
  } catch (err) {
    console.error('Exchange rate API failed, using fallback:', err);
    // Build fallback relative to the requested base
    if (baseCurrency === 'INR') {
      return { base: 'INR', rates: FALLBACK_RATES };
    }
    // For other bases, invert from INR rates
    const baseRate = FALLBACK_RATES[baseCurrency] || 1;
    const rates = {};
    Object.entries(FALLBACK_RATES).forEach(([cur, rate]) => {
      rates[cur] = rate / baseRate;
    });
    return { base: baseCurrency, rates };
  }
};
