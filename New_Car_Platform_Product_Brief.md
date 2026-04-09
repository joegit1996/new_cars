**PRODUCT BRIEF**

**4Sale New Cars**

Browse, Compare & Configure New Cars in Kuwait

Prepared by Youssef Emad

April 2026

---

**1. Overview**

4Sale New Cars is a new-car discovery platform for Kuwait. It enables users to browse, compare, and evaluate new cars sold across multiple brands and dealerships in a single destination. The goal is to become the most trusted and comprehensive starting point for anyone considering a new car purchase in Kuwait.

The platform operates as an embeddable web application -- it runs standalone at its own URL but is designed to be embedded inside the 4Sale native app or third-party dealer sites via iframe. Embedded mode is the default; standalone mode (with full navigation chrome) is activated via `?standalone=true`.

The core principle is transparency: give users all the information they need to walk into a dealership confident, not surprised.

**1.1 Technical Foundation**

-   **Framework:** Next.js (App Router) with static generation
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS v4 with inline design tokens
-   **Animation:** Framer Motion (scroll-triggered entrance animations, carousel transitions, modal enter/exit)
-   **Typography:** Sakr Pro -- a modern Arabic-ready variable font (weights 300-700)
-   **Deployment:** Vercel (static + edge)
-   **Embedded mode:** Default. `is-standalone` CSS class on `<html>` controls whether navigation chrome (Navbar, Footer, MobileTabBar) is rendered

**1.2 Design Principles**

1.  **Clarity over cleverness** -- Every element earns its place. Labels, specs, and prices are immediately scannable.
2.  **Mobile-first, always** -- Kuwait's market is heavily mobile. Touch targets, vertical flow, and contextual navigation take priority.
3.  **Trust through consistency** -- Uniform card styles, predictable navigation, and reliable embedded-mode behavior.
4.  **Data density without overwhelm** -- Progressive disclosure (Model > Trims > Variants > Full Specs) keeps pages focused.
5.  **Accessible by default** -- WCAG AA contrast ratios, keyboard navigation, reduced-motion support.

---

**2. Vehicle Taxonomy**

The entire platform is organized around a four-level vehicle hierarchy. Every browsing path, filter, comparison, and configuration flow maps to this structure.

| **Level** | **Definition** | **Example** |
|---|---|---|
| Brand | The manufacturer or marque | Mercedes-Benz |
| Model | A distinct product line within the brand, inclusive of body style. Different body styles of the same nameplate are treated as separate Models. | C-Class Sedan, C-Class Cabriolet |
| Trim | A specific engine/powertrain variant of the model | C 200 |
| Trim Variant | A factory-defined styling, performance, or equipment package that the manufacturer lists as a separately orderable SKU with its own price. This is the deepest level in the hierarchy. | C 200 AMG Line |

**2.1 Taxonomy Rules**

-   A Brand contains one or more Models.
-   A Model contains one or more Trims.
-   A Trim may have zero or more Trim Variants.
-   If a Trim has no variants, the Trim itself is the leaf-level entity.
-   Trim Variants are the deepest level. There is no further nesting.
-   Every listable vehicle maps to exactly one path: Brand > Model > Trim (> Trim Variant).
-   Different body styles of the same nameplate are separate Models (e.g., C-Class Sedan and C-Class Cabriolet are two distinct Models, each with their own Trim ladder).

**2.2 Classification Guidance**

The key distinction is between products you browse and options you configure.

| **Item** | **Classification** | **Where It Lives** | **Rationale** |
|---|---|---|---|
| C-Class Cabriolet | Separate Model | Taxonomy: Brand > Model | Different body style = different product line with its own trim ladder, pricing, and specs |
| C 200 AMG Line | Trim Variant | Taxonomy: Trim > Variant | Factory-defined package listed as a separately orderable SKU with its own base price |
| Leather Package add-on | Optional package | Informational on detail page | An add-on selected on top of a Trim Variant; not a distinct browsable product |
| Body kit accessory | Dealer accessory | Dealer page / detail page info | Aftermarket or dealer-installed; not part of manufacturer hierarchy |
| Exterior color choice | Configuration option | Detail page gallery | Cosmetic selection within a Trim/Variant; does not create a new product entry |

