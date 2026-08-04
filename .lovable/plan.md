## Start Inside Out — static landing page

Single route (`src/routes/index.tsx`) rewriting the placeholder, plus small presentational components. No backend.

### Design tokens (`src/styles.css`)

- Load Figtree via `<link>` in `src/routes/__root.tsx` (300/400/600/700 + 300 italic), register `--font-sans: Figtree`.
- Add oklch tokens for: page bg `#f4f4ff`, accent green `#12bd64`, dark teal `#183538`, body text `#1c1c1c`, icon-circle mint `#d6ece1`; radius `10px`.
- All components use semantic classes (`bg-background`, `text-accent`, etc.) — no hardcoded hex in JSX.

### Sections (in order, one component each under `src/components/landing/`)

1. **Hero** — rounded card, generated data-center exterior photo, teal-black gradient overlay ~26%, Start Campus lightning-bolt logo (inline SVG, light) top-left, eyebrow / H1 `clamp(40px → 72px)` / lead paragraph / green "Watch the Series" button.
2. **Initiative** — 2-col (stacks <768px): team photo left, eyebrow + H2 + body right.
3. **Stories** — centered H2 + 3 white cards (1-col on mobile): thumbnail with gradient + centered play triangle, name/title, italic quote, "Watch Story →" green link.
4. **Life on the inside** — white rounded container, H2 + subtext, 3 icon columns with 64px mint circles (lucide `Leaf`/`Zap`, `Network`, `ShieldCheck`).
5. **Stand out** — 2-col: text + green "View Open Positions" button left, aerial campus photo with play overlay right.
6. **Final CTA** — dark teal rounded card: H2 + paragraph + outlined green-border "Get in touch" button; trophy graphic with DataCloud Awards badge and "Best Data Centre in Europe" on the right.
7. **Footer** — centered Start Campus logo + DataCloud Awards logo, copyright line.

### Imagery

Generate five images and host them via Lovable Assets: hero data-center exterior, team group photo, three story portraits (thumbnails), aerial campus view, glass award trophy. Logos and play/arrow icons are inline SVG/lucide, not raster.

### Responsive & layout

`max-w-[1152px]` centered with mobile side padding; all 2-col and 3-col grids collapse to 1 column under `md`; section spacing ~48px mobile → ~112px desktop.

### SEO

Route-level `head()` on `/`: title "Start Inside Out | Start Campus", matching description, og:title/description, og:type, twitter:card, plus og:image/twitter:image pointing at the hero asset's absolute CDN URL. Single H1, semantic sections, alt text on every image.
