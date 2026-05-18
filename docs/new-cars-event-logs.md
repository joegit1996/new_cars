# New Cars -- Amplitude Event Logging Plan

> Based on analysis of the **4Sale (Production)** Amplitude project (ID: 251575).
> All events and properties follow the existing 4Sale naming conventions.

---

## Conventions

| Rule | Convention | Examples |
|------|-----------|----------|
| Event names | `Title Case` | `New Cars Model Visited`, `Car Trim Selected` |
| Property names | `PascalCase` | `BrandID`, `ModelName`, `TrimPrice` |
| ID properties | Suffix `ID` | `BrandID`, `ModelID`, `TrimID`, `CategoryID` |
| Name properties | Suffix `Name` | `BrandName`, `ModelName`, `TrimName` |
| Source tracking | `Source` (enum) | Where user came from before this event |
| Section tracking | `SourceSectionName`, `SourceSectionOrder`, `SourceItemOrder` | Position-based tracking |
| Booleans | `Is`-prefixed | `IsNew`, `IsFeatured`, `IsEmbedded` |
| Category | `New Cars` | All events belong to this Amplitude category |

---

## Global Properties (send on ALL New Cars events)

| Property | Type | Description |
|----------|------|-------------|
| `Vertical` | string | Always `"New Cars"` -- aligns with existing vertical tracking across 4Sale |
| `Source` | enum | Where the user came from (context-specific values per event) |
| `IsEmbedded` | boolean | Whether the experience is embedded in 4Sale app vs standalone web |
| `Language` | string | `"en"` or `"ar"` -- user's active language |

---

## Part 1: Enrich Existing Events

These 5 events already exist in the `New Cars` category. Add the listed properties to each.

### 1.1 `Car Trim Selected`

**Current properties:** `TrimID`, `TrimName`

| Add Property | Type | Description |
|-------------|------|-------------|
| `ModelID` | number | Backend model ID |
| `ModelName` | string | e.g. "C 200" |
| `BrandID` | number | Backend brand ID |
| `BrandName` | string | e.g. "Mercedes-Benz" |
| `ModelYear` | number | e.g. 2026 |
| `TrimPrice` | number | Starting price in KWD |
| `BodyStyleCode` | string | e.g. "sedan", "suv" |
| `Source` | enum | Where user came from |

### 1.2 `Car Trim Color Selected`

**Current properties:** `TrimID`, `TrimName`, `ColorName`

| Add Property | Type | Description |
|-------------|------|-------------|
| `ModelID` | number | Backend model ID |
| `ModelName` | string | Model name |
| `BrandName` | string | Brand name |
| `TrimPrice` | number | Trim price in KWD |

### 1.3 `Car Comparison Entry Viewed`

**Current properties:** (no car-specific properties)

| Add Property | Type | Description |
|-------------|------|-------------|
| `Source` | enum | Where user entered comparison from |
| `ComparedTrimsCount` | number | Number of trims being compared |
| `ComparedTrimIDs` | number[] | Array of trim IDs |
| `ComparedBrandNames` | string[] | Array of brand names being compared |

### 1.4 `Car Comparison Results Viewed`

**Current properties:** (no car-specific properties)

| Add Property | Type | Description |
|-------------|------|-------------|
| `ComparedTrimsCount` | number | Number of trims compared |
| `ComparedTrimIDs` | number[] | Array of trim IDs |
| `ComparedTrimNames` | string[] | Array of trim display names |
| `ComparedBrandNames` | string[] | Array of brand names |
| `ComparedModelNames` | string[] | Array of model names |

### 1.5 `Listing Details Trims Swiped`

**Current properties:** `ListingID`, `ListingTitle` + standard listing properties

| Add Property | Type | Description |
|-------------|------|-------------|
| `TrimID` | number | The trim being swiped to |
| `TrimName` | string | Trim display name |
| `TrimIndex` | number | Position in the trims carousel |
| `TotalTrimsCount` | number | Total trims available for this model |

---

## Part 2: New Events

### 2.1 Home and Navigation