**The Litmus Test:** If the manufacturer lists it as a separately orderable product with its own distinct base price on their official price list, it is a Trim or Trim Variant in the taxonomy. Everything else is informational content on the detail page.

**2.3 Data Model**

The platform's TypeScript data model implements the taxonomy directly:

-   **Brand:** id, name, logoUrl, modelCount, featured flag, tagline
-   **Model:** id, brandId, name, bodyType, year, startingPrice, trimCount, isNew, isUpdated, specsSummary (engine range, HP range, fuel types), imageUrl
-   **Trim:** id, modelId, name, price, engineSummary, horsepower, torque, fuelType, images, variants, full specs, equipment list
-   **TrimVariant:** id, trimId, name, price, description, images
-   **Spec:** 25 fields covering engine, performance, fuel economy, dimensions, transmission, drive type, seating, warranty, spec region
-   **Equipment:** name, category (Safety/Comfort/Technology/Exterior/Interior), isStandard flag
-   **Branch:** id, brandId, name, location, phone, mapUrl

Supporting entities:

-   **LifestyleCollection:** id, title, description, imageUrl, modelIds (curated editorial groupings)
-   **ModelFilters:** brandIds, bodyTypes, fuelTypes, priceRange, hpRange, cylinders, transmissions, driveTypes, seatingCapacity, specRegions, isNew
-   **SortBy:** price-asc, price-desc, newest, popular, horsepower

---

**3. Platform Pages & Functionality**

**3.1 Homepage (`/`)**

The homepage provides multiple discovery entry points for users with varying intent. All sections use scroll-triggered fade-up entrance animations.

**Hero Section**
-   Full-width animated background (Ethereal Shadow effect -- animated SVG displacement filter with noise texture)
-   Headline, subtitle, and two CTAs: "Browse All Cars" (primary) and "Compare Cars" (secondary outline)
-   Stats bar: 45+ Brands, 300+ Models, Daily Updated
-   Right column (desktop only): Featured model card with image, price, and "View Details" link

**Featured Brands Strip**
-   Horizontally scrollable row of paying/featured brand cards
-   Each card: brand logo circle, name, model count, tagline, top model thumbnail, "View brand" link
-   Supports unlimited brands via scroll; last card cropped to hint scrollability
-   Brands marked with `featured: true` in the data layer

**Browse by Brand**
-   3-column (mobile) / 6-column (desktop) grid of all brand logos
-   Each card: colored logo circle, brand name, model count badge
-   "View All Brands" links to `/browse?view=brands`

**Browse by Body Type**
-   Horizontally scrollable row of body type cards: Sedan, SUV, Hatchback, Coupe, Pickup, Van, Convertible
-   Each card: SVG body type icon, type name, model count
-   Right side cropped to create scroll hint
-   Links to `/browse?body={type}`

**Popular Models**
-   Horizontally scrollable carousel of the top 8 models as ModelCards
-   Desktop scroll arrows (left/right), mobile touch-swipe with snap points
-   Each card supports "Add to Compare" action
-   "View All" links to `/browse`

**Browse by Budget**
-   Dark navy full-width section
-   Toggle between Total Price and Monthly installment views
-   Dual range slider (3,000 - 80,000 KWD)
-   Live price display updates as sliders move
-   "Show Results" CTA links to `/browse?minPrice={n}&maxPrice={n}`

**What's New**
-   Horizontally scrollable carousel of models flagged as `isNew` or `isUpdated`
-   Same layout pattern as Popular Models (scroll arrows, snap, compare action)
-   "See All" links to `/browse?sort=newest`

