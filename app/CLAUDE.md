@AGENTS.md

## Design Context

### Users
Car buyers in Kuwait researching and comparing new vehicles. They arrive via the main site or embedded iframes (dealer sites, apps). Their job: quickly find, compare, and shortlist cars by brand, model, trim, and specs -- then make a confident purchase decision. They expect a fast, trustworthy experience that respects their time.

### Brand Personality
**Trustworthy -- Modern -- Clear**

The interface should feel authoritative without being cold. Information density is high (specs, prices, trims), so clarity wins over decoration. Users should feel confident that the data is accurate and the experience is polished.

Emotional goals: confidence, calm control, ease of decision-making.

### Aesthetic Direction
- **Visual tone**: Clean, structured, professional. Generous whitespace. Card-based layouts with subtle shadows and rounded corners (2xl radius).
- **References**: Carwow (editorial clarity, comparison UX), CarGurus (data density done right, trust signals).
- **Anti-references**: Cluttered classifieds, aggressive dealer sites, dark patterns.
- **Theme**: Light mode. Neutral base (`#F8FAFC` bg, `#1E293B` text) with blue primary (`#1A56DB`) and amber accent (`#F59E0B`).
- **Typography**: "Sakr Pro" -- a modern Arabic-ready variable font (weights 300-700). Clean, highly legible at small sizes.
- **Motion**: Framer Motion for subtle entrance animations. Keep it functional, not flashy.

### Design Principles
1. **Clarity over cleverness** -- Every element earns its place. Labels, specs, and prices are immediately scannable. No jargon.
2. **Mobile-first, always** -- Kuwait's market is heavily mobile. Touch targets, vertical flow, and contextual back-navigation take priority over desktop breadcrumbs.
3. **Trust through consistency** -- Uniform card styles, predictable navigation, and reliable embedded-mode behavior build user confidence.
4. **Data density without overwhelm** -- Show the right specs at the right time. Progressive disclosure (model -> trims -> variants -> full specs) keeps pages focused.
5. **Accessible by default** -- WCAG AA contrast ratios, keyboard navigation, reduced-motion support. Design for everyone.
