# New Cars Platform -- Design Document

## Overview

A mobile-first car browsing platform for Q84Sale where users navigate a brand > model > trim > variant hierarchy to explore new cars and their details.

## Information Architecture

### Data Model

```
Brand (e.g., Mercedes-Benz)
  -> Model (e.g., C-Class)
    -> Trim (e.g., C 200 Avantgarde)
      -> Trim Variant (e.g., C 200 Avantgarde 1a, C 200 Avantgarde 2b)
```

### Route Structure

| Route | Page | Condition |
|-------|------|-----------|
| `/` | Home -- Brand Grid | Always |
| `/brands/[slug]` | Brand Page -- Model Carousel + Trim Feed | Always |
| `/brands/[slug]/[trimId]` | Variant Listing | When trim has >7 variants |
| `/brands/[slug]/[trimId]` | Details Page (with variant chip selector) | When trim has <=7 variants |
| `/brands/[slug]/[trimId]/[variantId]` | Details Page (specific variant) | When coming from variant listing |

### Mock Data Scope

- 5-6 brands: Mercedes-Benz, BMW, Toyota, Lexus, Porsche, Land Rover
- 3-5 models per brand
- 2-4 trims per model
- 1-3 variants per trim (some trims with >7 to exercise the variant listing page)
- Real car images sourced for each model/trim
- Realistic specs, pricing in KWD

---

## Page 1: Home -- Brand Selection Grid

**URL:** `/`

**Purpose:** Get the user to their brand in one tap. Nothing else.

**Layout:**
- `--neutral_50` background
- Page title: "New Cars" -- h1, 32px, 700 weight, `--neutral_900`
- Grid of brand cards: 2 columns mobile, 3 tablet, 4+ desktop
- 16px gap between cards

**Brand Card:**
- White background, flat, border `--neutral_100`
- Real brand logo (SVG/PNG) centered
- Brand name below: 14px, 700 weight, `--neutral_900`
- Full-card tap target
- Hover: `::before` overlay, `opacity: 0.08`, 0.2s ease-in-out
- Links to `/brands/[slug]`

**No search, no filters, no featured content.** Grid only.

---

## Page 2: Brand Page -- Model Carousel + Trim Feed

**URL:** `/brands/[slug]`

### Top Section -- Model Carousel

- Brand name as h1: 32px, 700 weight
- Card-stack component (21st.dev `ruixen.ui/card-stack`) used as-is -- 3D spring animations, perspective depth, drag gestures. This is a deliberate exception to the flat design system.
- Each card: model image, model name, starting price ("From KWD X")
- Tappable to select/deselect -- selected cards get `--prim_500` border ring
- Multi-select enabled
- Chip row below carousel shows selected models with X to deselect (design system chip pattern)
- Mobile: card-stack scales down, swipe/drag navigation
- Desktop: arrow keys + click

### Filter Row

- Horizontal scrollable chip row between carousel and feed
- Filters: Price range, Year, Body type, Engine type, Drivetrain, Transmission
- Tap chip opens a bottom sheet (slides in `translateY`, 0.3s ease-in-out)
- Active filters: `--prim_100` background, `--prim_500` border
- Filters reduce the feed in real-time

### Bottom Section -- Trim Feed

- 24px spacing below filters
- Section label: "Trims" -- h2, 24px, 700 weight
- Vertical scrolling list of trim cards
- Feed updates on model selection change (shimmer loading: 1.5s linear infinite)
- No model selected = show all trims for brand
- 1+ models selected = show trims for those models only

**Trim Card:**
- Horizontal layout: image left (thumbnail, fixed aspect ratio), text right
- Trim name: h4, 16px, 700
- Model name subtitle: 14px, 400, `--neutral_500`
- Starting price: 16px, 700, `--prim_500`
- Key spec tags below: "2.0L Turbo", "AWD", "255 HP"
- Border bottom `--neutral_100` separator
- Tap navigates to trim details (or variant listing if >7 variants)

---

## Page 3: Variant Listing (Conditional)

**URL:** `/brands/[slug]/[trimId]` (only when trim has >7 variants)

