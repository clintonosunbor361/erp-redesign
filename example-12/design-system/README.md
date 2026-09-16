# Example 12 design system

This system was extracted from the existing **Example 12**, not Example 12 Copy or the ERP design guide. Its Poppins typography, purple palette, USD content, rounded layout, responsive rules, and interactions remain the reference. There is no framework, build step, or production dependency; `index.html` still opens directly in a browser.

## Audit and file ownership

The original implementation repeated KPI and panel markup in HTML, created additional controls inside `app.js`, and mixed palette values with chart data and SVG artwork. Its small differences in corner radii, typography, and responsive table padding were deliberate preservation constraints, rather than opportunities to redesign.

| File | Responsibility |
| --- | --- |
| `tokens.css` | Palette, theme roles, typography, spacing, sizes, radii, borders, shadows, control and table heights |
| `components.js` | Reusable markup and interaction controllers; no dashboard records |
| `components.css` | Shared primitives, shell, navigation, header, cards, tables, modal and responsive component variants |
| `icons.js` | Existing SVG icon registry |
| `../screen.js` | Compose components with this dashboard's titles, filters, IDs, and content slots |
| `../dashboard.css` | Screen layout, chart layout, budget, payment identity, and goal presentation |
| `../assets.js` | Existing logo and avatar artwork, with tokenized colors |
| `../app.js` | Sample data, calculations, filtering, chart geometry, and screen event wiring |
| `../styles.css` | CSS entry point: tokens → components → screen |

## Global changes

Edit the declarations in `tokens.css`; avoid overrides scattered across component files.

| Token | Effect |
| --- | --- |
| `--color-primary` | Primary buttons, active navigation, income bars, budget's primary segment, and saving progress |
| `--color-primary-hover`, `--color-focus` | Existing hover and focus palette roles |
| `--surface`, `--sidebar`, `--ink`, `--muted`, `--border`, `--soft`, `--track` | Semantic roles, with separate light/dark aliases |
| `--font-family-body` | App typography, including inherited control text |
| `--font-size-unit` | Global type scale; all `--font-size-*` tokens derive from it |
| `--font-weight-regular`, `--font-weight-medium`, `--font-weight-semibold` | The existing 400 / 500 / 600 weights |
| `--line-height-body`, `--line-height-tight`, `--line-height-detail` | Existing 1.5 / 1.3 / 1.7 line heights |
| `--space-unit` | Global spacing scale; `--space-*` values derive from it |
| `--card-padding`, `--layout-gap` | Standard card padding and dashboard gap, using spacing aliases |
| `--radius-card` | Standard panels and KPIs; compact card radius derives from it with the original 5px difference |
| `--radius-*` | Existing control, pill, and other corner treatments |
| `--border-width`, `--border-subtle` | Shared border treatment; the dark theme resolves against its own border role |
| `--shadow-shell` | Existing outer frame shadow |
| `--control-height`, `--control-height-compact` | Standard and compact button / filter heights |
| `--table-row-height`, `--table-row-height-desktop` | Original 42.5px and 40.5px body row heights |
| `--table-heading-height`, `--table-heading-height-mobile` | Original 35.5px and 37px header row heights |

For example, set `--color-primary: #2468dd` to change the shared primary color, or `--radius-card: 30px` to update all cards (25px in the compact layout). These are examples, **not changes applied to the current screen**. Hover/focus and secondary series colors remain separate editable roles because the original palette uses distinct values. Merchant and avatar colors have independent tokens so a primary-color change does not recolor merchant identities or skin tones.

The fine spacing and font-size increments preserve the original rather than forcing it onto a newly invented scale. Table heights are natural minimums: content, padding, and larger typography can still increase the row height. The `card--table` variant retains the table panel's original desktop padding and yields to the standard responsive card padding.

## Component API

Load `icons.js`, then `components.js`. APIs are available on `window.FinSetUI`.

