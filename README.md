# Alejandro — Personal Site

A single-page personal website. Static, dependency-free, and deployable to Vercel
with zero configuration.

**Design language:** "Institutional Modernism" — the grid discipline and authority of
IMF / UN / WTO communications, carried by an editorial serif voice so the page reads
as a person rather than a press release.

| Token | Value | Role |
| --- | --- | --- |
| Ink Navy | `#0B1F33` | 主题色 — structure, dark sections, type |
| Muted Teal | `#4E8D8A` | 低饱和强调色 — accents, data, links |
| Warm Paper | `#F7F5F1` | Body background |
| Sand · Clay · Sage · Dust · Gold | — | 点缀色 — section identity, variety |
| Fudan Crimson `#8E1B2E` · ZJU Blue `#1B3A6B` | — | Institution colours |

**Typography:** `Instrument Serif` (display) · `Inter` (UI/body) · `Noto Sans SC` (中文) ·
`JetBrains Mono` (data labels), served from Google Fonts.

---

## Structure

```
.
├── index.html      # single page — all five sections
├── styles.css      # design tokens + every component
├── script.js       # scroll, reveal, nav, clipboard (~200 lines, no deps)
├── favicon.svg     # inline SVG mark
├── vercel.json     # optional: clean URLs + security headers
└── README.md
```

Sections: **Hero** → **Education** → **Currently Exploring** → **More About Me** → **Contact**

### On the imagery

There are no binary image assets and no third-party image URLs. Every visual — the
output-gap chart, the sovereign yield curves, the agent node-graph, the medal
medallions, the Counter-Strike tactical radar, and the three film posters — is
hand-authored SVG/CSS. That keeps the page at roughly 60 KB total, makes it load
instantly, and means nothing can 404.

To swap in real photography, drop files into an `assets/` folder and replace the
relevant `<figure>` internals; the surrounding layout will not need changes.

---

## Preview locally

No build step and no install. Pick whichever you have:

**Python** (usually already present)

```bash
cd homepage-demo
python -m http.server 5173
```

**Node**

```bash
cd homepage-demo
npx --yes serve -l 5173
```

**VS Code** — install *Live Server*, right-click `index.html` → *Open with Live Server*.

Then open <http://localhost:5173>.

> Opening `index.html` directly via `file://` also works, but the `defer`red script and
> the smooth-scroll offset behave best over HTTP. Prefer the server.

---

## Deploy to Vercel

### Option A — Git integration (recommended)

1. Push this repo to GitHub (already done if you cloned it from there).
2. Go to <https://vercel.com/new>, import the repository.
3. Framework Preset: **Other**. Build Command: **empty**. Output Directory: **empty**.
4. Deploy. Every later `git push` redeploys automatically.

### Option B — CLI

```bash
npm i -g vercel
cd homepage-demo
vercel          # preview deployment
vercel --prod   # production
```

---

## Editing notes

- **Colour** lives entirely in `:root` in `styles.css`. Change `--accent` to re-skin the
  whole site; section accents come from the inline `--card-accent` / `--school` vars on
  individual elements.
- **Adding an Exploring card:** copy an `<article class="card">` block, set
  `--card-accent` inline, and bump the `01/02/03` label. The grid reflows on its own.
- **Animation** is intentionally restrained, and every effect is disabled under
  `@media (prefers-reduced-motion: reduce)`. Please keep it that way.
- **Breakpoints:** 1024px (collage stacks), 860px (nav collapses to a panel), 600px (type
  and poster scaling).

---

© Alejandro · Shanghai
