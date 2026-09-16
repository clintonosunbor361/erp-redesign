# Example 2 Clone Home design system

This framework-free system is extracted from `example-2-clone-home`. It preserves the current DM Sans typography, deep-green and lime palette, compact controls, rounded panels, responsive sidebar, KPI behavior, and transaction presentation.

## Files

- `tokens.css`: semantic colors, typography, spacing, radii, borders, sizing, shadows, and motion.
- `icons.js`: dependency-free SVG icon registry.
- `components.js`: escaped HTML component functions exposed through `window.SiohiomaUI`.
- `components.css`: shared component styling.
- `../styles.css`: screen layout and chart-specific presentation, bridged to the shared tokens.
- `../app.js`: sample data, charts, filtering, sidebar behavior, dialogs, and event wiring.

## API

`SiohiomaUI` exposes `Icon`, `Button`, `SidebarItem`, `KPICard`, `Panel`, `StatusBadge`, and `TransactionRow`.

```js
SiohiomaUI.KPICard({title:'Total Orders',value:'482',trend:'↗ 8.2%',detail:'from last month'});
```

Text values are escaped by default. Arguments ending in `Html` are trusted markup slots and should receive local component output only.

Change global visual roles in `tokens.css`. For example, `--ds-primary`, `--ds-accent`, `--ds-radius-card`, and `--ds-font-family` update the shared system without changing component markup.
