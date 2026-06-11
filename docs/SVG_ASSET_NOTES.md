# SVG Asset Notes

## 1. Current Status

This file is now a historical asset note.

The old tree, trunk, branch, leaf, and marker SVG inventory came from the previous habit tree direction. That direction is deprecated and must not be used as the primary home or detail implementation.

Current product direction:

```text
River Stage Habit System
```

Use river-stage objects for new implementation:

| Status | New river object |
| --- | --- |
| `real` | lotus |
| `entry` | dark green small leaf |
| `downgrade` | light green small leaf |
| `missed` | small stone |
| no record | faint placeholder ripple |

## 2. Deprecated Asset Families

The following old asset families are deprecated:

* `assets/svg/tree/`
* `assets/svg/branch/`
* old trunk assets
* old branch assets
* old tree marker assets
* old root-level `tree.svg` as the home visual
* old tree growth composition assets

These may remain in the repository temporarily for compatibility, backup, or cleanup planning. They must not guide new runtime rendering.

## 3. Do Not Use for New Runtime Work

Do not use these old systems for new page implementation:

* tree renderer
* branch stitching
* trunk composition
* tree rings
* `tree-layout-registry`
* tree interactions
* watering or plant-growing interactions
* Three.js garden or plant scenes

If existing code still references old assets, treat that as legacy debt to remove during the river implementation cleanup, not as product direction.

## 4. New Asset Guidance

For new river work, assets should support:

* one fixed river background PNG
* symbolic lotus SVG
* symbolic dark green small leaf SVG
* symbolic light green small leaf SVG
* symbolic small stone SVG
* subtle placeholder ripple SVG or CSS shape

The background image is atmospheric only. Habit data is rendered through overlay markers placed at fixed coordinates.

## 5. Cleanup Rule

Before deleting old SVG files, first verify no active HTML/CSS/JS path still depends on them. Deletion should happen in a dedicated implementation cleanup round, not during documentation-only work.
