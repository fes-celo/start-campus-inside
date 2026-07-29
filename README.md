# Start Campus Inside

Build a single-page, fully responsive static landing page. No backend, no auth, no database — pure static React + Tailwind.

GLOBAL

- Font: Figtree (load from Google Fonts), weights 300/400/600/700, plus italic 300.

- Page background: #f4f4ff

- Primary accent: #12bd64 (buttons, links, eyebrows)

- Dark teal: #183538 (hero overlay, final CTA section bg)

- Body text: #1c1c1c

- Rounded corners: 10px on cards/buttons throughout.

- Max content width ~1152px, centered, with side padding on mobile.

HEADER / LOGO

"Start Campus" logo (lightning bolt icon + wordmark) top-left of the hero section, white/light version since it sits on a dark image.

SECTION 1 — HERO

Full-width rounded card, background image [hero background photo — data center exterior], dark gradient overlay (teal-black, ~24-28% opacity) over the image so white text is readable.

Centered content:

- Eyebrow: "START CAMPUS PRESENTS" — 12px, semibold, uppercase, color #12bd64

- H1: "Start Inside Out" — 72px bold, white (scale down to ~40px on mobile)

- Paragraph, white, light weight, centered, ~20px: "This 1.2GW campus is setting a new standard for global digital infrastructure. But scale isn't what defines it - the people running it are. Welcome to the core of our operations."

- Button: "Watch the Series" — green bg #12bd64, white text, semibold, rounded-10, ~56px tall.

SECTION 2 — THE INITIATIVE

Two columns (stack on mobile): left = team photo [team photo asset], right = text block:

- Eyebrow: "THE INITIATIVE" — green, uppercase, 12px semibold

- H2: "The human power behind hyperscale" — 36px bold, #1c1c1c

- Body (16px, #1c1c1c, line-height 26px): "Infrastructure sets the foundation, but it's people who make it work. Start Inside Out brings you inside one of Europe's most advanced data centers, through the teams who run it every day. From engineering to operations, every role plays a part in keeping the system running. Explore our talent from the inside out."

SECTION 3 — STORIES FROM THE INSIDE

Centered H2: "Stories from the inside" (36px bold)

3-column card grid (stack to 1 column on mobile), white cards, each with:

- Top: image thumbnail [story thumbnail 1/2/3] with dark gradient overlay and a centered play-triangle icon

- Name/title, bold 16px: "Márcio Reis | Site Operations Manager" / "Luís Marques | Senior Project Manager" / "Francisca Meneses | Program Manager"

- Italic quote, 14px light italic: 

  1. "Keeping a data center running isn't about reacting to problems - it's about making sure they never happen in the first place."

  2. "Before anything goes live, every system is tested, validated and pushed to its limits - because failure is not an option."

  3. "Between the first idea and the final build, there's a complex process of planning, coordination and decisions that shape everything that follows."

- Link: "Watch Story →" — green, semibold, 14px, small arrow icon

SECTION 4 — LIFE ON THE INSIDE

White rounded card container.

Centered H2: "Life on the inside" (36px bold)

Centered subtext: "What powers our operations" (16px regular)

3-column icon grid (stack on mobile), each: 64px circle icon bg #d6ece1, bold 20px heading, centered 14px paragraph:

1. Icon: lightning/leaf — "Environmental Stewardship" — "We build for the long term. Operating on 100% renewable energy, our approach combines efficiency, responsible resource use and recognised standards like LEED."

2. Icon: network/nodes — "Collaborative Innovation" — "We work in a fast-moving, mission-critical environment. Teams collaborate across functions to design and run systems that need to scale reliably, every day."

3. Icon: shield/check — "Culture of Security" — "Security is part of the day-to-day. From physical infrastructure to data, it's a shared responsibility across teams, supported by clear processes and constant attention."

SECTION 5 — STAND OUT (Current Opportunities)

Two columns (stack on mobile): left = text block:

- Eyebrow: "CURRENT OPPORTUNITIES" — green, uppercase

- H2: "Stand out" (36px bold)

- Body: "Start Campus is growing, and we're building teams with different backgrounds, experiences and perspectives. If you're looking to work on complex systems, take ownership and be part of something at scale, this is a place to do it."

- Button: "View Open Positions" — green bg, white text, rounded-10

Right column: aerial campus photo [aerial campus photo asset] with a centered play-triangle icon overlay.

SECTION 6 — FINAL CTA

Dark teal (#183538) rounded card, full width.

- H2 white: "The faces behind the infrastructure" (36px bold)

- Paragraph white, light weight: "Take a closer look at how this campus works, and the people behind it. Explore the series or reach out to the team."

- Button: "Get in touch" — outline style, 2px border #12bd64, transparent bg, white text

- To the right: award trophy graphic [trophy asset] with small text "Best Data Centre in Europe" and a DataCloud Awards badge/logo above it.

FOOTER

Centered: "Start Campus" logo + DataCloud Awards logo side by side, below it centered small text: "© 2026 Start Campus. All rights reserved."

RESPONSIVE RULES

All 2-column sections stack to 1 column under 768px. Hero H1 scales down to ~40-48px on mobile. All 3-column grids collapse to 1 column on mobile. Maintain generous vertical spacing between sections (~80-120px desktop, ~48px mobile).

Use this image as reference - it should look like this on desktop

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1b6d1796-7036-41d2-a341-777112162ee5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