| Component | Inputs / use |
| --- | --- |
| `Sidebar` | Brand, toggle, navigation groups, footer slots |
| `SidebarItem` | `href`, `label`, `icon`, `active` |
| `PageHeader` | Title, subtitle, menu and action slots |
| `Button` | Label or trusted HTML, variant, leading/trailing icon, attributes; defaults to `type="button"` |
| `Input` / `Search` | Input attributes; search's label, placeholder, ID and visibility |
| `Dropdown` | ID, accessible label, `[value, label]` options |
| `FilterControls` | Layout class and control content slot |
| `KPICard` | Heading, value ID/content, detail label, trend and supporting text |
| `StatusBadge` | Label and positive/negative tone; `.update()` updates an existing badge |
| `StandardCard` / `Panel` | Title, action/content slots, classes and attributes |
| `ChartCard` | Standard card framing for custom chart content and filter controls |
| `DataTable` | Column labels, tbody ID, row content; `.rows()` accepts records and column renderers |
| `DetailList` | Escaped label/value pairs for modal details |
| `SegmentedControl` | Existing light/dark selector appearance and pressed-state buttons |
| `Tabs` | Unique ID, label, selected index, items with labels and panel content |
| `Modal` | Unique dialog, title, body, and close IDs |

`bindModal()` accepts element references, manages opening/closing, and uses native dialog focus restoration and Escape behaviour. `bindSidebar()` accepts element references plus a media query; it owns collapse state and the existing mobile drawer, including inert background, focus containment, backdrop dismissal, and Escape. No separate content drawer existed, so none was added to the screen.

There were no content tabs on the dashboard. `Tabs` is an opt-in reusable pattern based on the existing segmented controls. Call `bindTabs(root)` once after mounting it to enable click, arrow keys, Home/End, selection, and panel visibility. The light/dark control remains a pressed-button selector, not a tab list.

```js
const UI = window.FinSetUI;
document.querySelector('#content').innerHTML = UI.StandardCard({
  title: 'Inventory',
  actionsHtml: UI.Button({
    label: 'Add product', variant: 'primary', icon: 'plus',
    attributes: { id: 'addProduct' }
  }),
  contentHtml: UI.DataTable({
    columns: ['Product', 'Stock'], bodyId: 'inventoryRows',
    rowsHtml: UI.DataTable.rows(products, [
      { value: product => product.name },
      { value: product => product.stock }
    ])
  })
});
```

Text and attribute values are escaped. `contentHtml`, `actionsHtml`, `brandHtml`, and column `renderHtml` are explicitly trusted markup slots; compose them from components and escape any record values. Use unique IDs when rendering multiple instances. Component controllers take elements rather than assuming the example's IDs. Dashboard-specific chart renderers still target this screen's chart IDs.

## Remaining literals

- **Responsive thresholds:** 1150/1151, 950, 760, 560, and 370px remain in media queries, with 560px in the drawer's `matchMedia`. Native CSS variables cannot drive media-query conditions. Change the mobile threshold in CSS and the controller configuration together.
- **SVG and chart geometry:** view boxes, vector path coordinates, series scaling, donut circumference/gaps, percentages, calculated tooltip positions, and calculated bar positions remain numeric. They describe artwork or data geometry rather than shared UI spacing. Bar corner styling is tokenized.
- **Layout relationships:** grid fractions, percentages, zero resets, z-index levels, and animation timings remain literal. They preserve layout and motion behaviour; no new appearance was introduced.
- **Identity artwork:** SVG geometry is retained as artwork, while its colors live in the token file. Payment merchant colors also use named tokens.
- **Product content and calculations:** currency amounts, reporting months, labels, and progress percentages remain screen data, not design tokens.

No hex colors or literal font sizes remain in component/screen CSS or dynamic UI markup. The palette's slightly different expense, legend, logo, and secondary text colors are centralized separately to avoid silently flattening the approved design.

## Verification

From `example-12`:

```sh
npm install
npx playwright-core install chromium
npm test
npm run test:visual
```

The five baselines were captured **before** the refactor at 1200×900, 1448×1086, 900×900, 390×844, and dark 1200×900. The visual run compares PNG bytes and computed geometry. Baselines use Windows, Chromium supplied by Playwright Core 1.62.1, and the existing Google-hosted Poppins font; use the same environment for exact pixel comparisons. Font availability or a different browser/OS can cause comparison failures without a code regression. Production font loading is unchanged.

The checks also cover periods, account filters, chart keyboard tooltips, search and empty states, modal details, widget visibility and validation, theme persistence, collapse, mobile focus behaviour, token propagation, and rendering another card/modal/tab set with different IDs. An existing Playwright Core installation can be selected through `PLAYWRIGHT_MODULE` without adding runtime dependencies.
