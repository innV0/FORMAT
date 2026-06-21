# Project Rules

## Expanded Options (Opciones Expandidas)
- In block pills of all sizes, the marker options, add child node buttons, edit, delete, and list controls are defined as "Expanded Options" (Opciones Expandidas).
- These options must be rendered inside the pill itself, directly below the name, and not to the right or outside the pill.
- The name inside the pill must always be styled with normal weight (no bold/semibold).
- Expanded options should only appear when the pill is hovered (which displays all available markers and action buttons), or when the pill is not hovered but has markers with a value greater than zero (which displays only those active markers).
- When the pill is hovered, it expands vertically (layout shifts to column flex) to display these expanded options below the name.
- When the pill is NOT hovered, the layout is single-line (inline-flex or row flex), and any active markers (value greater than zero) must be displayed inline to the right of the name.
- This behavior and visual mechanism must be identical for all block pills across hierarchy trees, concepts list, matrices, columns, and rows.
