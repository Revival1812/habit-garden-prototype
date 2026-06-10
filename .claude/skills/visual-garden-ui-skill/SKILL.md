# .claude/skills/visual-garden-ui-skill/SKILL.md

---

name: visual-garden-ui-skill
description: Use this skill when designing layout, visual hierarchy, colors, SVGs, tree visuals, leaf visuals, garden metaphor, or CSS aesthetics for the habit garden prototype.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Visual Garden UI Skill

## Purpose

Use this skill to keep the interface visually consistent with the habit garden metaphor.

The product should feel like:

```text
quiet garden
soft growth
visible traces
low-pressure return
```

It should not feel like:

```text
dashboard
task manager
ranking app
admin system
fitness challenge
```

## Core Visual Objects

Use these objects consistently:

| Visual Object | Meaning                       |
| ------------- | ----------------------------- |
| Seed          | New habit possibility         |
| Soil          | Starting point                |
| Tree          | Whole habit system            |
| Branch        | One habit                     |
| Leaf          | One daily trace               |
| Pale leaf     | Entry action completed        |
| Green leaf    | Real action completed         |
| Yellow leaf   | Missed day, history preserved |
| Bud           | Downgraded action             |
| Ring          | Long-term accumulated trace   |
| Glow          | Anonymous companionship       |
| Curve         | Creation process              |

## Color Direction

Use:

* warm off-white
* sage green
* moss green
* soft wood brown
* pale yellow
* low-saturation blue-gray

Avoid:

* harsh red
* neon green
* heavy black
* bright orange warning
* corporate dashboard blue
* high-contrast gamification palette

## Recommended CSS Variables

```css
:root {
  --color-bg: #f7f3ea;
  --color-surface: #fffdf7;
  --color-surface-soft: #f0eadf;
  --color-primary: #6f8f72;
  --color-primary-dark: #3f5f46;
  --color-primary-light: #dce8d5;
  --color-wood: #a9825a;
  --color-leaf: #7fa86b;
  --color-leaf-pale: #bed4a9;
  --color-yellow-leaf: #d7b56d;
  --color-glow: #f4df9b;
  --color-text: #263328;
  --color-text-soft: #687466;
  --color-border: rgba(63, 95, 70, 0.16);
  --shadow-soft: 0 18px 40px rgba(63, 95, 70, 0.10);
}
```

## Layout Rules

Do:

* Use one main visual per page.
* Keep enough whitespace.
* Use rounded cards.
* Use organic curves.
* Keep visual focus clear.
* Use soft shadows.
* Use subtle depth.

Do not:

* fill the page with many panels
* use dense tables
* place too many metrics at the top
* make navigation dominate the screen
* use strong grid-heavy dashboard layout

## Tree Rules

The tree should:

* be central on the home page
* show branches as habits
* show leaves as records
* support hover and click
* look organic but not childish
* preserve yellow leaves

The tree should not:

* show failure count as main element
* show streak as the main element
* look like a performance chart

## Curve Rules

The creation curve should:

* grow gradually
* reveal nodes step by step
* let users go back
* visually indicate progress
* feel like a path, not a form wizard

## Icon and SVG Style

SVGs should be:

* simple
* soft
* slightly organic
* line-based or flat-filled
* consistent in stroke width

Avoid:

* complex illustration
* stock icon feel
* childish stickers
* hyper-realistic assets

---

