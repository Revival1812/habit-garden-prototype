---
name: tree-growth-renderer-skill
description: Use this skill when implementing or modifying the SVG tree growth system, tree data model, branch rendering, leaf rendering, hover highlight, tooltip, or habit tree animations.
---

# Tree Growth Renderer Skill

## Purpose

The habit tree is a data-driven SVG growth system.

Do not implement it as static image switching.

## Core Architecture

Use:

- `tree-growth-model.js` for data transformation
- `tree-renderer.js` for SVG rendering
- `tree-interactions.js` for hover, click, tooltip
- `tree-growth.css` for tree layout and animation

Do not put all tree logic into `garden.js` or `detail.js`.

## Visual Hierarchy

The tree hierarchy is:

```text
trunk
└── habit branch
    └── year branch
        └── month branch
            └── week branch
                └── day leaf

```

Minimum required version:

```
trunk
└── habit branch
    └── month branch
        └── week branch
            └── day leaf
```

## Asset Rules

Runtime assets must come from:

```
assets/svg/tree/
assets/svg/branch/
assets/svg/leaf/
assets/svg/marker/
assets/svg/misc/
```

Use editable SVG components, not reference composition SVGs.

## Status Mapping

```
real      → green leaf
entry     → pale leaf
downgrade → bud
missed    → withered / yellow leaf
```

Never use the word:

```
失败
```

Use:

```
今天卡住了
```

## Interaction Rules

Hover on any part of a habit branch should highlight the whole habit group.

Click on a habit branch should select the habit and open `detail.html`.

Hover on a leaf should show date, status, and optional note.

## Implementation Rules

Do:

- keep rendering modular
- create SVG groups
- use data attributes
- preserve localStorage data format
- keep animations calm
- keep the prototype static

Do not:

- introduce frameworks
- use canvas
- use backend
- use many static full-tree SVG states
- overwrite the whole project