# TREE_GROWTH_SYSTEM.md

# Habit Tree Growth System

## 1. Purpose

This document defines the enhanced tree growth system for the Habit Garden static prototype.

The tree is not a static decoration. It is the core visual navigation and behavior record system.

The tree should represent:

* one habit as one main branch
* one year as a larger growth cycle
* one month as a middle branch
* one week as a sub-branch
* one day as one leaf or bud
* missed days as yellow leaves
* entry-action completion as pale leaves
* real-action completion as green leaves
* long-term continuity as branch extension, not streak pressure

The tree must preserve history even when the user misses a day.

The visual message should be:

```text
习惯不是被清零的任务，而是会继续生长的枝桠。
```

---

## 2. SVG Asset Strategy

The project uses the SVG component package:

```text
habit_tree_components_svg.zip
```

The package has two main SVG groups:

```text
editable-vector-svg/
exact-reference-svg/
```

### 2.1 Runtime SVG Source

Use this folder for actual frontend rendering:

```text
editable-vector-svg/assets/svg/
```

Reason:

* paths are editable
* stroke and fill can be styled
* hover states can be applied
* growth animation can be implemented
* colors can be adjusted through CSS
* SVGs are suitable for dynamic composition

### 2.2 Reference SVG Source

Use this folder only as visual reference:

```text
exact-reference-svg/
```

Reason:

* preserves original design look
* includes composition examples
* useful for checking visual quality
* not ideal for dynamic runtime rendering

Do not use `exact-reference-svg/composition/*` as the runtime tree logic.

---

## 3. Required Runtime SVG Folders

The runtime project should contain:

```text
assets/svg/tree/
assets/svg/branch/
assets/svg/leaf/
assets/svg/marker/
assets/svg/misc/
```

Expected files:

```text
assets/svg/tree/
├─ trunk-base.svg
├─ bark-texture.svg
├─ trunk-highlight.svg
└─ trunk-combined.svg

assets/svg/branch/
├─ branch-primary-left.svg
├─ branch-primary-right.svg
├─ branch-primary-center.svg
├─ branch-week-left.svg
├─ branch-week-right.svg
├─ branch-week-up.svg
├─ branch-month-left.svg
├─ branch-month-right.svg
├─ branch-year-left.svg
└─ branch-year-right.svg

assets/svg/leaf/
├─ leaf-fresh.svg
├─ leaf-normal.svg
├─ leaf-pale.svg
├─ leaf-withered.svg
├─ leaf-bud.svg
├─ leaf-cluster.svg
└─ leaf-highlight.svg

assets/svg/marker/
├─ week-node.svg
├─ month-node.svg
├─ year-node.svg
└─ glow-ring.svg

assets/svg/misc/
├─ seed.svg
└─ tooltip-anchor.svg
```

---

## 4. Tree Structure Model

The visual hierarchy should be:

```text
Tree trunk
└── Habit main branch
    └── Year branch
        └── Month branch
            └── Week branch
                └── Day leaf
```

For the first enhanced version, the required minimum hierarchy is:

```text
Tree trunk
└── Habit main branch
    └── Month branch
        └── Week branch
            └── Day leaf
```

Year-level branch can be supported in the data model but does not need to be visually complex in the first version.

---

## 5. Habit-to-Tree Mapping

Each habit should become one main branch.

Example:

```text
Habit: 阅读
→ one primary branch

Habit: 早睡
→ one primary branch

Habit: 运动
→ one primary branch
```

Each habit branch should contain all records of that habit.

Hovering any part of a habit branch should highlight the whole habit group.

Clicking the habit branch should open the habit detail page.

---

## 6. Time-to-Tree Mapping

### 6.1 Day

Each day is represented by a leaf or bud.

| Record Status | Visual                 |
| ------------- | ---------------------- |
| real          | green leaf             |
| entry         | pale leaf              |
| downgrade     | bud                    |
| missed        | withered / yellow leaf |
| no record     | empty bud or no leaf   |

### 6.2 Week

A week contains up to seven day leaves.

When the week has records, show a week branch.

When seven days are filled or the week is complete, the next week should grow from the end of the current month branch.

### 6.3 Month

A month contains four or five week branches.

When a new month starts, create a new month branch.