**Explore by Lifestyle**
-   Asymmetric grid layout: first collection card spans 2 rows on desktop (hero), remaining 3 stack beside it
-   Four curated collections: Family-Friendly SUVs, Performance & Sport, Luxury Daily Drivers, First-Car Picks Under 8,000 KWD
-   Each card: dark tinted background with category label, large ghost car-count number, collection title, description, "Browse Collection" link
-   Distinct color themes per collection (navy, deep red, slate, emerald)

**3.2 Browse Page (`/browse`)**

The primary catalog page. Supports deep filtering, multiple view modes, and bulk comparison selection.

**Entry via Query Parameters**
-   `?brand={id}` -- Pre-filters to a specific brand and shows a brand hero
-   `?body={type}` -- Pre-filters to a body type
-   `?collection={id}` -- Pre-filters to a lifestyle collection
-   `?minPrice={n}&maxPrice={n}` -- Pre-sets price range
-   `?sort={sortBy}` -- Pre-sets sort order
-   `?view=brands` -- Shows brands grid view

**Brand Hero (when `?brand` is set)**
-   Full-width auto-swipe image carousel (21:9 aspect ratio, 5-second intervals)
-   Touch-swipe support with pagination dots
-   Brand logo circle + brand name overlay with gradient backdrop

**Filter System**
-   Desktop: Sticky sidebar panel (scrollable, hover-reveal scrollbar)
-   Mobile: Bottom sheet modal with full filter panel, drag-to-dismiss
-   All filters update results in real time

| **Filter** | **Type** | **Notes** |
|---|---|---|
| Price range | Dual range slider | 3,000 - 80,000 KWD |
| Body type | Multi-select chips | Pre-selected if entered via body type |
| Fuel type | Multi-select chips | Petrol, Diesel, Hybrid, PHEV, Electric |
| Horsepower | Range slider | |
| Transmission | Multi-select | Automatic, Manual, CVT |
| Drive type | Multi-select | FWD, RWD, AWD, 4WD |
| Seating capacity | Multi-select | 2, 5, 7, 8+ |
| Spec region | Multi-select | GCC, US, European |
| Brand | Multi-select | Hidden when browsing within a brand |

Active filters display as removable chips above results with a "Clear All" button.

**Sort Options:** Price Low-High, Price High-Low, Newest First, Most Popular, Horsepower

**View Modes**
-   Carousel view: Animated spring-based card transitions
-   Grid view: Standard responsive grid layout

**Selection Mode**
-   Users can select up to 4 models for comparison
-   Sticky selection bar appears (desktop bottom bar / mobile collapsible tray)
-   "Compare Selected" button navigates to `/compare?ids={...}`

**Pagination:** 12 models per page, "Load More" button

**3.3 Search Page (`/search`)**

-   Live search input (minimum 2 characters to trigger results)
-   Full-text search across brand names, model names, and body types
-   Empty state shows: Recent Searches, Popular Brands grid, Popular Right Now (new/updated models)
-   Results: Compact list layout on mobile, 3-column grid on desktop
-   Result count displayed

**3.4 Model Detail Page (`/model/[id]`)**

The core of the experience. Statically generated for all models via `generateStaticParams`. This is where a user transitions from browsing to evaluating.

**Breadcrumb Navigation** (desktop): Home > Brand > Model

**Hero Gallery**
-   Full-width swipable image carousel (21:9 aspect ratio)
-   Auto-swipe every 5 seconds, touch-swipe support
-   No arrow navigation -- swipe-only for clean aesthetic
-   Pagination dots

**Model Overview**
-   Brand name, Model name, year, body type badge
-   Starting-from price (updates dynamically when a Trim is selected)
-   Engine range, HP range summary
-   Trim count indicator
-   Desktop: Two stacked CTAs -- "I'm Interested" (primary blue) and "Visit Brand Website" (outline with ExternalLink icon)
-   Mobile: CTAs stack vertically

**Trim Selector**
-   Section title "Trims" with "View All Trims" link (navigates to `/model/[id]/trims`)
-   Horizontal scrollable row of Trim cards
-   Each Trim card: name, price, engine summary, fuel type badge
-   Selecting a Trim updates all downstream content (specs, equipment, pricing, gallery)

