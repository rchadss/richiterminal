# 📊 Anfossi Terminal

> A Bloomberg-style financial intelligence terminal — open source, single-file, zero dependencies, zero cost.

Built to make sense of global markets at a glance. Covers the US, Switzerland, Chile, Mexico, and the world. Personalizable for any country or interest area. No backend, no API keys, no server — just open the HTML file and go.

![Terminal Preview](docs/preview.png)

---

## ✨ Features

- **10 dashboard tabs** — Global, United States, Switzerland, Chile, Mexico, FX & Currencies, Macro Economics, Investment Insights, News Feed, Drone & Mobility
- **Live FX rates** via open.er-api.com (refreshes every 60s, no API key)
- **Live news feed** from Reuters, MarketWatch, Yahoo Finance, CNBC, and Google News — filterable by country and category
- **Bloomberg dark theme** with amber highlights and real-time ticker tape
- **Live clocks** for New York, Zürich, Santiago, and Ciudad de México
- **Macro comparison table** — GDP, inflation, unemployment, debt, salaries and more across 4 countries + world average
- **Interactive charts** — GDP history, inflation trends, sovereign bond yields
- **Drone & Mobility intelligence** — market data and company tracker for the autonomous delivery sector
- **Zero server required** — a single `.html` file you open in any browser

---

## 🚀 Getting Started

No installation. No dependencies. No build step.

```bash
git clone https://github.com/AlfoRojas/anfossi-terminal.git
cd anfossi-terminal
open index.html   # macOS
# or just double-click index.html on Windows/Linux
```

For the best experience with live news feeds, serve it over HTTP (avoids file:// CORS restrictions):

```bash
# Python (built into macOS/Linux)
python3 -m http.server 8080
# then open http://localhost:8080
```

Or deploy instantly for free with [GitHub Pages](https://pages.github.com) or [Netlify](https://netlify.com) — see the [Deployment Guide](#-deployment).

---

## 🌍 Personalizing Your Terminal

The terminal is designed to be forked and adapted. Here are the most common customizations:

### Change the terminal name
Search for `Anfossi's Terminal` in `index.html` and replace with your name.

### Add a new country tab
1. Add a tab button in the `<div class="tab-bar">` section
2. Create a `<div class="panel" id="p-yourcountry">` with your market data
3. Add your country's index to the `indices` array in the JS section
4. Add RSS feeds for your country to the `FEEDS` array with the appropriate tag

### Add news sources
In the `FEEDS` array (search for `const FEEDS`), add an entry:
```js
{ name: 'Your Source', url: 'https://example.com/rss', tag: 'yourcountry', icon: '🏳️' }
```
Tags: `us`, `chile`, `mexico`, `switzerland`, `commodities`, `economy`, `markets`

### Change market data
All market index values are in the `indices` array. Macro table data is in the HTML table inside `id="p-macro"`. Update values to match your preferred markets.

---

## 🏗️ Project Structure

```
anfossi-terminal/
├── index.html          # The entire application (HTML + CSS + JS)
├── README.md           # This file
├── CONTRIBUTING.md     # How to contribute
├── ROADMAP.md          # Planned features
├── LICENSE             # MIT
└── docs/
    └── preview.png     # Screenshot for README
```

Everything lives in `index.html`. This is intentional — zero-dependency, open-in-browser simplicity. As the project grows, we may split it into separate files.

---

## 🤝 Contributing

Contributions are very welcome! Whether it's a new country tab, better data sources, UI improvements, or bug fixes — open a PR.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

**Quick contribution ideas:**
- Add a new country (Brazil, Argentina, Germany, Japan...)
- Add RSS news sources for an underrepresented region
- Improve macro data accuracy
- Add a dark/light theme toggle
- Improve mobile responsiveness
- Add a portfolio tracker section
- Connect a free real-time stock API

---

## 🚢 Deployment

### GitHub Pages (free, recommended)
1. Push your fork to GitHub
2. Go to **Settings → Pages → Source → main branch / root**
3. Your terminal will be live at `https://yourusername.github.io/anfossi-terminal/`

### Netlify (free, instant)
1. Drag and drop the `index.html` file at [app.netlify.com/drop](https://app.netlify.com/drop)
2. You'll get a live URL in seconds

---

## 📡 Data Sources

| Data | Source | Live? |
|------|--------|-------|
| FX / Currency rates | [open.er-api.com](https://open.er-api.com) | ✅ Live |
| News feed | RSS via [allorigins.win](https://api.allorigins.win) proxy | ✅ Live |
| Google News (regional) | Google News RSS search | ✅ Live |
| Market indices | Reference values (May 2026 estimates) | 🔄 Manual |
| Macro data | IMF, World Bank, central bank publications | 🔄 Manual |
| Salary data | ILO, national statistics offices | 🔄 Manual |

**Note:** Market index values (S&P, IPC, SMI, IPSA) are reference estimates and are not real-time. Connecting a real-time free API (Yahoo Finance, Alpha Vantage) is on the [roadmap](ROADMAP.md).

---

## 🗺️ Roadmap

See [ROADMAP.md](ROADMAP.md) for the full list of planned improvements.

---

## 📜 License

MIT © [Alfonso Rojas Anfossi](https://github.com/AlfoRojas)

Use it freely, fork it, sell a version of it — just keep the license notice.
