# Contributing to Anfossi Terminal

First off — thank you for wanting to contribute! This project is built on the idea that a great financial intelligence tool should be open, collaborative, and personalizable for anyone in the world.

No contribution is too small. Fixing a typo, adding a news source for your country, or building an entire new tab — all of it makes the terminal better for everyone.

---

## 🧭 Ways to Contribute

- **Add a new country tab** — Brazil, Germany, Japan, India, Argentina... all welcome
- **Improve existing data** — spot an outdated macro number? Fix it with a source
- **Add news feeds** — RSS sources for underrepresented regions
- **Fix bugs** — open an issue or submit a PR directly
- **Improve the UI** — animations, mobile layout, accessibility
- **Connect real-time APIs** — replace hardcoded index values with live data
- **Write documentation** — help others understand how to customize the terminal

---

## 🛠️ How to Contribute (Step by Step)

### 1. Fork and clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/anfossi-terminal.git
cd anfossi-terminal
```

### 2. Open in your browser

```bash
open index.html
# or serve locally for proper CORS support:
python3 -m http.server 8080
```

### 3. Make your changes

All code is in `index.html`. The file has clear section comments to help you navigate:

```
// ══ HEADER & CLOCKS ══
// ══ TICKER TAPE ══
// ══ TAB PANELS (HTML) ══
//   ─── GLOBAL ───
//   ─── UNITED STATES ───
//   ─── SWITZERLAND ───
//   ─── CHILE ───
//   ─── MEXICO ───
//   ─── FX & CURRENCIES ───
//   ─── MACRO ECONOMICS ───
//   ─── INVESTMENT INSIGHTS ───
//   ─── NEWS FEED ───
//   ─── DRONE & MOBILITY ───
// ══ JAVASCRIPT ══
//   FX live data fetch
//   News feed system (FEEDS array, fetchFeed, renderNews)
//   Drone news system (DRONE_FEEDS array, fetchDroneFeed, renderDroneNews)
//   Chart.js chart definitions
```

### 4. Test your changes

- Open the file in Chrome or Firefox
- Check that your tab renders correctly
- Check that nothing else broke (click through all tabs)
- Test the news feed with Refresh if you added feeds

### 5. Submit a Pull Request

- Use a clear PR title: `Add Brazil tab`, `Fix Chile news feed`, `Improve mobile layout`
- Describe what you changed and why
- If adding macro data, link your source (IMF, World Bank, central bank, etc.)

---

## 🌍 Adding a New Country Tab

Here's the exact steps to add a new country. We'll use **Brazil** as an example.

### Step 1: Add the tab button

Find the `<div class="tab-bar">` section and add your tab:

```html
<div class="tab" onclick="show('brazil',this)">🇧🇷 BRAZIL</div>
```

### Step 2: Add the panel

Copy the structure of an existing country panel (e.g., Chile) and paste it after the last `</div><!-- /panel -->`:

```html
<!-- ─────── BRAZIL ─────── -->
<div class="panel" id="p-brazil">
  <!-- Your content here -->
</div>
```

Key cards to include:
- Central bank rate card
- Benchmark index card (Bovespa / IBOV)
- Key economic indicators (inflation, unemployment, debt)
- GDP & inflation charts (add your country's data to the existing chart datasets)

### Step 3: Add to the indices array

Find `const indices = [` and add your index:

```js
{ f:'🇧🇷', n:'BOVESPA', v:'128,450', c:'+0.71%', up:true },
```

### Step 4: Add to the Macro table

Find the `<table>` in `id="p-macro"` and add a column header and data cells for your country. Also update the title row:

```html
<th><span class="flag">🇧🇷</span> BRAZIL</th>
```

### Step 5: Add news sources

Find `const FEEDS = [` and add feeds tagged with your country:

```js
{ name: 'Google News BR', url: 'https://news.google.com/rss/search?q=brazil+economy+real+bovespa&hl=pt-BR&gl=BR&ceid=BR:pt-419', tag: 'brazil', icon: '🇧🇷' },
```

Then add the filter button in the news panel:

```html
<button class="nf-btn" onclick="filterNews('brazil',this)">🇧🇷 BRAZIL</button>
```

And add `'brazil'` detection to the `detectTag()` function:

```js
if (/\bbrazil\b|brazilian|bovespa|ibov|real brasileiro|\bbrl\b|petrobras|lula|selic/.test(t)) return 'brazil';
```

---

## 📊 Updating Macro Data

When updating macroeconomic figures, please include your source as a comment in the PR description. Preferred sources:

| Data Type | Source |
|-----------|--------|
| GDP, inflation, debt | [IMF World Economic Outlook](https://www.imf.org/en/Publications/WEO) |
| Unemployment | [ILO Statistics](https://ilostat.ilo.org) |
| Central bank rates | Official central bank websites |
| FX reserves | Central bank balance sheets |
| Credit ratings | S&P, Moody's, Fitch official pages |
| Salaries | ILO Global Wage Report, national statistics offices |
| FDI | UNCTAD World Investment Report |

Data should represent the most recent available annual figure, with the year noted.

---

## 🎨 Style Guide

The terminal uses a strict Bloomberg-inspired dark theme. Please keep your contributions consistent:

| Element | Color |
|---------|-------|
| Background | `#0d0d0f` |
| Cards | `#111215` |
| Amber accent | `#f59e0b` |
| Positive / up | `#22c55e` |
| Negative / down | `#ef4444` |
| Muted text | `#555` or `#888` |
| Body font | `'Courier New', monospace` |

Use existing CSS classes rather than inline styles where possible:
- `.up` / `.dn` — green / red colored values
- `.badge.bg` / `.badge.by` / `.badge.br` — green / yellow / red status badges
- `.card` — standard data card container
- `.idx-card` — index/metric stat card
- `.rr` / `.rl` / `.rv` — row, left label, right value layout

---

## 🐛 Reporting Issues

Open an issue with:
- What you expected to happen
- What actually happened
- Which browser you're using
- A screenshot if relevant

---

## 💬 Questions?

Open a GitHub Discussion or file an issue tagged `question`. All questions are welcome.

---

Thank you for making the terminal better. 🌍
