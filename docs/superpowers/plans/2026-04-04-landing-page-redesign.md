# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign landing page (index.html) to a permanent dark learning platform aesthetic inspired by Brilliant.org and Duolingo, with multi-color accents, cartoonish buttons, and staggered hero animations.

**Architecture:** All changes live in `index.html` (font import, remove toggle, remove JS theme switch) and `styles.css` (update `.lp-body` variable block from light → dark, update landing component styles). No new files. No other pages need touching — the CSS is scoped to `.lp-body` so any page using it also benefits from the dark default.

**Tech Stack:** Vanilla HTML/CSS, no build tools. Verification = open in browser via `python3 -m http.server 8000`.

---

## Task 1: Update font import + remove theme toggle from index.html

**Files:**
- Modify: `index.html:19-21` (font import)
- Modify: `index.html:44-51` (theme toggle button)
- Modify: `index.html:307-328` (JS theme switch block)

- [ ] **Step 1: Replace font import**

In `index.html`, find and replace the font link block (lines ~19-21):

Old:
```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Instrument+Serif:ital@0;1&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
```

New:
```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Remove theme toggle button from nav**

In `index.html`, remove this entire block (lines ~44-51):
```html
                <button class="theme-toggle" id="theme-toggle" aria-label="Schimbă tema">
                    <span class="theme-toggle-icon theme-toggle-sun">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                    </span>
                    <span class="theme-toggle-icon theme-toggle-moon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    </span>
                </button>
