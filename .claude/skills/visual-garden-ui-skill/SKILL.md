---
name: visual-garden-ui-skill
description: Use this skill when designing layout, visual hierarchy, colors, SVGs, river stage visuals, water flow, floating leaves, lotus, stones, ripples, soft natural UI, or CSS aesthetics for the Habit Garden prototype. Use it to keep the new river-stage direction and prevent the old tree or branch system from returning as the home visual.
---

# Visual Garden UI Skill

## Purpose

Use this skill to keep the interface visually consistent with the current Habit Garden direction:

```text
river stage
soft water flow
floating leaves
lotus traces
small stones
faint ripples
low-pressure return
```

The name "garden" can remain at product level, but the home visual is no longer a tree. The main visual system is the river stage.

## Visual Feeling

The product should feel like:

```text
quiet river
soft natural traces
visible but gentle records
low-pressure return
clear behavior design
```

It should not feel like:

```text
dashboard
task manager
ranking app
admin system
fitness challenge
tree growth game
plant watering game
```

## Core Visual Objects

Use these objects consistently:

| Visual object | Meaning |
| --- | --- |
| Fixed river background | Atmosphere and stage only |
| Left floating habit list | Habit selector |
| Motto floating panel | No habit selected |
| Lotus | Completed real action |
| Dark green small leaf | Entry action |
| Light green small leaf | Downgraded action |
| Small stone | Did not happen |
| Faint ripple | Not recorded |
| Soft heatmap cell | Pattern observation |
| Curve | Creation process |

The river background must not encode data. Real records are represented by overlay objects.

## Deprecated Visual Objects

Do not use these as the home main visual:

* habit tree
* trunk
* branch
* tree rings
* stitched branch SVGs
* tree renderer
* `tree-layout-registry`
* watering plant
* Three.js plant scene

Old assets or old file names may exist, but they should not guide new UI work.

## Color Direction

Use:

* warm off-white
* soft river blue-green
* sage green
* moss green
* lotus pink
* pale stone gray
* low-saturation blue-gray
* translucent white ripples

Avoid:

* harsh red
* neon green
* heavy black
* bright orange warning
* corporate dashboard blue
* high-contrast gamification palette
* dominant purple gradients

## Recommended CSS Variables

```css
:root {
  --color-bg: #f4f0e7;
  --color-surface: #fffdf7;
  --color-surface-soft: #f0eadf;
  --color-river: #8fb7b6;
  --color-river-deep: #5f8f8e;
  --color-primary: #5f7f63;
  --color-primary-dark: #344f3b;
  --color-lotus: #f1c9c7;
  --color-leaf-dark: #4f7d54;
  --color-leaf-light: #a8c795;
  --color-stone: #b9b2a4;
  --color-ripple: rgba(255, 255, 255, 0.55);
  --color-text: #263328;
  --color-text-soft: #687466;
  --color-border: rgba(63, 95, 70, 0.16);
  --shadow-soft: 0 18px 40px rgba(63, 95, 70, 0.10);
}
```

## Layout Rules

Do:

* Use one main visual stage per page.
* Keep enough whitespace.
* Use floating panels with restrained shadows.
* Keep the river stage visible behind panels.
* Make overlays stable and deterministic.
* Use soft depth and clear selection states.
* Keep the top navigation light.

Do not:

* fill the page with many panels
* use dense tables
* place too many metrics at the top
* make navigation dominate the screen
* use strong grid-heavy dashboard layout
* hide the river behind cards

## River Stage Rules

The river stage should:

* use a fixed background
* support overlay markers
* use fixed percentage points for daily markers
* show a motto panel when no habit is selected
* show monthly markers when a habit is selected
* keep markers readable at desktop and mobile sizes

The river stage should not:

* change the background based on status
* show multiple stacked rivers for multiple habits
* encode progress inside the background image
* use tree branches as layout paths

## Detail Visual Rules

The detail page should:

* use the same river background as home
* show one selected habit
* show month and week controls
* show at most 7 day objects for a selected week
* include a right collapsible drawer
* show a soft heatmap that feels organic

The heatmap should not look like an engineering statistics panel.

## Curve Rules

The creation curve should:

* reveal nodes step by step
* let users go back
* visually indicate progress
* feel like a path, not a form wizard
* save the final habit into the river system

## Icon and SVG Style

SVGs or CSS objects should be:

* simple
* soft
* slightly organic
* symbolic
* consistent in stroke width

Avoid:

* complex illustration
* stock icon feel
* childish stickers
* hyper-realistic assets
* realistic tree assembly