#### `New Cars Home Visited`
User lands on the new cars home page.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `Source` | enum | Yes | `"4Sale App"`, `"Deep Link"`, `"Direct Link"`, `"Nav Bar"` |
| `FeaturedBrandsCount` | number | No | Number of featured brands displayed |
| `WhatsNewCount` | number | No | Number of "what's new" items displayed |
| `FeaturedModelsCount` | number | No | Number of featured models displayed |

#### `New Cars Home Section Viewed`
A section on the home page scrolls into the viewport.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `SectionName` | enum | Yes | `"Featured Brands"`, `"What's New"`, `"Featured Models"`, `"Popular Models"` |
| `SectionOrder` | number | Yes | Vertical order of the section on the page |
| `TotalItemsCount` | number | No | Number of items in the section |

#### `New Cars Home Section Clicked`
User taps a card within a home page section.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `SectionName` | enum | Yes | Which section the card belongs to |
| `SectionOrder` | number | Yes | Section position on page |
| `ItemOrder` | number | Yes | Card position within the section |
| `BrandID` | number | No | Brand ID (if applicable) |
| `BrandName` | string | No | Brand name (if applicable) |
| `ModelID` | number | No | Model ID (if applicable) |
| `ModelName` | string | No | Model name (if applicable) |

---

### 2.2 Browse and Filtering

#### `New Cars Browse Visited`
User opens the browse / all-models page.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `Source` | enum | Yes | `"New Cars Home"`, `"Nav Bar"`, `"Search Results"`, `"Brand Page"`, `"Deep Link"` |
| `TotalModelsCount` | number | No | Total models available in browse |

#### `New Cars Browse Filtered`
User applies filters on the browse page.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `FiltersCount` | number | Yes | Total number of active filters |
| `FiltersNames` | string[] | Yes | Names of active filters |
| `BrandName` | string | No | Brand filter value (if applied) |
| `BodyStyleCode` | string | No | Body style filter value (if applied) |
| `PriceMin` | number | No | Minimum price filter (if applied) |
| `PriceMax` | number | No | Maximum price filter (if applied) |
| `FuelType` | string | No | Fuel type filter (if applied) |
| `ModelYear` | number | No | Model year filter (if applied) |
| `ResultsCount` | number | Yes | Number of models matching filters |

#### `New Cars Browse Sorted`
User changes the sort order on browse.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `SortBy` | enum | Yes | `"price-asc"`, `"price-desc"`, `"newest"`, `"popular"`, `"horsepower"` |
| `ResultsCount` | number | No | Number of models in the current view |

#### `New Cars Browse Scrolled`
User scrolls through browse results (fire at thresholds: 25%, 50%, 75%, 100%).

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `ScrollDepth` | number | Yes | Percentage of page scrolled (25, 50, 75, 100) |
| `VisibleModelsCount` | number | No | Number of models loaded so far |
| `TotalModelsCount` | number | No | Total models available |

---

### 2.3 Search

#### `New Cars Search Performed`
User submits a search query.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `SearchKeyword` | string | Yes | The search query text |
| `SearchKeywordCharCount` | number | No | Character count of the query |
| `ResultsCount` | number | Yes | Number of results returned |
| `Source` | enum | No | `"New Cars Home"`, `"Browse Page"`, `"Nav Bar"` |

#### `New Cars Search Suggestion Clicked`
User taps an autocomplete suggestion.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `SearchKeyword` | string | Yes | What the user typed so far |
| `SuggestionText` | string | Yes | The suggestion text that was tapped |
| `SuggestionOrder` | number | Yes | Position of the suggestion in the list |
| `TotalSuggestionsCount` | number | No | Total suggestions shown |

#### `New Cars Search Result Clicked`
User taps a model from search results.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `SearchKeyword` | string | Yes | The search query |
| `ModelID` | number | Yes | Model that was clicked |
| `ModelName` | string | Yes | Model name |
| `BrandName` | string | Yes | Brand name |
| `ResultOrder` | number | Yes | Position in the results list |
| `TotalResultsCount` | number | No | Total results for this query |

---

### 2.4 Brand Pages

