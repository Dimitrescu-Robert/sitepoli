# Landing Page Redesign — Design Spec
**Date:** 2026-04-04  
**Status:** Approved  
**Scope:** index.html + styles.css (landing page only)

---

## Overview

Redesign complet al landing page-ului AdmiterePoli în stil dark learning platform (Brilliant.org + Duolingo). Tema va fi mereu dark (fără toggle). Implementare în vanilla HTML/CSS/JS, fără framework, fără build tools.

---

## 1. Color System

### Background
```
--lp-bg:          #111218   /* dark slate, nu negru pur — are nuanță blue-black */
--lp-bg-card:     #1a1b23   /* carduri, un nivel mai deschis */
--lp-bg-card-hover: #1f2030 /* hover state carduri */
--lp-bg-section:  #0d0e14   /* secțiuni alternante (CTA final) */
```

### Accente multiple
```
--lp-blue:        #5b9cf6   /* accent principal — hero, stats, nav */
--lp-green:       #34d399   /* simulări, pricing featured, CTA final */
--lp-yellow:      #fbbf24   /* badge-uri, highlight, stats */
--lp-indigo:      #818cf8   /* resurse, elemente secundare */

/* Glow shadows */
--lp-blue-glow:   rgba(91, 156, 246, 0.25)
--lp-green-glow:  rgba(52, 211, 153, 0.15)
--lp-yellow-glow: rgba(251, 191, 36, 0.2)
--lp-indigo-glow: rgba(129, 140, 248, 0.2)
```

### Text
```
--lp-text:        #f1f5f9   /* text primar */
--lp-text-muted:  #94a3b8   /* text secundar */
--lp-text-faint:  #64748b   /* text descriptiv */
--lp-border:      rgba(255,255,255,0.07)  /* border subtil */
```

---

## 2. Tipografie

**Font nou:** Plus Jakarta Sans (Google Fonts)
- Display/titluri: weight 800
- Subtitluri: weight 700
- Body: weight 400–500
- Înlocuiește DM Sans complet

**Păstrat:** Instrument Serif (italic, citate, titluri de efect)

**Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
```

---

## 3. Tema: mereu dark

- Eliminăm toggle-ul de temă din navbar
- Eliminăm clasele `.lp-dark` și logica de switch din JS
- CSS-ul se scrie direct fără variante light/dark
- `body.lp-body` devine singura sursă de adevăr pentru tokeni

---

## 4. Butoane — stil cartoonish (Duolingo)

Toate butoanele `.lp-btn` primesc:
```css
border-radius: 16px;
font-weight: 700;
transition: transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
```

**Primary (albastru):**
```css
background: #5b9cf6;
box-shadow: 0 4px 0 #2563eb;   /* shadow solid jos = efect 3D */
color: #fff;
```
- Hover: `translateY(-2px)` + shadow `0 6px 0 #2563eb`
- Active/click: `translateY(4px)` + shadow `0 0px 0 #2563eb`

**Primary (verde — featured/CTA):**
```css
background: #34d399;
box-shadow: 0 4px 0 #059669;
color: #111218;
```

**Outline:**
```css
border: 2px solid rgba(91,156,246,0.5);
color: #5b9cf6;
background: transparent;
```
- Hover: background `rgba(91,156,246,0.1)` + `translateY(-2px)`
- Active: `translateY(2px)`

---

## 5. Hero Section

**Layout:** centrat, padding generos top/bottom

**Fundal hero:**
- Background: `#111218`
- Noise texture overlay: `background-image: url("data:image/svg+xml...")` la opacity 3%
- Blob albastru difuz stânga-sus: `radial-gradient` `#5b9cf6` la 6% opacity
- Blob verde difuz dreapta-jos: `radial-gradient` `#34d399` la 4% opacity

