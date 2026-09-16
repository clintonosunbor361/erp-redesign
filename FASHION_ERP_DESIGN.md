# DESIGN.md

# Fashion ERP Design System

## 1. Design Direction

The ERP should feel:

- Clean
- Premium
- Spacious
- Modern
- Operational
- Suitable for a fashion brand

Use a **faint blue sidebar**, a **white workspace**, and **sky blue as the main accent colour**.

Avoid:

- Gradients
- Heavy shadows
- Too many colours
- Overly rounded components
- Decorative clutter

---

## 2. Typography

Use **Manrope** as the primary font.

### Type Scale

- Page title: `28px / 600`
- Section title: `18px / 600`
- Card title: `14px / 500`
- KPI value: `32px / 600`
- Body text: `14px / 400`
- Table text: `13px / 400`
- Small/helper text: `12px / 400`
- Buttons: `14px / 500`

Use line-height around `1.4–1.5` for normal text.

Keep typography soft, premium, and easy to scan.

---

## 3. Colour Palette

### Core Colours

- Sidebar background: `#EFF6FF`
- Sidebar hover: `#EAF4FF`
- Sidebar active item: `#DBEAFE`
- Primary sky blue: `#38BDF8`
- Primary hover/active blue: `#0EA5E9`
- Active sidebar text/icon: `#0284C7`
- Workspace background: `#FFFFFF`
- Secondary surface: `#F8FAFC`
- Primary text: `#111827`
- Secondary text: `#64748B`
- Placeholder text: `#94A3B8`
- Border: `#E2E8F0`

### Status Colours

- Success: `#22C55E`
- Warning: `#F59E0B`
- Error: `#EF4444`

Use soft tinted backgrounds for statuses instead of saturated fills.

---

## 4. Spacing and Sizing

Use this spacing scale:

- `8px`
- `12px`
- `16px`
- `24px`
- `32px`

### Main Measurements

- Page padding: `32px`
- Card padding: `20–24px`
- Gap between cards: `16–20px`
- Section spacing: `24–32px`
- Sidebar width: `240px`
- Collapsed sidebar width: `72px`
- Card radius: `16px`
- Button/input radius: `10–12px`
- Button height: `40px`
- Input height: `40px`
- Table row height: around `48px`
- Border width: `1px`

---

## 5. App Shell

### Sidebar

- Use a faint blue sidebar: `#EFF6FF`
- Expanded width: `240px`
- Collapsed width: `72px`
- Use icon + label navigation when expanded
- Use icon-only navigation when collapsed
- Show tooltips when collapsed
- Keep active navigation clearly highlighted
- Keep section labels small and muted
- Use smooth collapse/expand transitions
- Main workspace should expand automatically when sidebar collapses

### Main Workspace

- Use a white workspace
- Keep page padding at `32px`
- Maintain consistent spacing and alignment
- Avoid unnecessary nested cards

---

## 6. Buttons

### Primary Button

- Sky blue fill
- White text
- Height: `40px`
- Radius: `10–12px`
- Horizontal padding: `16px`
- Icon/text gap: `8px`

### Secondary Button

- White fill
- Thin grey border
- Dark text
- Same height and radius as primary

### Destructive Button

- Use red or soft red styling
- Keep visually secondary unless the action is the main focus

### States

Define:

- Default
- Hover
- Pressed
- Disabled

Hover should slightly darken the sky blue. Do not add heavy shadows.

---

## 7. Inputs, Search and Dropdowns

### Inputs

- Height: `40px`
- Radius: `10–12px`
- White background
- Border: `#E2E8F0`
- Primary text: `#111827`
- Placeholder: `#94A3B8`
- Focus: subtle sky-blue border/ring
- Labels sit above fields

### Search

- Same visual style as inputs
- Use a search icon inside the field
- Placeholder should explain what can be searched
- No heavy shadow

### Dropdowns

- Same height and radius as inputs
- Use a small chevron icon
- Use normal dropdowns for short lists
- Use searchable selects for long lists such as customers
- Selected items may use a faint blue highlight