A month branch should be visually more important than a week branch.

Month branches can use:

```text
branch-month-left.svg
branch-month-right.svg
month-node.svg
leaf-cluster.svg
```

### 6.4 Year

A year contains month branches.

The first version can show year markers only when records cross years.

Year branches can use:

```text
branch-year-left.svg
branch-year-right.svg
year-node.svg
```

---

## 7. Layout Rules

### 7.1 Main Trunk

The trunk should be stable.

Use:

```text
assets/svg/tree/trunk-combined.svg
```

or combine:

```text
trunk-base.svg
bark-texture.svg
trunk-highlight.svg
```

The trunk should not be regenerated every time.

### 7.2 Habit Branch Placement

Habit main branches should be distributed around the trunk.

Suggested directions:

```text
habit 1 → primary right
habit 2 → primary left
habit 3 → primary center
habit 4 → primary right, higher
habit 5 → primary left, higher
```

For more habits, reuse the same branch assets with:

* different translate
* different rotate
* different scale
* slight opacity variation

### 7.3 Month Branch Placement

Month branches should grow from the habit main branch.

Use alternating directions:

```text
month 1 → right/up
month 2 → left/up
month 3 → right/mid
month 4 → left/mid
```

The layout does not need to be perfectly botanical. It must be readable and visually natural.

### 7.4 Week Branch Placement

Week branches grow from month branches.

Each week branch should hold up to seven leaves.

Leaf positions should be precomputed around the week branch path.

### 7.5 Leaf Placement

Leaves should not be placed in a rigid grid.

Use slightly varied:

* x offset
* y offset
* rotation
* scale

But the same habit should remain visually organized.

---

## 8. Rendering Architecture

Add these JS files:

```text
assets/js/tree-growth-model.js
assets/js/tree-renderer.js
assets/js/tree-interactions.js
```

### 8.1 `tree-growth-model.js`

Responsible for data transformation.

Functions:

```js
buildHabitTreeModel(habits)
buildSingleHabitTreeModel(habit)
groupRecordsByYearMonthWeek(records)
getRecordVisualStatus(record)
getWeekKey(date)
getMonthKey(date)
getYearKey(date)
```

This file should not manipulate DOM directly.

### 8.2 `tree-renderer.js`

Responsible for SVG rendering.

Functions:

```js
renderHabitForest(container, habits, options)
renderSingleHabitTree(container, habit, options)
renderTrunk(svgRoot)
renderHabitBranch(svgRoot, habitNode, layout)
renderMonthBranch(svgRoot, monthNode, layout)
renderWeekBranch(svgRoot, weekNode, layout)
renderLeaf(svgRoot, dayNode, layout)
clearTree(container)
```

This file should create SVG groups like:

```html
<g class="habit-group" data-habit-id="habit_001">
  <g class="habit-branch-layer"></g>
  <g class="month-branch-layer"></g>
  <g class="week-branch-layer"></g>
  <g class="leaf-layer"></g>
</g>
```

### 8.3 `tree-interactions.js`

Responsible for hover, click, tooltip, and selected state.

Functions:

```js
bindTreeInteractions(container, options)
highlightHabitGroup(habitId)
clearHabitHighlight()
showLeafTooltip(event, leafData)
hideLeafTooltip()
selectHabit(habitId)
```

---

## 9. Required DOM Structure

Home page tree area should include:

```html
<section class="garden-tree-stage">
  <div id="habitTreeCanvas" class="habit-tree-canvas"></div>
  <div id="treeTooltip" class="tree-tooltip" hidden></div>
</section>
```

Detail page tree area should include:

```html
<section class="branch-detail-tree-stage">
  <div id="singleHabitTreeCanvas" class="single-habit-tree-canvas"></div>
  <div id="treeTooltip" class="tree-tooltip" hidden></div>
</section>
```

The home page renders the whole habit forest.

The detail page renders only one selected habit.

---

## 10. SVG Composition Method

The renderer may use one of two methods.

### Method A: Inline SVG Symbol System

Load SVG paths into the page or create inline symbol definitions.

Then use:

```html
<use href="#branch-primary-left"></use>
```

Advantages:

* easier to style
* better hover control
* better animation control

### Method B: Image-Based SVG Components

Use:

```html
<image href="assets/svg/branch/branch-primary-left.svg"></image>
```

Advantages:

* simpler
* faster to implement

Disadvantages:

* harder to recolor internal paths
* less control over stroke animation

For the current prototype, Method B is acceptable for first integration.

If growth animation quality is poor, upgrade branch rendering to inline SVG paths later.

---

## 11. Animation Rules

### 11.1 Branch Growth

Branches should appear with a draw or scale animation.

Preferred:

```css
.branch-piece {
  transform-origin: left center;
  animation: branchGrow 720ms ease-out both;
}
```

If inline paths are used, prefer:

```css
.branch-path {
  stroke-dasharray: var(--path-length);
  stroke-dashoffset: var(--path-length);
  animation: drawBranch 900ms ease-out forwards;
}
```

### 11.2 Leaf Growth

Leaves should appear with:

* fade in
* scale up
* slight rotation

Do not use confetti.

### 11.3 Yellow Leaf

Missed day should appear as a yellow or withered leaf.

Animation should be calm:

* fade in
* slight downward drift
* no warning shake

### 11.4 Hover Highlight

Hovering a habit group should:

* brighten related branches
* slightly scale related leaves
* show a soft glow
* display habit title

Do not highlight only one small element when the user is hovering a whole habit branch.

---

## 12. Interaction Rules

### 12.1 Home Page

Hover on a habit branch:

* highlight the whole habit group
* show habit title
* show short summary

Click on a habit branch:

* set selected habit ID
* navigate to `detail.html`

Hover on a leaf:

* show date
* show status
* show reason if missed

Click on a leaf:

* optionally open detail page and focus record

### 12.2 Detail Page

Detail page should render only the selected habit tree.

It should show:

* habit branch
* month branches
* week branches
* daily leaves
* record tooltip
* selected-day detail

The tree should visually connect to the existing daily record card.

---

## 13. Status Visual Mapping

Use these mappings:

```js
const TREE_STATUS_VISUAL = {
  real: {
    asset: "assets/svg/leaf/leaf-normal.svg",
    className: "leaf-real",
    label: "完成真实行动"
  },
  entry: {
    asset: "assets/svg/leaf/leaf-pale.svg",
    className: "leaf-entry",
    label: "完成入场动作"
  },
  downgrade: {
    asset: "assets/svg/leaf/leaf-bud.svg",
    className: "leaf-downgrade",
    label: "今天调轻了"
  },
  missed: {
    asset: "assets/svg/leaf/leaf-withered.svg",
    className: "leaf-missed",
    label: "今天卡住了"
  }
};
```

Do not use the word:

```text
失败
```

Use:

```text
今天卡住了
```

---

## 14. Implementation Order

Implement in this order:

1. Copy SVG runtime assets into `assets/svg/`.
2. Add `assets/css/tree-growth.css`.
3. Add `assets/js/tree-growth-model.js`.
4. Add `assets/js/tree-renderer.js`.
5. Add `assets/js/tree-interactions.js`.
6. Integrate renderer into `index.html`.
7. Integrate single habit renderer into `detail.html`.
8. Add hover, click, tooltip.
9. Add growth animations.
10. Run QA and polish.

Do not rewrite the whole project.

Do not replace the existing habit creation flow.

Do not change the localStorage habit data format unless necessary.

---

## 15. Acceptance Checklist

The enhanced tree system is acceptable only if:

* the trunk uses the new SVG asset
* habit creation results in a new branch
* each habit is rendered as a grouped branch system
* records are rendered as leaves
* weekly grouping is visible
* monthly grouping is visible or structurally supported
* missed days use withered/yellow leaves
* hover on a branch highlights the whole habit group
* click on a habit branch opens detail page
* detail page can render one habit tree
* animations are smooth and calm
* no backend or framework is introduced
* old seed/tree/leaf logic is replaced cleanly
* existing pages still work
* `index.html` can still be opened directly

---

## 16. Non-Goals

Do not implement:

* physics-based tree simulation
* complex canvas rendering
* backend data storage
* external animation library
* leaderboard
* public social ranking
* real calendar sync
* AI-generated tree layout at runtime

This system should remain a static prototype enhancement using SVG, CSS, vanilla JS, and localStorage.