**Elementele hero (de sus în jos):**
1. Badge pill: `"Preadmiterea 2026 — rezolvată complet"` — border `#5b9cf6`, bg `rgba(91,156,246,0.1)`, text `#5b9cf6`
2. H1: `"Admitere"` + `"Poli."` în gradient text albastru→indigo via `background-clip: text`
3. Subtitlu H2: `"Creat de studenți, pentru viitori studenți."` — `#94a3b8`
4. Paragraf descriere: `#64748b`, max-width 520px
5. Butoane CTA: Primary albastru + Outline

**Animație la load (staggered):**
- Badge: delay 0ms, fade-up 400ms
- H1: delay 80ms
- H2: delay 160ms
- Paragraf: delay 240ms
- Butoane: delay 320ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`

**Elementele decorative** (formule math, chart SVG): recolorate cu `#5b9cf6`, `#34d399`, opacity 0.35 — ornamentale, nu distrag.

---

## 6. Stats Bar

Container: `#1a1b23`, border-radius 20px, border `rgba(255,255,255,0.07)`

Cele 3 statistici cu accente distincte:
- `50+` Subiecte → `#5b9cf6` (albastru)
- `12` Exerciții video → `#34d399` (verde)
- `100%` Gratuit → `#fbbf24` (galben)

Numerele animate la scroll (counter up, existent în main.js — păstrăm logica).

---

## 7. Features Section (4 carduri)

Grid 2×2 desktop, 1 coloană mobile.

Fiecare card `#1a1b23`, border-radius 16px, border `rgba(255,255,255,0.07)`.

**Accent per card (border-top 3px solid + icon color):**
- Subiecte rezolvate → `#5b9cf6`
- Simulări interactive → `#34d399`
- Exerciții video → `#fbbf24`
- Resurse complete → `#818cf8`

**Hover:** `translateY(-4px)` + box-shadow în culoarea accentului la 25% opacity.

---

## 8. Pricing Section

**Plan Standard:**
- Card `#1a1b23`, border subtil
- Buton outline verde

**Plan Featured (Student Plus):**
- Background `#1a231f` (dark green tint)
- Border `2px solid #34d399` + glow `0 0 24px rgba(52,211,153,0.15)`
- Badge "Popular": background `#fbbf24`, text `#111218`, font-weight 800, border-radius 20px — cartoonish
- Buton: verde cartoonish cu shadow solid `0 4px 0 #059669`

---

## 9. Secțiunea Subiecte

Carduri per categorie cu border-left colorat:
- Simulare 2026 (cel mai recent) → `#5b9cf6`
- Preadmitere 2026 → `#34d399`
- Admitere 2025 → `#818cf8`

Link-urile Mate/Info → pill buttons mici cu background accent la 15% opacity.

---

## 10. About Section

- Poze fondatori: border ring gradient `#5b9cf6 → #34d399`
- Text în Instrument Serif italic
- Culori text standard din paletă

---

## 11. Final CTA Section

- Background: `#0d0e14` sau gradient mesh radial `#5b9cf6` + `#34d399` la 6% opacity
- Titlu mare Plus Jakarta Sans 800
- Buton verde cartoonish extra-large (`.lp-btn-lg`)

---

## 12. Footer

- Background `#0a0b10`
- Text `#64748b`
- Icon-uri social: opacity 0.6, hover opacity 1

---

## Implementare — Ce NU se schimbă

- Structura HTML a paginii (secțiuni, clase existente)
- Logica JS (contoare, newsletter popup, GSAP)
- Firebase auth integration
- Linkurile și conținutul textual
- Alte pagini (doar index.html + token-urile din styles.css care afectează landing)

---

## Fișiere modificate

1. `index.html` — font import nou, eliminare toggle temă, eliminare JS inline de theme switch
2. `styles.css` — token-uri noi, reguli `.lp-body` rescrise complet pentru dark permanent

---

## Definition of Done

- Landing page arată ca o platformă de learning modernă (dark, vibrant, Brilliant/Duolingo)
- Butoane au efect cartoonish press vizibil
- Animații staggered la load funcționale
- Accente multiple (albastru, verde, galben, indigo) aplicate consistent
- Nicio altă pagină din site nu e afectată
- Funcționează pe mobile (responsive păstrat)