**Variant Selector** (appears when selected Trim has variants)
-   Horizontal row of variant pills/chips
-   Each variant shows name and price
-   Selecting a variant shows an inline image preview strip (thumbnails with AnimatePresence transition)
-   Variant images field (`images?: string[]`) supports per-variant visual differentiation

**Key Specs Panel**
-   Scannable grid organized into groups:
    -   Engine: type, displacement, cylinders
    -   Power: horsepower, torque
    -   Performance: 0-100 km/h, top speed
    -   Fuel economy: city, highway, combined (L/100km)
    -   Transmission and drive type
    -   Dimensions: length, width, height, wheelbase, trunk volume
    -   Weight: curb weight
    -   Fuel tank capacity
    -   Seating capacity
    -   Warranty terms
    -   Spec region (GCC/US/European)

**Equipment**
-   Key Equipment: Top 10 highlights displayed as a quick-scan grid
-   Full Equipment: Tabbed by category (Safety, Comfort, Technology, Exterior, Interior)
-   Each item shows standard (included) or optional status

**Compare All Trims Table**
-   Full horizontal comparison table of all trims for this model
-   Column headers: Trim names (non-clickable, uniform styling -- not selectable)
-   Rows: key specs side by side
-   Desktop: full-width table; Mobile: horizontally scrollable table
-   Hover-reveal scrollbar

**Similar Models**
-   Horizontal carousel of models with the same body type from other brands
-   Each as a ModelCard with compare action

**Dealer / Branch Section** (`#branches-section`)
-   List of authorized dealer branches for this brand
-   Each branch: name, location, phone number, map link
-   "Contact Dealership" CTA scrolls to this section

**Pricing Breakdown**
-   Base price of selected Trim/Variant
-   Monthly installment calculator (adjustable tenure and down payment)

**Mobile Sticky Footer**
-   Fixed bottom bar (visible on mobile only)
-   Left: "Starting from" price in amber
-   Right: Three icon-only CTA buttons side by side:
    -   Navy circle: Visit Brand Website (ExternalLink icon)
    -   Blue circle: I'm Interested (Send icon, opens lead modal)
    -   Green circle: Call Dealership (Phone icon, tap-to-call)
-   Embedded-mode aware positioning (adjusts for native app chrome vs standalone browser)

**3.5 All Trims Page (`/model/[id]/trims`)**

-   Page title: "{Brand} {Model} -- All Trims"
-   Breadcrumb navigation
-   Animated card grid of all trims for the model
-   Per trim card: image, name, price, key specs (HP, torque, 0-100, fuel economy)
-   Variant chips (clickable, link back to model detail with trim+variant context)
-   "View Details" and "Compare" buttons per card

**3.6 Comparison Page (`/compare`)**

**Empty State**
-   "How it works" guide (3 steps)
-   Popular Comparisons cards (pre-built comparison suggestions)
-   Skeleton preview of what the comparison table looks like

**Loaded State** (2-4 vehicles selected)
-   Large horizontally scrollable comparison table
-   Sticky left column (spec row labels)
-   Per vehicle column: image, brand, model, trim name, price, remove button
-   Optional "Add Vehicle" column (dashed border) if fewer than 4 selected
-   Spec sections: Overview, Engine & Performance, Dimensions & Capacity, Fuel Economy, Equipment Highlights (10 key features), Pricing
-   Equipment row indicators: Standard (green check), Optional (amber label), Not available (red minus)
-   "Highlight Differences" toggle: amber highlight on cells where values differ
-   "Share Comparison" button: copies URL to clipboard with vehicle IDs encoded
-   Per-vehicle CTAs: "I'm Interested" and "Visit Brand Website"
-   Supports entry via `?ids={modelId},{modelId}` or `?trims={trimId},{trimId}`

**3.7 Brand Page (`/brand/[id]`)**

