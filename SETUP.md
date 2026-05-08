# Publishing to GitHub — Step by Step

This guide takes you from zero to a live public URL in about 10 minutes.

---

## 1. Create the GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `anfossi-terminal`
3. Description: `A Bloomberg-style open source financial intelligence terminal`
4. Set to **Public**
5. Do NOT initialize with README (you already have one)
6. Click **Create repository**

---

## 2. Push your files

Open Terminal in the folder where your files are saved, then run:

```bash
git init
git add .
git commit -m "Initial release: Anfossi Terminal v1.0"
git branch -M main
git remote add origin https://github.com/AlfoRojas/anfossi-terminal.git
git push -u origin main
```

---

## 3. Enable GitHub Pages (free hosting)

1. Go to your repo on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait ~60 seconds

Your terminal will be live at:
**https://alforojas.github.io/anfossi-terminal/**

Every time you push a change to `main`, the live site updates automatically.

---

## 4. Add the live URL to your README

Open `README.md` and add this near the top:

```markdown
🌐 **Live demo:** https://alforojas.github.io/anfossi-terminal/
```

Then commit and push:

```bash
git add README.md
git commit -m "Add live demo link"
git push
```

---

## 5. Make it easy to find (optional but recommended)

On your GitHub repo page:
- Click the ⚙️ gear icon next to **About**
- Add the website URL: `https://alforojas.github.io/anfossi-terminal/`
- Add topics: `finance`, `dashboard`, `bloomberg`, `open-source`, `html`, `markets`, `terminal`

This helps people discover your project via GitHub search.

---

## 6. Share it!

Once live, share the GitHub URL so friends can:
- **Star** the repo ⭐
- **Fork** it to make their own version
- **Open issues** to suggest improvements
- **Submit pull requests** to add their country or data

---

## Updating the terminal

Whenever you make a change to `index.html`:

```bash
git add index.html
git commit -m "Brief description of what you changed"
git push
```

GitHub Pages picks it up automatically within ~30 seconds.
