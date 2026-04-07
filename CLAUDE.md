# Q84Sale (4Sale) — New Cars

## Tech Stack
- **Framework**: Next.js
- **Styling**: CSS Modules with CSS custom properties (design tokens)
- **Carousel**: Swiper.js
- **Font**: Custom "sakr font"

## Design Context

### Users
Casual buyers and sellers in a local marketplace (Kuwait-based, Q84Sale/4Sale). They're browsing listings, looking for new cars and new cars details — often on mobile, often in quick sessions. The job to be done: find what you're looking for fast.

### Brand Personality
**Premium, Sleek, Confident.** Q84Sale positions itself above typical classifieds — it's a modern marketplace that feels trustworthy and high-end while remaining accessible to everyday users.

### Design Principles
1. **Token-faithful** — Every color, spacing, and typographic choice must come from the design token system. No ad-hoc values.
2. **Motion with purpose** — Animations communicate state changes only. Slide-in from edges, never fade in place. Respect the timing scale (0.2s micro, 0.3s CTA, 0.5s content).
3. **Flat confidence** — No shadows, no gradients, no rounded-everything. Brand blue (`#0062ff`) anchors every interactive surface. Cards are flat with subtle borders.
4. **Content-first density** — Let listings and content drive layout. Minimal chrome, no decorative elements.
5. **Accessible by default** — WCAG AA compliance minimum. High-contrast text, visible focus states, respect reduced motion.

### Reference
Full design tokens, component patterns, animation specs, and anti-patterns: see `Q84SALE-DESIGN-SYSTEM.md`.
Detailed design context and emotional goals: see `.impeccable.md`.