#### `New Cars Brand Visited`
User opens a brand showcase page.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `BrandID` | number | Yes | Backend brand ID |
| `BrandName` | string | Yes | Brand name |
| `Source` | enum | Yes | `"New Cars Home"`, `"Browse Filters"`, `"Model Details"`, `"Deep Link"` |
| `ModelCount` | number | No | Number of models for this brand |
| `HasHeroVideo` | boolean | No | Whether the brand has a hero video |

#### `New Cars Brand Model Clicked`
User taps a model on the brand page.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `BrandID` | number | Yes | Brand ID |
| `BrandName` | string | Yes | Brand name |
| `ModelID` | number | Yes | Model ID |
| `ModelName` | string | Yes | Model name |
| `ModelOrder` | number | No | Position in the model lineup |
| `SectionName` | enum | No | `"Model Lineup"`, `"Featured"` |

#### `New Cars Brand Editorial Scrolled`
User scrolls through brand editorial content (fire per section reached).

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `BrandID` | number | Yes | Brand ID |
| `BrandName` | string | Yes | Brand name |
| `ScrollDepth` | number | No | Percentage scrolled |
| `SectionReached` | enum | Yes | `"Hero"`, `"Story"`, `"Heritage"`, `"Innovation"`, `"Sustainability"` |

---

### 2.5 Model Details

#### `New Cars Model Visited`
User opens a model detail page.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `ModelID` | number | Yes | Backend model ID |
| `ModelName` | string | Yes | Model name |
| `BrandID` | number | Yes | Brand ID |
| `BrandName` | string | Yes | Brand name |
| `ModelYear` | number | Yes | Model year |
| `StartingPrice` | number | Yes | Starting price in KWD |
| `BodyStyleCode` | string | Yes | e.g. "sedan", "suv", "coupe" |
| `TrimCount` | number | No | Number of trims available |
| `IsNew` | boolean | No | Whether the model is new |
| `IsUpdated` | boolean | No | Whether the model is recently updated |
| `Source` | enum | Yes | `"New Cars Home"`, `"Browse Page"`, `"Brand Page"`, `"Search Results"`, `"Comparison"`, `"Deep Link"` |

#### `New Cars Model Scrolled`
User scrolls the model detail page (fire per section reached).

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `ModelID` | number | Yes | Model ID |
| `ModelName` | string | Yes | Model name |
| `BrandName` | string | No | Brand name |
| `ScrollDepth` | number | No | Percentage scrolled |
| `SectionReached` | enum | Yes | `"Hero"`, `"Specs Summary"`, `"Trims"`, `"Gallery"` |

#### `New Cars Model Gallery Opened`
User opens the full-screen image gallery.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `ModelID` | number | Yes | Model ID |
| `ModelName` | string | Yes | Model name |
| `BrandName` | string | No | Brand name |
| `ImagesCount` | number | Yes | Total images in the gallery |

#### `New Cars Model Gallery Swiped`
User swipes through gallery images.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `ModelID` | number | Yes | Model ID |
| `ModelName` | string | Yes | Model name |
| `ImageOrder` | number | Yes | Current image position (1-based) |
| `ImagesCount` | number | Yes | Total images in gallery |

#### `New Cars Model Share Clicked`
User taps share on a model.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `ModelID` | number | Yes | Model ID |
| `ModelName` | string | Yes | Model name |
| `BrandName` | string | Yes | Brand name |
| `ShareMethod` | enum | No | `"Copy Link"`, `"WhatsApp"`, `"Native Share"` |

---

### 2.6 Trim Details

#### `New Cars Trim Visited`
User opens a trim detail / specs page.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `TrimID` | number | Yes | Trim ID |
| `TrimName` | string | Yes | Trim display name |
| `ModelID` | number | Yes | Model ID |
| `ModelName` | string | Yes | Model name |
| `BrandName` | string | Yes | Brand name |
| `TrimPrice` | number | Yes | Trim price in KWD |
| `Source` | enum | Yes | `"Model Details"`, `"Comparison"`, `"Browse Page"` |

#### `New Cars Trim Specs Expanded`
User expands a specs section on the trim page.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `TrimID` | number | Yes | Trim ID |
| `TrimName` | string | Yes | Trim display name |
| `ModelName` | string | No | Model name |
| `SpecsSection` | enum | Yes | `"Performance"`, `"Dimensions"`, `"Fuel Economy"`, `"Equipment"` |