Renders as `/browse?brand={id}` -- the browse page with brand-specific hero carousel, brand logo overlay, and pre-filtered model results.

---

**4. Shared Components**

**Navigation**
-   **Navbar** (standalone mode): Sticky header with logo, search bar, compare badge, saved/user icons. Mobile: hamburger menu with dropdown.
-   **MobileTabBar** (standalone mode): Fixed bottom tab bar -- Home, Search, Compare, Saved, Account. Compare tab shows item count badge.
-   **Footer** (standalone mode): Site-wide footer.
-   All navigation chrome hidden in embedded mode via CSS `html:not(.is-standalone)` selectors.

**ModelCard**
-   Reusable card component used across Homepage, Browse, Search, and Similar Models
-   Contents: image with New/Updated badge, brand name, model name, body type tag, starting price (KWD), engine range, HP range, fuel type, trim count, compare button, save button
-   Hover: gentle lift animation with shadow

**ComparisonTray**
-   Persistent floating element showing selected comparison items
-   Desktop: Fixed bottom bar with thumbnails, count, Clear/Compare buttons
-   Mobile: Collapsible tray that slides up from tab bar area
-   Compare button disabled until 2+ items selected

**LeadFormModal** ("I'm Interested")
-   Desktop: Centered modal overlay
-   Mobile: Bottom sheet
-   Form fields:
    -   Full Name (required)
    -   Phone Number (required)
    -   Email Address (optional)
    -   Preferred Contact Method: Call / WhatsApp / Email (required, chip-select)
    -   Preferred Time: Morning / Afternoon / Evening / Anytime (optional)
    -   Notes (optional free text)
-   Auto-captured context: Brand, Model, Trim, Variant the user was viewing
-   Vehicle context card displayed in the form header
-   Success state: CheckCircle confirmation with close button

**EmbedLink**
-   Next.js Link wrapper that auto-appends `?embedded=true` when in embedded mode
-   Ensures navigation stays within embedded context

**PlaceholderImage**
-   Generic image placeholder with configurable aspect ratio and body type icon
-   Used throughout as car image placeholders (to be replaced with real photography)

**BodyTypeIcon**
-   SVG icon renderer for all 7 body types
-   Used in filters, body type browsing, and cards

**FilterPanel**
-   Reusable filter UI used on browse page (desktop sidebar + mobile sheet)
-   Collapsible sections with ChevronDown animation
-   ChipGroup for multi-select, RangeSlider for ranges
-   Active filter chips with individual remove + "Clear All"

---

**5. Calls to Action & Conversion**

The platform is not a transactional e-commerce site. Its role is to inform users and connect them with brands and dealers. Every conversion path is anchored to a specific Trim or Trim Variant.

There are exactly three CTAs:

**5.1 Visit Brand Website**

Redirects the user to the official brand or model page on the manufacturer's website. Opens in a new tab.

-   **Where:** Model detail hero, model detail sticky footer (navy icon), comparison view
-   **Behavior:** Deep-linked where possible to the specific Trim/Variant page

**5.2 I'm Interested (Lead Generation)**

Opens the LeadFormModal for the user to submit contact details expressing interest in a specific vehicle.

-   **Where:** Model detail hero, model detail sticky footer (blue icon), comparison view
-   **Form:** See LeadFormModal component description above
-   **Lead routing:** Submitted leads route to the relevant authorized dealer(s) or brand's local sales team

**5.3 Contact Dealership**

Direct contact with the authorized dealer -- for users who want to initiate contact immediately.

-   **Phone:** Tap-to-call button (model detail sticky footer, green icon; branch section)
-   **Location:** Map link in branch cards

**CTA Placement Summary**

| **CTA** | **Model Detail** | **Comparison** | **Mobile Sticky Footer** |
|---|---|---|---|
| Visit Brand Website | Hero section | Per vehicle column | Navy icon button |
| I'm Interested | Hero section | Per vehicle column | Blue icon button (opens modal) |
| Contact Dealership | Branch section | -- | Green icon button (tap-to-call) |

