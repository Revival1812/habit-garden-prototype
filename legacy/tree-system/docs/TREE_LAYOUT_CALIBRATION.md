# TREE_LAYOUT_CALIBRATION.md

# Habit Tree Layout Calibration

## 1. Purpose

This document defines how to calibrate SVG tree components in the Habit Garden prototype.

The tree growth system must not place SVG components by rough absolute guessing. Every tree component should be positioned by a shared coordinate system and explicit anchor points.

The goal is to make the tree look like one connected growing organism, not a group of floating SVG images.

---

## 2. Current Problem to Avoid

Do not render the tree by simply placing SVG files with arbitrary `x`, `y`, `width`, and `height`.

This causes:

* branches floating away from the trunk
* leaves not attached to branches
* trunk background square visible
* inconsistent scale between trunk, branches, and leaves
* hover highlight not matching the visual branch system
* tree looking like pasted stickers instead of organic growth

---

## 3. Required Coordinate System

All tree rendering must happen inside one SVG world.

Use one root SVG:

```html
<svg class="habit-growth-svg" viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid meet">
</svg>
```

The tree renderer should use this world coordinate system consistently.

Do not mix SVG world coordinates with CSS absolute positioning for branches and leaves.

---

## 4. Tree Stage Layout

Home page tree container:

```html
<section class="garden-tree-stage">
  <div id="habitTreeCanvas" class="habit-tree-canvas"></div>
  <div id="treeTooltip" class="tree-tooltip" hidden></div>
</section>
```

Recommended CSS behavior:

```css
.garden-tree-stage {
  position: relative;
  width: min(1180px, 92vw);
  height: min(720px, 72vh);
  margin: 0 auto;
}

.habit-tree-canvas {
  width: 100%;
  height: 100%;
}

.habit-growth-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
```

The tree should be centered visually, not aligned by random CSS margins.

---

## 5. Runtime Asset Rules

Use runtime assets from:

```text
assets/svg/tree/
assets/svg/branch/
assets/svg/leaf/
assets/svg/marker/
assets/svg/misc/
```

Do not use full composition SVGs as runtime tree elements.

Use `exact-reference-svg/composition/*` only as visual reference.

---

## 6. Trunk Rendering Rules

The trunk is the stable base of the tree.

Use either:

```text
assets/svg/tree/trunk-combined.svg
```

or layered assets:

```text
assets/svg/tree/trunk-base.svg
assets/svg/tree/bark-texture.svg
assets/svg/tree/trunk-highlight.svg
```

If `trunk-combined.svg` contains a visible background rectangle or paper-like square, do not use it directly. Either:

1. remove the background rectangle from the SVG, or
2. use layered trunk assets instead.

The trunk should be placed in world coordinates using a fixed layout:

```js
trunk: {
  x: 500,
  y: 155,
  width: 210,
  height: 460
}
```

Values can be adjusted after visual testing.

---

## 7. Anchor-Based Component Placement

Every branch component must be placed by anchor alignment.

Each branch asset should define:

```js
{
  href,
  width,
  height,
  anchor,
  defaultScale,
  defaultRotation
}
```

Where:

* `anchor.x` and `anchor.y` are the local coordinates of the branch root inside the SVG image.
* The renderer should align this local anchor to a world connection point on the trunk or parent branch.

Do not place branches by their top-left corner.

---

## 8. Required Layout Registry

Create:

```text
assets/js/tree-layout-registry.js
```

This file should define:

```js
window.TreeLayoutRegistry = {
  world: {
    width: 1200,
    height: 760
  },

  trunk: {
    href: "assets/svg/tree/trunk-base.svg",
    x: 500,
    y: 155,
    width: 210,
    height: 460
  },

  habitSlots: [
    {
      id: "slot-right-1",
      side: "right",
      attach: { x: 650, y: 260 },
      asset: "primaryRight",
      rotation: -8,
      scale: 1
    },
    {
      id: "slot-left-1",
      side: "left",
      attach: { x: 540, y: 300 },
      asset: "primaryLeft",
      rotation: 8,
      scale: 1
    }
  ],

  branchAssets: {
    primaryRight: {
      href: "assets/svg/branch/branch-primary-right.svg",
      width: 340,
      height: 145,
      anchor: { x: 28, y: 84 }
    },
    primaryLeft: {
      href: "assets/svg/branch/branch-primary-left.svg",
      width: 340,
      height: 145,
      anchor: { x: 312, y: 82 }
    }
  }
};
```

Values should be calibrated visually.

---

## 9. Branch Rendering Formula

A branch should be rendered by aligning its local anchor to a world attach point.

For image-based SVG rendering, use:

```js
const finalX = attach.x - asset.anchor.x * scale;
const finalY = attach.y - asset.anchor.y * scale;
```

Then render:

```html
<image
  href="..."
  x="finalX"
  y="finalY"
  width="asset.width * scale"
  height="asset.height * scale"
/>
```

If rotation is needed, wrap image in:

```html
<g transform="rotate(angle attach.x attach.y)">
  <image ... />
</g>
```

Rotation should happen around the attach point, not around the SVG top-left corner.

---

## 10. Debug Overlay

The tree renderer should support debug mode:

```js
renderHabitForest(container, habits, {
  debug: true
});
```

Debug mode should display:

* world grid
* trunk bounding box
* branch bounding boxes
* attach points
* local anchors
* leaf slots
* habit slot labels

Debug visuals should be removable by setting `debug: false`.

---

## 11. Leaf Placement Rules

Leaves should be placed on predefined local slots of week branches.

Each week branch should define leaf slots:

```js
leafSlots: [
  { x: 90, y: 32, rotate: -18, scale: 0.72 },
  { x: 120, y: 20, rotate: 12, scale: 0.68 },
  { x: 150, y: 38, rotate: -8, scale: 0.7 }
]
```

For the first version, leaf positions can be computed from the week branch attach point plus offsets.

Do not place leaves randomly around the trunk.

---

## 12. Layering Order

SVG elements should be rendered in this order:

1. soft background glow
2. trunk
3. primary habit branches
4. month branches
5. week branches
6. markers
7. leaves
8. hover highlight layer
9. tooltip handled by HTML

This prevents leaves from being hidden behind branches.

---

## 13. Home Page Integration Rule

The home page should call the tree renderer but should not contain detailed layout logic.

Allowed in `garden.js`:

```js
const habits = AppState.getHabits();
TreeRenderer.renderHabitForest(canvas, habits, { mode: "home" });
TreeInteractions.bindTreeInteractions(canvas, { onHabitSelect });
```

Not allowed in `garden.js`:

* manually computing branch coordinates
* manually placing leaf SVGs
* defining branch slots

Those belong in `tree-layout-registry.js` and `tree-renderer.js`.

---

## 14. Detail Page Integration Rule

The detail page should render one selected habit using the same renderer:

```js
TreeRenderer.renderSingleHabitTree(canvas, habit, { mode: "detail" });
```

The detail page should not create a separate tree rendering logic.

---

## 15. Calibration Workflow

Use this workflow:

1. Create `tree-lab.html`.
2. Render trunk only.
3. Enable debug grid.
4. Add two primary branches.
5. Adjust branch asset anchors.
6. Add month branches.
7. Add week branches.
8. Add seven leaf slots.
9. Disable debug grid.
10. Integrate into `index.html`.
11. Integrate into `detail.html`.

Do not debug tree layout directly inside the full home page.

---

## 16. Acceptance Criteria

The layout calibration is acceptable if:

* trunk has no visible rectangular background
* primary branches attach naturally to trunk
* branches do not float
* week branches visually connect to month branches
* leaves visually sit on or near branches
* hover on a branch highlights the whole habit group
* tree remains centered on different screen sizes
* home page does not look like pasted SVG stickers
* debug mode can be turned on and off
* no framework or backend is introduced