#### `New Cars Trim Equipment Viewed`
User views the equipment list for a trim.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `TrimID` | number | Yes | Trim ID |
| `TrimName` | string | Yes | Trim display name |
| `ModelName` | string | No | Model name |
| `EquipmentCategory` | enum | Yes | `"Safety"`, `"Comfort"`, `"Technology"` |
| `ItemsCount` | number | No | Number of equipment items in the category |

---

### 2.7 Comparison

#### `New Cars Compare Add Clicked`
User adds a trim to the comparison tray.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `TrimID` | number | Yes | Trim being added |
| `TrimName` | string | Yes | Trim display name |
| `ModelName` | string | Yes | Model name |
| `BrandName` | string | Yes | Brand name |
| `TrimPrice` | number | No | Trim price in KWD |
| `ComparedTrimsCount` | number | Yes | Total trims in comparison after adding |
| `Source` | enum | No | `"Model Details"`, `"Browse Page"`, `"Trim Details"` |

#### `New Cars Compare Remove Clicked`
User removes a trim from comparison.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `TrimID` | number | Yes | Trim being removed |
| `TrimName` | string | Yes | Trim display name |
| `ComparedTrimsCount` | number | Yes | Total trims remaining after removal |

#### `New Cars Compare Visited`
User opens the full comparison page.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `ComparedTrimsCount` | number | Yes | Number of trims being compared |
| `ComparedTrimIDs` | number[] | Yes | Array of trim IDs |
| `ComparedBrandNames` | string[] | No | Array of brand names |
| `ComparedModelNames` | string[] | No | Array of model names |

#### `New Cars Compare Scrolled`
User scrolls the comparison table.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `ScrollDepth` | number | No | Percentage scrolled |
| `SectionReached` | enum | Yes | `"Overview"`, `"Performance"`, `"Dimensions"`, `"Equipment"` |

---

### 2.8 Lead Generation

#### `New Cars Lead Form Viewed`
The lead / interest form is displayed to the user.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `TrimID` | number | No | Trim ID (if from trim context) |
| `TrimName` | string | No | Trim display name |
| `ModelID` | number | Yes | Model ID |
| `ModelName` | string | Yes | Model name |
| `BrandID` | number | Yes | Brand ID |
| `BrandName` | string | Yes | Brand name |
| `TrimPrice` | number | No | Trim price in KWD |
| `Source` | enum | Yes | `"Model Details"`, `"Trim Details"`, `"Comparison"` |

#### `New Cars Lead Form Submitted`
User submits the interest / lead form.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `TrimID` | number | No | Trim ID |
| `TrimName` | string | No | Trim display name |
| `ModelID` | number | Yes | Model ID |
| `ModelName` | string | Yes | Model name |
| `BrandID` | number | Yes | Brand ID |
| `BrandName` | string | Yes | Brand name |
| `TrimPrice` | number | No | Trim price in KWD |

#### `New Cars Dealer Call Clicked`
User taps to call a dealer.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `BrandID` | number | Yes | Brand ID |
| `BrandName` | string | Yes | Brand name |
| `DealerName` | string | Yes | Dealer / branch name |
| `Source` | enum | No | `"Brand Page"`, `"Model Details"` |

#### `New Cars Dealer Directions Clicked`
User taps for dealer map directions.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `BrandID` | number | Yes | Brand ID |
| `BrandName` | string | Yes | Brand name |
| `DealerName` | string | Yes | Dealer / branch name |

---

## Summary

| Category | Existing (Enrich) | New Events |
|----------|-------------------|------------|
| Existing events | 5 | -- |
| Home and Navigation | -- | 3 |
| Browse and Filtering | -- | 4 |
| Search | -- | 3 |
| Brand Pages | -- | 3 |
| Model Details | -- | 5 |
| Trim Details | -- | 3 |
| Comparison | -- | 4 |
| Lead Generation | -- | 4 |
| **Total** | **5 enriched** | **29 new** |