### States

Define:

- Default
- Hover
- Focus
- Disabled
- Error

---

## 8. Status Pills / Badges

Use compact status pills for operational states.

Examples:

- Completed → soft green background + green text
- Pending → soft amber background + amber text
- In Production → soft sky-blue background + blue text
- Cancelled / Failed → soft red background + red text
- Draft / Inactive → light grey background + grey text

### Sizing

- Height: `24–28px`
- Horizontal padding: `10–12px`
- Full pill radius
- Font: `12–13px / 500`

Use status colours for meaning, not decoration.

---

## 9. KPI Cards

### Card Style

- White background
- Thin border: `#E2E8F0`
- Radius: `16px`
- Padding: `20–24px`
- No heavy shadow
- Equal height and spacing

### Content

Each KPI card should contain:

- KPI label
- Main value
- Trend percentage
- Comparison text, e.g. `vs last month`
- Optional sparkline or progress visual

Do **not** use icons in KPI cards.

### Typography

- Label: `14px / 500`
- Main value: `32px / 600`
- Trend: `12–13px / 500`

### Interaction

- Hover: subtle pale-blue tint
- Selected: slightly stronger border or tint
- Clicking a KPI card may update the main chart

---

## 10. Tables / Data Grids

Use a clean enterprise-style table.

### Table Style

- White surface
- Thin border: `#E2E8F0`
- Radius: `16px`
- Row height: around `48px`
- Table text: `13–14px`
- Clear column alignment
- Subtle row dividers
- Use status pills where needed
- Keep row actions inside a `...` menu where possible

### Zebra Striping

Use very subtle zebra striping:

- Row A: `#FFFFFF`
- Row B: `#F8FAFC`

Hover can use a slightly stronger pale-blue tint.

### Suggested Order Table Structure

`Client | Order ID | Items | Amount Paid | Status | Date | Actions`

### Table Toolbar

Keep it simple:

- Search
- One or two useful filters
- Export when needed

Do not add controls that do not solve a real user need.

---

## 11. Standard Cards / Panels

Use for:

- charts
- tables
- summaries
- grouped information
- lists

### Style

- Background: `#FFFFFF`
- Border: `1px #E2E8F0`
- Radius: `16px`
- Padding: `20–24px`
- Shadow: none or extremely subtle

### Card Header

- Title: `16–18px / 600`
- Optional muted helper text
- Optional action on the top-right

Use spacing and borders before shadows.

---

## 12. Charts

### General Style

- Place charts inside white cards
- Border: `1px #E2E8F0`
- Radius: `16px`
- Padding: `20–24px`
- No heavy shadow

### Colours

- Main series: sky blue
- Secondary series: muted blue/grey
- Positive/profit highlight: green where useful
- Warning/negative: amber/red only when needed

### Chart Style

- Very subtle grid lines
- Rounded bars
- Smooth line charts where appropriate
- Minimal axis labels
- Clear hover tooltips
- Highlight active data points or bars
- Avoid too many data colours

### Chart Rules

- Trend over time → line chart
- Category comparison → bar chart
- Ranking → horizontal bar chart
- Part-to-whole → donut chart

### Donut Chart

- Use rounded segment ends
- Keep segment spacing subtle
- Use sky blue as the main accent
- Use restrained supporting colours
- Prefer `3–5` segments
- Keep labels minimal
- Use hover tooltips for exact values
- Optional total/key metric in the center

---

## 13. Tabs

Use tabs for switching between related views.

Example:

`All | New | In Production | Completed | Archived`

### Style

- Font: `13–14px / 500`
- Active tab: sky-blue text with subtle underline or pale-blue background
- Inactive tabs: muted grey
- Even spacing
- Avoid heavy pill styling unless it is a small segmented control

---

## 14. Filters

Keep filters compact and close to the content they affect.

Use:

- Dropdown filters
- Search
- Date filters
- Optional `More Filters` when needed

### Style

- Height: `40px`
- Radius: `10–12px`
- White background
- Thin grey border
- Sky-blue focus/selected state