**Purpose:** When a trim has too many variants for a chip selector, show them as a browsable list first.

**Layout:**
- Trim name as h1
- Breadcrumb: Brand > Model > Trim (tappable, 14px, `--neutral_500`)
- Vertical list of variant cards

**Variant Card:**
- Image left, text right (same layout rhythm as trim cards)
- Variant name: h4, 16px, 700
- Price: 16px, 700, `--prim_500`
- Tap navigates to `/brands/[slug]/[trimId]/[variantId]`

---

## Page 4: Details Page

**URL:** `/brands/[slug]/[trimId]` (<=7 variants) or `/brands/[slug]/[trimId]/[variantId]` (>7 variants)

### Hero -- Image Gallery

- Full-width Swiper carousel, edge-to-edge on mobile
- 16:9 aspect ratio on mobile, capped height on desktop
- Dot pagination (5s ease-in-out fill per design system)
- Swipe on mobile, arrows on desktop hover
- 3-6 images: exterior angles, interior, dashboard

### Variant Selector (only when <=7 variants)

- Horizontal scrollable chip row directly below hero
- Each chip shows: variant name + price (e.g., "C 200 Avantgarde 1a - KWD 12,500")
- Selected: `--prim_500` background, white text
- Unselected: white background, `--neutral_100` border, `--neutral_700` text
- Switching variants updates price, specs, and images with shimmer transition
- First variant pre-selected by default

### Price & Title Block

- Breadcrumb: Brand > Model (tappable, 14px, 400, `--neutral_500`)
- Trim name: h1, 32px, 700
- Active variant name: 14px, 500, `--neutral_600`
- Price: h2, 24px, 700, `--prim_500` (e.g., "KWD 12,500")

### Color Swatches (immediately below title/price)

- Available exterior colors as small circles with actual color fills
- Selected color: `--prim_500` ring around swatch
- Tapping a swatch could update hero images if color-specific images exist (stretch goal)

### Specifications

- h2 "Specifications" heading
- Two-column grid: label left (14px, 400, `--neutral_500`), value right (14px, 700, `--neutral_900`)
- On narrow mobile: label stacks above value
- Grouped with h3 subheaders:

**Performance:**
- Engine (e.g., "2.0L 4-Cylinder Turbo")
- Horsepower
- Torque
- Transmission
- Drivetrain
- 0-100 km/h
- Top Speed

**Dimensions:**
- Length / Width / Height
- Wheelbase
- Curb Weight
- Cargo Volume

**Comfort & Features:**
- Seating Capacity
- Infotainment Screen Size
- Key features list

**Fuel & Efficiency:**
- Fuel Type
- Fuel Tank Capacity
- Fuel Consumption (L/100km)

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** CSS Modules with CSS custom properties (design tokens from Q84SALE-DESIGN-SYSTEM.md)
- **Font:** Custom "sakr font" (loaded via Next.js font optimization)
- **Carousel (hero):** Swiper.js
- **Carousel (models):** card-stack from 21st.dev (ruixen.ui/card-stack) -- Framer Motion dependency
- **Data:** Static mock JSON, generated with realistic specs and real car images

## Design System Compliance

All pages follow Q84SALE-DESIGN-SYSTEM.md tokens and patterns with one exception:

- **Exception:** The model card-stack carousel on the brand page uses 3D spring animations and depth effects from the card-stack component as-is. This is an intentional hero moment departure from the flat design rules.

Everything else -- colors, typography, spacing, transitions, chips, cards, bottom sheets, shimmer loading -- follows the design system strictly.

## Responsive Strategy

- **Mobile-first** -- all layouts designed for 375px+ first
- **Breakpoints:** Mobile (<640px), Tablet (640-1024px), Desktop (>1024px)
- **Container:** 700px max-width on desktop (per design system)
- **Touch targets:** Minimum 44x44px on all interactive elements
- **Grids:** 2-col mobile, 3-col tablet, 4-col desktop (home page)
- **Feed cards:** Horizontal layout on all sizes, image scales proportionally
- **Details specs:** Two-column on tablet+, stacked on mobile