---

**6. Monetization: Featured Brands**

Paying brands can be highlighted on the homepage through the Featured Brands strip.

-   Brands are marked with `featured: true` and an optional `tagline` in the data layer
-   Featured brands appear in a dedicated scrollable section above "Browse by Brand"
-   Cards show: brand logo, name, model count, tagline, top model thumbnail
-   The strip is horizontally scrollable and supports unlimited featured brands
-   Non-featured brands still appear in the standard "Browse by Brand" grid

---

**7. Embedded Mode**

The platform is designed primarily for embedding inside the 4Sale native app.

-   **Default state:** Embedded (no Navbar, no Footer, no MobileTabBar)
-   **Standalone activation:** Add `?standalone=true` to any URL
-   **Detection mechanism:** A script in `<head>` adds `is-standalone` class to `<html>` when the query param is present
-   **React hook:** `useIsEmbedded()` returns `true` by default, `false` when standalone
-   **CSS selectors:** `html:not(.is-standalone)` hides navigation chrome
-   **Link handling:** `EmbedLink` component preserves embedded context across navigation
-   **Mobile sticky footer:** Adjusts bottom positioning based on embedded vs standalone (accounts for native app chrome vs browser toolbar)

---

**8. Search**

The search bar is the fastest path for users who know what they want.

-   Always accessible via the Search tab (mobile) or navbar (standalone desktop)
-   Live results after 2+ characters, searching across brand names, model names, and body types
-   Empty state: Recent Searches, Popular Brands grid (all 8 brands), Popular Right Now (new/updated models)
-   Results: Compact list on mobile, 3-column grid on desktop, with result count

---

**9. Mobile Experience**

Mobile is the primary platform. Every feature is built mobile-first.

-   Bottom tab bar (standalone): Home, Search, Compare, Saved, Account
-   Swipeable image carousels and trim cards
-   Filter bottom sheets instead of sidebars
-   Comparison: horizontally scrollable table
-   Lead form: bottom sheet modal
-   Sticky price + CTA footer on model detail pages
-   Invisible scrollbars globally with hover-reveal on interactive scroll areas
-   Touch-optimized tap targets throughout

---

**10. Design System**

**Colors**
| **Token** | **Value** | **Usage** |
|---|---|---|
| Primary Blue | `#1A56DB` | CTAs, links, active states |
| Sky Blue | `#60A5FA` | Accent highlights, hero text |
| Amber | `#F59E0B` | Prices, featured callouts |
| Navy | `#0F1B2D` | Hero backgrounds, dark sections |
| Slate | `#1E293B` | Primary text |
| Secondary | `#64748B` | Secondary text, labels |
| Background | `#F8FAFC` | Page background |
| Card | `#F1F5F9` | Card backgrounds, input fields |
| Border | `#E2E8F0` | Borders, dividers |
| Success | `#10B981` | Positive states, call CTA |
| Error | `#EF4444` | Destructive actions, alerts |

**Typography:** Sakr Pro (300-700 weight range), system-ui fallback

**Spacing:** Tailwind defaults, reduced section padding (`py-8 md:py-12`)

**Border Radius:** Primarily `rounded-xl` and `rounded-2xl`

**Shadows:** Subtle elevation (`shadow-md`, `shadow-lg`) on hover states

**Scrollbars:** Globally invisible; `styled-scrollbar` class enables hover-reveal thin scrollbar on interactive scroll containers

**Animation:** Framer Motion throughout -- `fadeUp` for section entrance, `AnimatePresence` for modal/content transitions, spring physics for carousel cards

---

**11. Market Considerations (GCC / Kuwait)**

-   **GCC vs. non-GCC specs:** Vehicles sold in the Gulf differ in cooling, rust protection, and warranty. The platform labels spec origin (GCC, US, European) on every Trim.

-   **Chinese brand coverage:** Brands like Changan, Haval, MG have rapidly gained market share. The platform treats these with the same depth and quality as legacy brands (Mercedes, BMW, Toyota, Lexus, Porsche).