### Page Hierarchy

For list-heavy pages:

1. Header row = page title + primary action
2. Second row = tabs
3. Third row = search + filters
4. Then main table/list

---

## 15. Modals

Use modals for short, focused actions such as:

- confirmation
- delete
- add note
- quick status change

### Style

- White surface
- Thin border
- Radius: `16px`
- Soft overlay
- Compact width
- Clear title
- Primary action + cancel

Avoid long forms inside modals.

---

## 16. Drawers

Use drawers when users need to view or edit something without leaving the current page.

Good for:

- quick order details
- customer summary
- edit basic information
- activity/history

### Style

- Slide in from the right
- White background
- Thin left border
- Generous padding
- Width: around `400–480px`
- Use the same typography, inputs, and buttons as the rest of the system

Simple rule:

- Modal = short action
- Drawer = quick detail/edit while keeping context
- Full page = complex workflow

---

## 17. Pagination

- Place pagination below tables
- Show current page
- Show previous/next
- Optional rows-per-page selector
- Active page uses sky-blue accent
- Inactive controls use neutral grey/white

Keep it compact.

---

## 18. Empty, Loading and Error States

### Empty State

- Short clear message
- Optional simple icon
- CTA only when there is an obvious next step

Example:

`No orders found`
`Create Order`

### Loading State

- Use subtle skeleton loaders for cards and tables
- Avoid large spinners where possible

### Error State

- Short clear message
- Restrained red
- Give an obvious retry or recovery action

---

## 19. Page Header and Layout

### Header Row

The page title and main action should be on the same row.

Example:

`Orders                                      + Add Order`

Optional short description can sit below the title if needed.

### List Page Structure

Use:

1. Page title + primary action
2. Tabs
3. Search + filters
4. Main table/list
5. Secondary information below or in drawers/tabs

### General Layout Rules

- Page padding: `32px`
- Section gap: `24–32px`
- Keep related controls close together
- Use cards only where grouping is useful
- Avoid putting everything inside separate cards
- Important information appears higher on the page
- Secondary information appears lower or inside tabs/drawers

---

## 20. Iconography

- Use a consistent icon library
- Icons may use controlled sky-blue accents
- Keep most icons neutral unless they are active or meaningful
- Avoid too many coloured icons
- Keep icon size consistent

Suggested icon size:

- `18–20px`

---

## 21. Interaction Rules

### Hover

- Buttons: slightly darker sky blue
- Interactive cards: pale-blue tint
- Table rows: subtle pale-blue highlight
- Sidebar items: faint blue highlight

### Focus

- Use a subtle sky-blue focus ring

### Selected

- Use sky-blue text, border, or pale-blue background
- Avoid heavy glow effects

---

## 22. Design Principles

1. Clean and premium
2. Spacious and minimal
3. Faint blue sidebar + white workspace
4. Sky blue is the main accent
5. Flat cards with thin borders
6. Moderate rounding
7. Manrope typography
8. Enterprise tables with subtle zebra striping
9. Charts can be visual, but colour use must remain controlled
10. No gradients
11. No heavy shadows
12. Avoid excessive colours
13. Reuse patterns consistently
14. Prioritise readability and operational clarity

---

## 23. Codex Implementation Rules

When implementing UI:

1. Follow this file as the visual source of truth.
2. Reuse existing shared components before creating new ones.
3. Keep spacing, radius, typography, and colour usage consistent.
4. Use sky blue as the main accent.
5. Do not introduce gradients.
6. Do not introduce heavy shadows.
7. Keep KPI cards icon-free.
8. Use subtle zebra striping in tables.
9. Use rounded donut-chart segment ends.
10. Keep list-page hierarchy consistent:
    - title + main action
    - tabs
    - search + filters
    - content
11. Screenshots are references, not complete functional specifications.
12. Business requirements override visual references when necessary.

---

## 24. Reference Priority

When deciding between options, use:

**Business Requirements → This Design Guide → Existing Shared Components → Reference Images → AI Judgement**
