---
name: static-prototype-code-skill
description: Use this skill whenever writing or modifying HTML, CSS, JavaScript, localStorage logic, data JSON, routing, or static prototype files for the Habit Garden prototype, including the River Stage home and detail pages.
---

# Static Prototype Code Skill

## Purpose

Use this skill to keep the implementation simple, static, and directly runnable.

The current product direction is the River Stage Habit System. Existing names such as `garden.css` or `garden.js` may remain as historical containers, but they must not imply a return to the old tree system.

## Hard Constraints

The prototype must:

* run by opening `index.html`
* use plain HTML
* use plain CSS
* use vanilla JavaScript
* use `localStorage` for state
* avoid backend
* avoid database
* avoid build tools
* avoid framework dependencies

Do not use:

* React
* Vue
* Next.js
* Svelte
* Astro
* TypeScript build pipeline
* Tailwind build process
* npm scripts
* server-side rendering
* backend API
* Three.js

## File Responsibilities

### HTML

Each HTML file should:

* include semantic structure
* include shared CSS
* include page-specific CSS
* include shared JS if needed
* include page-specific JS
* work independently

### CSS

Use:

* `base.css` for variables, reset, typography, shared layout
* `garden.css` for the river stage home, habit selector, motto panel, monthly markers, and today popover
* `create.css` for behavior design curve
* `detail.css` for river detail stage, week markers, right drawer, heatmap, and single-day detail
* `animations.css` for shared motion

Do not treat `garden.css` as tree-specific. Do not rebuild branch/trunk styles.

### JavaScript

Use:

* `app-state.js` for `localStorage` functions
* `garden.js` for river home behavior
* `create-flow.js` for creation flow
* `detail.js` for river detail behavior
* `review.js` for review page
* `micro-interactions.js` for shared interaction helpers

Do not treat `garden.js` as a tree renderer. Remove or bypass old tree paths when implementing the river system.

## State Management

Use localStorage keys:

```text
habitGarden.habits
habitGarden.selectedHabitId
habitGarden.homeSelectedMonth
habitGarden.detailSelectedWeek
habitGarden.userTone
habitGarden.lastVisit
```

Do not create complex global state systems.

## Data Model

A habit object should include:

```js
{
  id,
  wish,
  reason,
  candidates,
  goldenBehavior,
  microHabitType,
  entryAction,
  realAction,
  prompt,
  promptSentence,
  promptStrength,
  trialDays,
  createdAt,
  records,
  adjustments
}
```

A record object should include:

```js
{
  date,
  status,
  reason,
  note
}
```

Required record fields:

* `date`
* `status`

Optional record fields:

* `reason`
* `note`

Valid statuses:

```text
real
entry
downgrade
missed
```

No record for a date means `unrecorded`; do not store a fake status unless the UI explicitly needs a view model.

## Routing

Use normal page links:

```text
index.html
create.html
detail.html
review.html
explore.html
```

Do not implement complex routing.

## Data Loading

Static JSON files can be used, but the prototype should still work if JSON fetch fails under `file://`.

Prefer defining fallback data in JavaScript.

## Code Style

Do:

* write readable functions
* keep functions short
* use meaningful names
* guard against missing localStorage data
* avoid console errors
* add comments only where helpful
* upsert one record per habit per date
* keep river point registries deterministic

Do not:

* over-engineer
* create unused abstractions
* add libraries for small tasks
* rewrite all files when a small change is enough
* rebuild old tree renderer, tree interactions, branch stitching, or tree-layout registry

## Compatibility

The prototype should work in modern desktop browsers.

Minimum expected browsers:

* Chrome
* Edge
* Safari
* Firefox