```

- [ ] **Step 3: Remove inline JS theme switch**

Remove the entire script block at the bottom of `index.html` that starts with:
```html
        <script>
            (function(){
                var body = document.body;
                var btn = document.getElementById('theme-toggle');
                var stored = localStorage.getItem('profile-theme') || 'light';
```
...and ends with the closing `})();` and `</script>`.

Also remove the flash-prevention scripts at the top:
```html
        <script>
            (function(){
                var t = localStorage.getItem('profile-theme') || 'light';
                if (t === 'dark') document.documentElement.classList.add('lp-dark-init');
                else document.documentElement.style.background = '#ffffff';
            })();
        </script>
        <style>.lp-dark-init { background: #1a2744 !important; }</style>
```

- [ ] **Step 4: Add lp-dark class to body directly (always dark)**

In `index.html`, change:
```html
    <body class="lp-body">
```
to:
```html
    <body class="lp-body lp-dark">
```

This ensures dark theme is active immediately without JS, using the existing `.lp-body.lp-dark` variable block (which already has correct dark values). We will update those dark values in Task 2.

- [ ] **Step 5: Verify in browser**

Run: `python3 -m http.server 8000` then open `http://localhost:8000`

Expected: Page loads dark (from existing `.lp-body.lp-dark` variables). No toggle button visible. No flash of white.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: make landing always dark, remove theme toggle, update fonts"
```

---

## Task 2: Update dark color tokens to new Brilliant/Duolingo palette

**Files:**
- Modify: `styles.css` — `.lp-body.lp-dark` block (line ~7739)

The existing `.lp-body.lp-dark` block has dark values that are now always active (because body has `lp-dark` class). We update its variables to the new palette.

- [ ] **Step 1: Update core background + text tokens**

In the `.lp-body.lp-dark` block, update these variables:

```css
  --lp-bg-page: #111218;
  --lp-color-body: #f1f5f9;
  --lp-heading: #f1f5f9;
  --lp-text: #94a3b8;
  --lp-text-muted: #94a3b8;
  --lp-text-soft: #64748b;
  --lp-text-faint: #64748b;
  --lp-border: rgba(255, 255, 255, 0.07);
  --lp-surface: #1a1b23;
  --lp-surface-hover: #1f2030;
  --lp-surface-muted: #1a1b23;
  --lp-shadow-3d: #070709;
  --lp-shadow-deep: #070709;
```

- [ ] **Step 2: Update nav + footer tokens**

```css
  --lp-nav-bg: rgba(17, 18, 24, 0.92);
  --lp-nav-border: rgba(255, 255, 255, 0.06);
  --lp-nav-link: #94a3b8;
  --lp-footer-bg: #0a0b10;
  --lp-footer-border: rgba(255, 255, 255, 0.06);
  --lp-footer-text: #64748b;
  --lp-hamburger: #e2e8f0;
```

- [ ] **Step 3: Update accent tokens (blue as primary)**

```css
  --lp-accent: #5b9cf6;
  --lp-accent-border: #3b7de8;
  --lp-accent-shadow: #2563eb;
  --lp-accent-deep: #1d4ed8;
  --lp-on-accent: #ffffff;
  --lp-on-accent-contrast: #111218;
```

- [ ] **Step 4: Add new multi-accent variables**

After the accent tokens, add these new variables inside the `.lp-body.lp-dark` block:

```css
  /* Multi-accent system */
  --lp-blue:        #5b9cf6;
  --lp-green:       #34d399;
  --lp-yellow:      #fbbf24;
  --lp-indigo:      #818cf8;
  --lp-blue-glow:   rgba(91, 156, 246, 0.25);
  --lp-green-glow:  rgba(52, 211, 153, 0.20);
  --lp-yellow-glow: rgba(251, 191, 36, 0.20);
  --lp-indigo-glow: rgba(129, 140, 248, 0.20);
  --lp-blue-shadow:   #2563eb;
  --lp-green-shadow:  #059669;
```

- [ ] **Step 5: Update button tokens**

```css
  --lp-btn-fill-hover-bg: #7baef8;
  --lp-btn-fill-shadow-glow: rgba(91, 156, 246, 0.25);
  --lp-btn-fill-shadow-glow-hover: rgba(91, 156, 246, 0.35);
  --lp-btn-fill-shadow-glow-active: rgba(91, 156, 246, 0.15);
  --lp-btn-outline-surface: transparent;
  --lp-btn-outline-fg: #5b9cf6;
  --lp-btn-outline-border: rgba(91, 156, 246, 0.4);
  --lp-btn-outline-shadow-y: rgba(17, 18, 24, 0.9);
  --lp-btn-outline-hover-border: rgba(91, 156, 246, 0.65);
  --lp-btn-outline-hover-bg: rgba(91, 156, 246, 0.1);
  --lp-btn-outline-hover-glow: rgba(91, 156, 246, 0.12);
  --lp-btn-outline-active-glow: rgba(0, 0, 0, 0.25);
```

- [ ] **Step 6: Update landing section tokens**

```css
  --lp-landing-stats-bg: #1a1b23;
  --lp-landing-stats-edge: rgba(255, 255, 255, 0.06);
  --lp-stat-divider-color: rgba(255, 255, 255, 0.07);
  --lp-landing-pricing-bg: #111218;
  --lp-landing-plan-border: rgba(255, 255, 255, 0.07);
  --lp-plan-featured-gradient: linear-gradient(160deg, #0f201a 0%, #0a1a14 100%);
  --lp-plan-featured-shadow: rgba(52, 211, 153, 0.15);
  --lp-plan-featured-shadow-hover: rgba(52, 211, 153, 0.25);
  --lp-plan-featured-btn-bg: #34d399;
  --lp-plan-featured-btn-fg: #111218;
  --lp-plan-featured-btn-shadow: #059669;
  --lp-plan-check-color: #34d399;
  --lp-plan-featured-check: #34d399;
  --lp-plan-badge-text: #111218;
  --lp-feature-card-surface: #1a1b23;
  --lp-feature-border: rgba(255, 255, 255, 0.07);
  --lp-feature-hover-shadow-neutral: rgba(0, 0, 0, 0.4);
  --lp-subiecte-section-border: rgba(255, 255, 255, 0.06);
  --lp-subiecte-section-shadow: rgba(0, 0, 0, 0.35);
  --lp-subiecte-link-hover: #7baef8;
  --lp-subiecte-separator: #475569;
  --lp-final-cta-gradient: linear-gradient(160deg, #0a1a14 0%, #0d2018 100%);
  --lp-final-cta-btn-bg: #34d399;
  --lp-final-cta-btn-fg: #111218;
  --lp-final-cta-btn-shadow: #059669;
  --lp-final-cta-radial-a: rgba(52, 211, 153, 0.12);
  --lp-final-cta-radial-b: rgba(91, 156, 246, 0.08);
  --lp-mobile-nav-bg: #1a1b23;
  --lp-mobile-nav-link: #e2e8f0;
  --lp-mobile-auth-bg: #5b9cf6;
```

- [ ] **Step 7: Verify in browser**

Open `http://localhost:8000`. Expected: Page background is `#111218`, nav is near-black, text is off-white, buttons are blue.

- [ ] **Step 8: Commit**

```bash
git add styles.css
git commit -m "feat: update dark palette to Brilliant/Duolingo vivid dark system"
```

---

## Task 3: Replace font-family DM Sans → Plus Jakarta Sans + update lp-big-title

**Files:**
- Modify: `styles.css` — all `'DM Sans'` references within landing component styles

- [ ] **Step 1: Global font-family replace in styles.css**

Use Edit tool with `replace_all: true` to replace all instances of:
```
'DM Sans', sans-serif
```
with:
```
'Plus Jakarta Sans', sans-serif
```

This covers all 27 references across `.lp-btn`, `.lp-stat-num`, `.lp-section-header`, `.lp-feature-card h3`, `.lp-plan-name`, `.lp-about h2`, `.lp-final-cta h2`, etc.

- [ ] **Step 2: Update lp-big-title font**

Find in `styles.css`:
```css
.lp-big-title {
  font-family: 'Playfair Display', 'Instrument Serif', serif !important;
  font-style: normal !important;
  font-weight: 900 !important;
  font-size: 5.5rem !important;
  letter-spacing: -3px !important;
  color: var(--lp-heading, #1a2744) !important;
  -webkit-text-fill-color: var(--lp-heading, #1a2744) !important;
  background: none !important;
  -webkit-background-clip: unset !important;
  background-clip: unset !important;
  text-shadow: none !important;
```

Replace with:
```css
.lp-big-title {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-style: normal !important;
  font-weight: 800 !important;
  font-size: 5.5rem !important;
  letter-spacing: -3px !important;
  background: linear-gradient(135deg, #f1f5f9 0%, #5b9cf6 60%, #818cf8 100%) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  text-shadow: none !important;
```

- [ ] **Step 3: Update lp-hero-badge font reference**

Find in `.lp-hero-badge`:
```css
  font-family: 'DM Sans', sans-serif;
```
(after the replace_all in Step 1 this is already done — verify it says `'Plus Jakarta Sans', sans-serif`)

- [ ] **Step 4: Verify in browser**

Open `http://localhost:8000`. Expected: Title "AdmiterePoli." is in Plus Jakarta Sans, with a subtle blue-to-indigo gradient. All body text is Plus Jakarta Sans. No serif fonts except Instrument Serif if used.

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "feat: switch to Plus Jakarta Sans, gradient title text"
```

---

## Task 4: Cartoonish buttons + hero ambient blobs + stagger animation

**Files:**
- Modify: `styles.css` — `.lp-btn`, `.lp-btn-fill`, `.lp-btn-outline-blue` (line ~1937)
- Modify: `styles.css` — `.lp-hero`, `.lp-hero-badge`, `.lp-title-wrap`, `.lp-hero h2`, `.lp-hero-desc` (line ~2004)

- [ ] **Step 1: Update .lp-btn border-radius to cartoonish**

Find:
```css
.lp-btn {
  display: inline-block;
  padding: 1rem 2.4rem;
  border-radius: 999px;
```

Replace:
```css
.lp-btn {
  display: inline-block;
  padding: 1rem 2.4rem;
  border-radius: 16px;
```

- [ ] **Step 2: Update .lp-btn-fill to blue cartoonish with solid shadow**

Find:
```css
.lp-btn-fill {
  background: var(--lp-accent, #7BA0D9);
  color: var(--lp-btn-solid-fg, #fff);
  box-shadow: 0 5px 0 var(--lp-accent-shadow, #5a82ba), 0 7px 12px var(--lp-btn-fill-shadow-glow, rgba(90, 130, 186, 0.25));
}

.lp-btn-fill:hover {
  transform: translateY(-2px) scale(1.04);
  background: var(--lp-btn-fill-hover-bg, #8db3e6);
  box-shadow: 0 7px 0 var(--lp-accent-shadow, #5a82ba), 0 12px 24px var(--lp-btn-fill-shadow-glow-hover, rgba(90, 130, 186, 0.35));
  filter: brightness(1.08);
}

.lp-btn-fill:active {
  transform: translateY(3px) scale(0.98);
  box-shadow: 0 2px 0 var(--lp-accent-shadow, #5a82ba), 0 3px 6px var(--lp-btn-fill-shadow-glow-active, rgba(90, 130, 186, 0.2));
  filter: brightness(0.95);
}
```

Replace:
```css
.lp-btn-fill {
  background: var(--lp-accent, #5b9cf6);
  color: var(--lp-on-accent, #fff);
  box-shadow: 0 4px 0 var(--lp-accent-shadow, #2563eb);
}

.lp-btn-fill:hover {
  transform: translateY(-3px);
  background: var(--lp-btn-fill-hover-bg, #7baef8);
  box-shadow: 0 7px 0 var(--lp-accent-shadow, #2563eb);
  filter: brightness(1.05);
}

.lp-btn-fill:active {
  transform: translateY(4px);
  box-shadow: 0 0px 0 var(--lp-accent-shadow, #2563eb);
  filter: brightness(0.95);
}
```

- [ ] **Step 3: Update .lp-btn-outline-blue to cartoonish**

Find:
```css
.lp-btn-outline-blue {
  background: var(--lp-btn-outline-surface, #fff);
  color: var(--lp-btn-outline-fg, var(--lp-text, #3a4a5c));
  border: 3px solid var(--lp-btn-outline-border, #d5dde8);
  box-shadow: 0 5px 0 var(--lp-btn-outline-shadow-y, #c0cad8), 0 7px 12px rgba(0, 0, 0, 0.06);
}

.lp-btn-outline-blue:hover {
  transform: translateY(-2px) scale(1.04);
  border-color: var(--lp-btn-outline-hover-border, #b0bdd0);
  background: var(--lp-btn-outline-hover-bg, #f8faff);
  box-shadow: 0 7px 0 var(--lp-btn-outline-shadow-y, #c0cad8), 0 12px 24px var(--lp-btn-outline-hover-glow, rgba(0, 0, 0, 0.1));
}

.lp-btn-outline-blue:active {
  transform: translateY(3px) scale(0.98);
  box-shadow: 0 2px 0 var(--lp-btn-outline-shadow-y, #c0cad8), 0 3px 6px var(--lp-btn-outline-active-glow, rgba(0, 0, 0, 0.05));
}
```

Replace:
```css
.lp-btn-outline-blue {
  background: var(--lp-btn-outline-surface, transparent);
  color: var(--lp-btn-outline-fg, #5b9cf6);
  border: 2px solid var(--lp-btn-outline-border, rgba(91,156,246,0.4));
  box-shadow: 0 4px 0 var(--lp-btn-outline-shadow-y, rgba(17,18,24,0.9));
}

.lp-btn-outline-blue:hover {
  transform: translateY(-3px);
  border-color: var(--lp-btn-outline-hover-border, rgba(91,156,246,0.65));
  background: var(--lp-btn-outline-hover-bg, rgba(91,156,246,0.1));
  box-shadow: 0 7px 0 var(--lp-btn-outline-shadow-y, rgba(17,18,24,0.9));
}

.lp-btn-outline-blue:active {
  transform: translateY(4px);
  box-shadow: 0 0px 0 var(--lp-btn-outline-shadow-y, rgba(17,18,24,0.9));
}
```

- [ ] **Step 4: Add hero ambient blob backgrounds**

Find:
```css
.lp-hero {
  min-height: calc(80vh - 80px);
  padding: 4rem 2rem 3rem !important;
  justify-content: center;
  position: relative;
}
```

Replace:
```css
.lp-hero {
  min-height: calc(80vh - 80px);
  padding: 4rem 2rem 3rem !important;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.lp-hero::before {
  content: '';
  position: absolute;
  top: -20%;
  left: -15%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(91, 156, 246, 0.07) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.lp-hero::after {
  content: '';
  position: absolute;
  bottom: -10%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(52, 211, 153, 0.05) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 5: Update hero badge color**

Find:
```css
.lp-hero-badge {
  background: linear-gradient(135deg, rgba(123,160,217,0.12), rgba(123,160,217,0.06)) !important;
  border: 1px solid var(--lp-hero-badge-border, rgba(123,160,217,0.2)) !important;
  color: var(--lp-accent, #7BA0D9) !important;
```

Replace:
```css
.lp-hero-badge {
  background: rgba(91, 156, 246, 0.1) !important;
  border: 1px solid rgba(91, 156, 246, 0.3) !important;
  color: #5b9cf6 !important;
```

- [ ] **Step 6: Add staggered load animations**

After the `.lp-hero-badge` block, add:

```css
/* ── Hero staggered load animation ── */
@keyframes lp-fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.lp-hero-badge {
  animation: lp-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both !important;
  animation-delay: 0ms !important;
}

.lp-title-wrap {
  animation: lp-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 80ms;
}

.lp-hero h2 {
  animation: lp-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 160ms;
}

.lp-hero-desc {
  animation: lp-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 240ms;
}

.lp-hero .hero-btn {
  animation: lp-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 320ms;
}

@media (prefers-reduced-motion: reduce) {
  .lp-hero-badge, .lp-title-wrap, .lp-hero h2, .lp-hero-desc, .lp-hero .hero-btn {
    animation: none !important;
  }
}
```

- [ ] **Step 7: Override conflicting `animation: none !important` on .lp-hero-badge**

The existing `.lp-hero-badge` rule has `animation: none !important;` which blocks Step 6. Find in `.lp-hero-badge`:
```css
  animation: none !important;
```
Remove that line entirely.

- [ ] **Step 8: Verify hero h2 and hero-desc text colors**

`.lp-hero h2` uses `color: var(--lp-text, #3a4a5c) !important` and `.lp-hero-desc` uses `color: var(--lp-text-soft, #6b7f96)`. Both resolve via the `--lp-text` and `--lp-text-soft` tokens updated in Task 2 to `#94a3b8` and `#64748b` respectively. No code change needed — just confirm in browser that h2 is `#94a3b8` (light muted) and description is `#64748b` (faint).

- [ ] **Step 9: Verify in browser**

Open `http://localhost:8000`. Expected: 
- Hero elements fade up on load (badge first, then title, then desc, then buttons)
- Buttons have a visible "pressed down" shadow, pop up on hover, click down on active
- Title has blue-to-indigo gradient text
- Subtle blue glow blob top-left, green glow bottom-right

- [ ] **Step 10: Commit**

```bash
git add styles.css
git commit -m "feat: cartoonish buttons, hero blobs, staggered load animation"
```

---

## Task 5: Stats bar per-accent colors

**Files:**
- Modify: `styles.css` — `.lp-stat-num` and add nth-child targeting (line ~2249)

- [ ] **Step 1: Add nth-child color overrides for stats**

After the `.lp-stat-num` rule block, add:

```css
/* Per-stat accent colors */
.lp-stats-bar .lp-stat-item:nth-child(1) .lp-stat-num,
.lp-stats-bar .lp-stat-item:nth-child(1) .lp-stat-suffix {
  color: #5b9cf6;
}

.lp-stats-bar .lp-stat-item:nth-child(3) .lp-stat-num,
.lp-stats-bar .lp-stat-item:nth-child(3) .lp-stat-suffix {
  color: #34d399;
}

.lp-stats-bar .lp-stat-item:nth-child(5) .lp-stat-num,
.lp-stats-bar .lp-stat-item:nth-child(5) .lp-stat-suffix {
  color: #fbbf24;
}
```

Note: nth-child(1), (3), (5) because `.lp-stat-divider` elements are children too (odd positions are items, even are dividers).

- [ ] **Step 2: Update stats bar background**

Find:
```css
.lp-stats-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  padding: 2.5rem 2rem;
  background: var(--lp-landing-stats-bg, linear-gradient(135deg, #f0f5fc, #f8faff));
  border-top: 1px solid var(--lp-landing-stats-edge, rgba(123, 160, 217, 0.1));
  border-bottom: 1px solid var(--lp-landing-stats-edge, rgba(123, 160, 217, 0.1));
  border-radius: 0;
}
```

Replace:
```css
.lp-stats-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  padding: 2.5rem 2rem;
  background: var(--lp-landing-stats-bg, #1a1b23);
  border-top: 1px solid var(--lp-landing-stats-edge, rgba(255,255,255,0.06));
  border-bottom: 1px solid var(--lp-landing-stats-edge, rgba(255,255,255,0.06));
  border-radius: 0;
}
```

- [ ] **Step 3: Verify**

Open `http://localhost:8000`. Expected: First stat number blue, second green, third yellow. Stats background is dark `#1a1b23`.

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "feat: per-accent colors on stats bar"
```

---

## Task 6: Feature cards per-accent colors

**Files:**
- Modify: `styles.css` — add per-card nth-child accent overrides after `.lp-feature-card` block

- [ ] **Step 1: Add per-card accent variables via nth-child**

After the `.lp-feature-card:hover .lp-feature-icon` block, add:

```css
/* Card 1: Subiecte → Blue */
.lp-features-grid .lp-feature-card:nth-child(1) {
  border-top: 3px solid #5b9cf6;
}
.lp-features-grid .lp-feature-card:nth-child(1) .lp-feature-icon {
  color: #5b9cf6;
  background: rgba(91, 156, 246, 0.12);
}
.lp-features-grid .lp-feature-card:nth-child(1):hover {
  box-shadow: 0 16px 40px rgba(91, 156, 246, 0.15), 0 4px 12px rgba(0,0,0,0.3);
  border-color: rgba(91, 156, 246, 0.5);
}
.lp-features-grid .lp-feature-card:nth-child(1):hover .lp-feature-icon {
  background: #5b9cf6;
  color: #fff;
}

/* Card 2: Simulări → Green */
.lp-features-grid .lp-feature-card:nth-child(2) {
  border-top: 3px solid #34d399;
}
.lp-features-grid .lp-feature-card:nth-child(2) .lp-feature-icon {
  color: #34d399;
  background: rgba(52, 211, 153, 0.12);
}
.lp-features-grid .lp-feature-card:nth-child(2):hover {
  box-shadow: 0 16px 40px rgba(52, 211, 153, 0.15), 0 4px 12px rgba(0,0,0,0.3);
  border-color: rgba(52, 211, 153, 0.5);
}
.lp-features-grid .lp-feature-card:nth-child(2):hover .lp-feature-icon {
  background: #34d399;
  color: #111218;
}

/* Card 3: Video → Yellow */
.lp-features-grid .lp-feature-card:nth-child(3) {
  border-top: 3px solid #fbbf24;
}
.lp-features-grid .lp-feature-card:nth-child(3) .lp-feature-icon {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.12);
}
.lp-features-grid .lp-feature-card:nth-child(3):hover {
  box-shadow: 0 16px 40px rgba(251, 191, 36, 0.12), 0 4px 12px rgba(0,0,0,0.3);
  border-color: rgba(251, 191, 36, 0.5);
}
.lp-features-grid .lp-feature-card:nth-child(3):hover .lp-feature-icon {
  background: #fbbf24;
  color: #111218;
}

/* Card 4: Resurse → Indigo */
.lp-features-grid .lp-feature-card:nth-child(4) {
  border-top: 3px solid #818cf8;
}
.lp-features-grid .lp-feature-card:nth-child(4) .lp-feature-icon {
  color: #818cf8;
  background: rgba(129, 140, 248, 0.12);
}
.lp-features-grid .lp-feature-card:nth-child(4):hover {
  box-shadow: 0 16px 40px rgba(129, 140, 248, 0.15), 0 4px 12px rgba(0,0,0,0.3);
  border-color: rgba(129, 140, 248, 0.5);
}
.lp-features-grid .lp-feature-card:nth-child(4):hover .lp-feature-icon {
  background: #818cf8;
  color: #fff;
}
```

- [ ] **Step 2: Verify**

Open `http://localhost:8000`. Expected: Each feature card has a colored top border. Icon matches that color. On hover: card lifts with a glow in its accent color, icon background fills with solid color.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: per-accent colors on feature cards (blue/green/yellow/indigo)"
```

---

## Task 7: Pricing section — green featured card, cartoonish badges

**Files:**
- Modify: `styles.css` — `.lp-plan-featured`, `.lp-plan-badge`, `.lp-plan-featured .lp-btn-fill` (line ~2418)

- [ ] **Step 1: Update plan-featured to green dark theme**

Find:
```css
.lp-plan-featured {
  background: var(--lp-plan-featured-gradient, linear-gradient(160deg, #1a2744 0%, #243353 100%));
  border-color: transparent;
  box-shadow: 0 8px 30px var(--lp-plan-featured-shadow, rgba(26, 39, 68, 0.25));
}

.lp-plan-featured:hover {
  box-shadow: 0 20px 50px var(--lp-plan-featured-shadow-hover, rgba(26, 39, 68, 0.35));
}
```

Replace:
```css
.lp-plan-featured {
  background: var(--lp-plan-featured-gradient, linear-gradient(160deg, #0f201a 0%, #0a1a14 100%));
  border: 2px solid rgba(52, 211, 153, 0.4) !important;
  box-shadow: 0 8px 30px rgba(52, 211, 153, 0.12), 0 0 0 1px rgba(52, 211, 153, 0.1);
}

.lp-plan-featured:hover {
  box-shadow: 0 20px 50px rgba(52, 211, 153, 0.2), 0 0 0 1px rgba(52, 211, 153, 0.15);
}
```

- [ ] **Step 2: Update "Popular" badge to yellow cartoonish**

Find:
```css
.lp-plan-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, var(--lp-accent, #7BA0D9), var(--lp-feature-icon-hover-end, #6b8fd0));
  color: var(--lp-on-accent, #fff);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
```

Replace:
```css
.lp-plan-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #fbbf24;
  color: #111218;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  box-shadow: 0 3px 0 #d97706;
}
```

- [ ] **Step 3: Update plan-featured button to green cartoonish**

Find:
```css
.lp-plan-featured .lp-btn-fill {
  background: var(--lp-plan-featured-btn-bg, #7BA0D9);
  color: var(--lp-plan-featured-btn-fg, #ffffff);
  box-shadow: 0 5px 0 var(--lp-plan-featured-btn-shadow, #5a82ba), 0 7px 12px var(--lp-btn-fill-shadow-glow, rgba(90, 130, 186, 0.3));
}

.lp-plan-featured .lp-btn-fill:active {
  transform: translateY(3px);
  box-shadow: 0 2px 0 var(--lp-plan-featured-btn-shadow, #5a82ba);
}
```

Replace:
```css
.lp-plan-featured .lp-btn-fill {
  background: var(--lp-plan-featured-btn-bg, #34d399);
  color: var(--lp-plan-featured-btn-fg, #111218);
  box-shadow: 0 4px 0 var(--lp-plan-featured-btn-shadow, #059669);
}

.lp-plan-featured .lp-btn-fill:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 0 var(--lp-plan-featured-btn-shadow, #059669);
  filter: brightness(1.05);
}

.lp-plan-featured .lp-btn-fill:active {
  transform: translateY(4px);
  box-shadow: 0 0px 0 var(--lp-plan-featured-btn-shadow, #059669);
}
```

- [ ] **Step 4: Verify**

Open `http://localhost:8000`. Expected: "Student Plus" card has a dark green background with green border glow. "Popular" badge is yellow with a visible bottom shadow. Button is green, presses down on click.

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "feat: pricing featured card green dark, yellow cartoonish badge"
```

---

## Task 8: Subiecte section, About founders ring, Final CTA green, Footer

**Files:**
- Modify: `styles.css` — `.lp-subiecte-section`, `.lp-founder img`, `.lp-final-cta`, `footer` (line ~2552)

- [ ] **Step 1: Subiecte section — colored border-left per category**

After `.lp-subiecte-section .separator { ... }`, add:

```css
/* Colored border-left per exam category */
.lp-subiecte-section .sub-links > section:nth-child(1) .dropdown-design {
  border-left: 3px solid #5b9cf6;
  padding-left: 1rem;
}

.lp-subiecte-section .sub-links > section:nth-child(2) .dropdown-design {
  border-left: 3px solid #34d399;
  padding-left: 1rem;
}

.lp-subiecte-section .sub-links > section:nth-child(3) .dropdown-design {
  border-left: 3px solid #818cf8;
  padding-left: 1rem;
}
```

- [ ] **Step 2: Update Subiecte heading h3 colors to match accents**

Find:
```css
.lp-subiecte-section .dropdown-design h3 {
  color: var(--lp-accent, #7BA0D9) !important;
}
```

Keep as is (it uses `--lp-accent` which is now `#5b9cf6` for the first one). But the 2nd and 3rd headings need different colors. Add:

```css
.lp-subiecte-section .sub-links > section:nth-child(2) .dropdown-design h3 {
  color: #34d399 !important;
}

.lp-subiecte-section .sub-links > section:nth-child(3) .dropdown-design h3 {
  color: #818cf8 !important;
}
```

- [ ] **Step 3: Update founder img ring to gradient**

Find:
```css
.lp-founder img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--lp-links-pill-border, rgba(123, 160, 217, 0.2));
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

Replace:
```css
.lp-founder img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid transparent;
  background: linear-gradient(#1a1b23, #1a1b23) padding-box,
              linear-gradient(135deg, #5b9cf6, #34d399) border-box;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

- [ ] **Step 4: Update final CTA to green dark + green button**

Find:
```css
.lp-final-cta .lp-btn-fill {
  position: relative;
  background: var(--lp-final-cta-btn-bg, #fff);
  color: var(--lp-final-cta-btn-fg, #1a2744);
  box-shadow: 0 5px 0 var(--lp-final-cta-btn-shadow, #b0b8c4), 0 7px 12px rgba(0, 0, 0, 0.2);
}

.lp-final-cta .lp-btn-fill:hover {
  background: var(--lp-surface-muted, #f0f5fc);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 7px 0 var(--lp-final-cta-btn-shadow, #b0b8c4), 0 12px 24px rgba(0, 0, 0, 0.3);
  filter: brightness(1.05);
}

.lp-final-cta .lp-btn-fill:active {
  transform: translateY(3px) scale(0.98);
  box-shadow: 0 2px 0 var(--lp-final-cta-btn-shadow, #b0b8c4), 0 3px 6px rgba(0, 0, 0, 0.15);
}
```

Replace:
```css
.lp-final-cta .lp-btn-fill {
  position: relative;
  background: var(--lp-final-cta-btn-bg, #34d399);
  color: var(--lp-final-cta-btn-fg, #111218);
  box-shadow: 0 4px 0 var(--lp-final-cta-btn-shadow, #059669);
  font-size: 1.1rem;
  padding: 1.15rem 3.2rem;
}

.lp-final-cta .lp-btn-fill:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 0 var(--lp-final-cta-btn-shadow, #059669);
  filter: brightness(1.05);
}

.lp-final-cta .lp-btn-fill:active {
  transform: translateY(4px);
  box-shadow: 0 0px 0 var(--lp-final-cta-btn-shadow, #059669);
}
```

- [ ] **Step 5: Update footer background**

Find the `.lp-body footer` block in styles.css and verify `background` uses `var(--lp-footer-bg)` which is now set to `#0a0b10`. If it uses a hardcoded value, update it.

- [ ] **Step 6: Verify full page**

Open `http://localhost:8000`. Scroll through the entire page and check:
- [ ] Hero: dark background, blue glow left, green glow right, staggered animation on first load, gradient title
- [ ] Stats: 3 different accent colors
- [ ] Feature cards: 4 different border-top + icon colors, colored glow on hover
- [ ] Pricing: green dark featured card with green border, yellow badge, green button
- [ ] Subiecte: 3 sections with blue/green/indigo left borders
- [ ] About: gradient border ring on founder photos
- [ ] Final CTA: dark green section, green button with solid shadow
- [ ] All buttons: lift on hover, press down on click with visible shadow change

- [ ] **Step 7: Commit**

```bash
git add styles.css
git commit -m "feat: subiecte accents, gradient founder ring, green CTA, footer"
```

---

## Task 9: Polish + cleanup

**Files:**
- Modify: `styles.css` — miscellaneous fixes found during review
- Modify: `index.html` — any remaining hardcoded colors

- [ ] **Step 1: Remove hardcoded color in Subiecte section headings in HTML**

In `index.html` around line 221:
```html
<li><h3 style="color: #7BA0D9;">Simulare 2026</h3></li>
```
Remove the inline `style="color: #7BA0D9;"` — the CSS nth-child rules handle colors now.

Same for line 229:
```html
<li><h3 style="color: #7BA0D9;">Preadmitere 2026</h3></li>
```
Remove inline style.

- [ ] **Step 2: Ensure lp-body background applies correctly**

In `styles.css`, the `.lp-body` light block sets `background: var(--lp-bg-page) !important;`. Since we're always using `.lp-dark`, the `.lp-body.lp-dark` override sets `--lp-bg-page: #111218`. Verify the `html` element also has a matching background so there's no flash. Add to `.lp-body.lp-dark`:

```css
  background: #111218 !important;
```

- [ ] **Step 3: Verify mobile responsive**

Open `http://localhost:8000` at mobile width (375px in DevTools). Check:
- Nav hamburger visible and dark
- Feature cards stack to 1 column
- Pricing plans stack to 1 column
- Buttons full-width where expected
- No overflow or horizontal scroll

- [ ] **Step 4: Final commit**

```bash
git add index.html styles.css
git commit -m "feat: landing page redesign complete — dark Brilliant/Duolingo theme"
```
