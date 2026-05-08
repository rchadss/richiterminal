# Roadmap

This document tracks planned improvements and future directions for Anfossi Terminal.
Community contributions on any of these are especially welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 🟢 Done (v1.0)

- [x] Bloomberg dark theme with amber accents
- [x] Live FX rates (open.er-api.com, refreshes every 60s)
- [x] Live news feed with multi-proxy fallback (allorigins → corsproxy.io → rss2json)
- [x] Country tabs: Global, US, Switzerland, Chile, Mexico
- [x] Macro comparison table (18+ indicators, 4 countries + world avg)
- [x] GDP and CPI inflation charts (Chart.js)
- [x] Sovereign bond yield table
- [x] Drone & Autonomous Mobility intelligence tab
- [x] Live clocks: New York, Zürich, Santiago, Ciudad de México
- [x] Scrolling ticker tape
- [x] News filters: US, Markets, Economy, Chile, Mexico, Switzerland, Commodities
- [x] Salary data (minimum wage + average salary) in macro table
- [x] Company links in Drone tab

---

## 🟡 In Progress / Near-term

### Real-time market data
- [ ] Replace hardcoded index values (S&P, IPC, SMI, IPSA) with live API calls
  - Candidate: Yahoo Finance unofficial API via CORS proxy
  - Candidate: Alpha Vantage free tier (25 calls/day)
  - Candidate: Financial Modeling Prep free tier

### Hosting & deployment
- [ ] GitHub Pages deployment (auto-deploy on push to main)
- [ ] Netlify deploy button in README

### Personalization
- [ ] User-configurable home country (saved in localStorage)
- [ ] Show/hide tabs toggle
- [ ] User-defined watchlist (tickers of interest)

---

## 🔵 Planned

### New country tabs
Community PRs welcome for any of these:
- [ ] 🇧🇷 Brazil (Bovespa, BCB rate, BRL)
- [ ] 🇦🇷 Argentina (Merval, BCRA, ARS/USD official vs blue)
- [ ] 🇩🇪 Germany (DAX, Bundesbank / ECB, EUR)
- [ ] 🇯🇵 Japan (Nikkei, BOJ, JPY)
- [ ] 🇨🇳 China (SSE, PBOC, CNY)
- [ ] 🇮🇳 India (Nifty 50, RBI, INR)
- [ ] 🇨🇦 Canada (TSX, BOC, CAD)
- [ ] 🇦🇺 Australia (ASX 200, RBA, AUD)

### Features
- [ ] Portfolio tracker — enter your holdings, see P&L
- [ ] Yield curve visualizer (US, CH, CL)
- [ ] Currency converter widget
- [ ] Dark / light theme toggle
- [ ] Export macro table to CSV
- [ ] Mobile-optimized layout (responsive breakpoints)
- [ ] Keyboard shortcuts for tab switching
- [ ] Historical FX chart (1W / 1M / 1Y)

### Data & automation
- [ ] World Bank API integration for auto-updating macro indicators
- [ ] GitHub Actions daily job to refresh `data.json` from free APIs
- [ ] Separate `data.js` / `data.json` layer (decouple data from presentation)

### Community
- [ ] Country template starter file for easy contributions
- [ ] "Your terminal" fork guide (rename + personalize in 5 minutes)
- [ ] Screenshot gallery of community forks

---

## 💡 Ideas (Not Committed)

These are possibilities being considered — not committed, open for discussion:

- Earnings calendar for US stocks
- Central bank meeting schedule and rate decision history
- AI-powered market summary (summarize today's news into 3 bullet points)
- Cryptocurrency market tab (BTC, ETH, SOL, top 20)
- Commodities deep-dive tab (oil, gold, copper, lithium, wheat)
- Latin America macro comparison (expand beyond Chile and Mexico)

---

Want to work on something from this list? Open an issue and let us know — we can help you get started.
