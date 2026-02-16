# 📸 Screenshot Guide - Target Khatam

## How to Add Screenshots to README

Since the browser tool is currently unavailable, here's how to manually capture and add screenshots:

### Step 1: Capture Screenshots

1. **Open the app** in your browser at `http://localhost:8081`

2. **Capture these screens:**
   - **Home Screen** - Main dashboard showing overall progress
   - **Progress Screen** - Tab showing juz overview with all 30 juz
   - **Settings Screen** - Settings page with language selector and about info

3. **Recommended tools:**
   - Mac: `Cmd + Shift + 4` (select area) or `Cmd + Shift + 3` (full screen)
   - Windows: `Win + Shift + S`
   - Browser DevTools: Open DevTools (F12) → Device Mode → Resize to mobile (375x812) → Screenshot

### Step 2: Optimize Images

```bash
# Recommended dimensions
Width: 250-300px for side-by-side display
Format: PNG or WebP
```

### Step 3: Save to Assets Folder

```bash
mkdir -p assets/screenshots
mv ~/Desktop/screenshot-*.png assets/screenshots/
```

Rename files to:
- `home-screen.png`
- `progress-screen.png`
- `settings-screen.png`

### Step 4: Update README.md

Replace the screenshot section (around line 31) with actual file paths:

```markdown
## 🖼️ Screenshots

<div align="center">
  <img src="assets/screenshots/home-screen.png" alt="Home Screen" width="250"/>
  <img src="assets/screenshots/progress-screen.png" alt="Progress Screen" width="250"/>
  <img src="assets/screenshots/settings-screen.png" alt="Settings Screen" width="250"/>
</div>
```

### Alternative: Using Demo GIF

For a more dynamic showcase, create an animated GIF:

```bash
# Use tools like:
# - LICEcap (Mac/Windows)
# - Gifski (Mac)
# - ScreenToGif (Windows)

# Then add to README:
<div align="center">
  <img src="assets/demo.gif" alt="Target Khatam Demo" width="300"/>
</div>
```

---

## Quick Command (Optional)

If you want to automate screenshot capture via command line on Mac:

```bash
# Install screenshot tool
npm install -g capture-website-cli

# Capture screenshots
capture-website http://localhost:8081 --width=375 --height=812 --output=assets/screenshots/home-screen.png
```

---

**Note:** Once screenshots are added, commit them to the repository so they display properly on GitHub.
