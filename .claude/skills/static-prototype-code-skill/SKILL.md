# .claude/skills/static-prototype-code-skill/SKILL.md

---

name: static-prototype-code-skill
description: Use this skill whenever writing or modifying HTML, CSS, JavaScript, localStorage logic, data JSON, routing, or static prototype files.
---------------------------------------------------------------------------------------------------------------------------------------------------

# Static Prototype Code Skill

## Purpose

Use this skill to keep the implementation simple, static, and directly runnable.

## Hard Constraints

The prototype must:

* run by opening `index.html`
* use plain HTML
* use plain CSS
* use vanilla JavaScript
* use localStorage for state
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
* `garden.css` for home page tree and garden
* `create.css` for behavior design curve
* `detail.css` for branch detail and leaf timeline
* `animations.css` for shared motion

### JavaScript

Use:

* `app-state.js` for localStorage functions
* `garden.js` for home page
* `create-flow.js` for creation flow
* `detail.js` for detail page
* `review.js` for review page
* `micro-interactions.js` for shared interaction helpers

## State Management

Use localStorage keys:

```text
habitGarden.habits
habitGarden.selectedHabitId
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

Valid statuses:

```text
real
entry
downgrade
missed
```

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

Do not:

* over-engineer
* create unused abstractions
* add libraries for small tasks
* rewrite all files when a small change is enough

## Compatibility

The prototype should work in modern desktop browsers.

Minimum expected browsers:

* Chrome
* Edge
* Safari
* Firefox

---