-   **Currency and financing:** All prices in KWD. Installment calculators reflect local bank norms.

-   **Arabic language support:** The font stack (Sakr Pro) is Arabic-ready. The layout uses `dir="auto"` on the root HTML element. Full RTL layout and Arabic content are supported.

-   **Seasonal demand patterns:** New model year launches, Ramadan promotions, and clearance events surface through the "What's New" section and Featured Brands strip.

---

**12. Success Metrics**

| **Metric** | **What It Measures** | **Target** |
|---|---|---|
| Models browsed per session | Discovery breadth | Increase |
| Trim detail page views | Depth of evaluation | Increase |
| Comparisons created | Active decision-making | Increase |
| Brand website click-throughs | Redirect conversion | Increase |
| Lead forms submitted | Lead generation volume | Increase |
| Contact Dealership taps | Direct dealer engagement | Increase |
| Return visit rate (7-day) | Stickiness during purchase journey | Increase |
| Featured brand impressions | Monetization reach | Increase |
| Time on Model detail page | Content quality and relevance | Monitor |
| Search-to-result click rate | Search relevance | Increase |

---

**13. Current Catalog (Mock Data)**

The platform currently runs on mock data representing 8 brands and 34 models across the full taxonomy:

**Brands:** Mercedes-Benz, BMW, Toyota, Lexus, Porsche, Changan, Haval, MG

**Featured Brands:** Mercedes-Benz, BMW, Toyota, Porsche (with taglines)

**Lifestyle Collections:**
1.  Family-Friendly SUVs (7 models)
2.  Performance & Sport (5 models)
3.  Luxury Daily Drivers (5 models)
4.  First-Car Picks Under 8,000 KWD (7 models)

Each model includes complete trim ladders with full specs (25 fields), equipment lists, variant definitions, and branch/dealer data.

---

**14. Roadmap: Not Yet Implemented**

The following features are defined in this brief but not yet built:

-   **User accounts:** Login, saved vehicles, saved comparisons, browsing history, "My Inquiries"
-   **Alerts & notifications:** Price drop alerts, new model launch notifications, budget-based alerts
-   **Personalized recommendations:** Cross-brand alternatives, "New arrivals in your saved brands"
-   **Editorial content:** Head-to-head comparisons, buyer's guides, first-look previews, cost of ownership estimates
-   **Dealer profiles:** Full dealer pages with ratings, reviews, operating hours, inventory indicators
-   **Lead routing backend:** CRM integration, dealer dashboard, email/webhook delivery
-   **Advanced search:** Natural language queries (e.g., "SUV under 15000"), autocomplete with trim-level suggestions
-   **Gallery features:** Filterable photo/video gallery, 360-degree views, pinch-to-zoom
-   **Offline capability:** Read-only access to saved vehicles and comparisons
-   **Real photography:** All images currently use placeholder components

---

**Appendix: Taxonomy Example**

| **Brand** | **Model** | **Trim** | **Trim Variant** |
|---|---|---|---|
| Mercedes-Benz | C-Class Sedan | C 200 | C 200 Avantgarde |
| | | | C 200 AMG Line |
| | | C 300 | C 300 AMG Line |
| | | | C 300 Exclusive |
| | | C 43 AMG | (no variant -- Trim is the leaf) |
| | C-Class Cabriolet | C 200 Cabrio | C 200 Cabrio AMG Line |
| | | C 300 Cabrio | C 300 Cabrio AMG Line |
| | GLC SUV | GLC 200 | GLC 200 AMG Line |
| | | GLC 300 | GLC 300 AMG Line |
| | | | GLC 300 Exclusive |
| | | GLC 43 AMG | (no variant) |

This structure repeats across every brand on the platform. The UI adapts whether a Trim has zero, one, or many Variants.

Optional packages, dealer accessories, and cosmetic choices do not appear in this hierarchy. They are listed as informational content on the Trim/Variant detail page but are not separate browsable entities.
