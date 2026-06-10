# docs/TREE_GROWTH_SPEC.md

# Tree Growth System Specification

## 1. Purpose

This document defines the upgraded habit tree system for Habit Garden.

The tree is no longer a static illustration made of only one tree SVG, one leaf SVG, and one seed SVG. It should become a modular, data-driven growth visualization.

The purpose is to show:

```text
一个习惯如何从枝干开始，按天长叶，按周分枝，按月形成新的枝系，并在长期坚持中留下可见痕迹。
```

The tree should not look like a dashboard chart. It should feel like a living habit garden.

---

## 2. Core Visual Concept

The tree is composed of four levels:

```text
主树干
└── 习惯主枝
    └── 月枝
        └── 周枝
            └── 日叶
```

Mapping:

| Data Level | Visual Object  | Meaning                       |
| ---------- | -------------- | ----------------------------- |
| Root tree  | trunk          | the user's whole habit garden |
| Habit      | primary branch | one habit plan                |
| Month      | month branch   | one month of this habit       |
| Week       | week branch    | one week of records           |
| Day        | leaf or bud    | one daily behavior trace      |

The user should be able to understand:

* one habit is one branch system
* one week is one small branch with up to seven leaves
* one month is a larger branch containing weekly branches
* missed days are yellow leaves, not failure marks
* old traces remain visible after interruption

---

## 3. Available SVG Assets

The project already contains the following modular SVG assets:

```text
assets/svg/
├─ tree/
│  ├─ trunk-base.svg
│  ├─ bark-texture.svg
│  └─ trunk-highlight.svg
├─ branch/
│  ├─ branch-primary-left.svg
│  ├─ branch-primary-right.svg
│  ├─ branch-primary-center.svg
│  ├─ branch-week-left.svg
│  ├─ branch-week-right.svg
│  ├─ branch-week-up.svg
│  ├─ branch-month-left.svg
│  ├─ branch-month-right.svg
│  ├─ branch-year-left.svg
│  └─ branch-year-right.svg
├─ leaf/
│  ├─ leaf-fresh.svg
│  ├─ leaf-normal.svg
│  ├─ leaf-pale.svg
│  ├─ leaf-withered.svg
│  ├─ leaf-bud.svg
│  ├─ leaf-cluster.svg
│  └─ leaf-highlight.svg
├─ marker/
│  ├─ week-node.svg
│  ├─ month-node.svg
│  ├─ year-node.svg
│  └─ glow-ring.svg
└─ misc/
   ├─ seed.svg
   └─ tooltip-anchor.svg
```

Do not replace these assets with a single static tree image.

Use them as reusable visual modules.

---

## 4. Rendering Strategy

Use a single SVG canvas in the home page and detail page.

Recommended pattern:

```html
<svg class="growth-tree-canvas" viewBox="0 0 1200 760">
  <g class="tree-layer tree-layer-trunk"></g>
  <g class="tree-layer tree-layer-habits"></g>
  <g class="tree-layer tree-layer-tooltips"></g>
</svg>
```

Use `<image href="...">` inside the SVG canvas to place external SVG assets.

Example:

```html
<image
  href="assets/svg/tree/trunk-base.svg"
  x="460"
  y="120"
  width="280"
  height="560"
/>
```

This approach works better for static prototypes opened through `index.html`.

Important:

* Do not depend on fetching SVG text through JavaScript if it may fail under `file://`.
* Do not require a build step.
* Do not require an SVG sprite pipeline.
* Do not require backend processing.
* Animate groups, opacity, transforms, masks, and clipping rather than relying on complex runtime SVG parsing.

---

## 5. Layer Order

The tree should render in this order:

1. background glow
2. trunk base
3. bark texture
4. trunk highlight
5. habit primary branches
6. month branches
7. week branches
8. leaves and buds
9. markers
10. hover highlight
11. tooltip

CSS class names:

```text
growth-tree-canvas
tree-layer
tree-layer-trunk
tree-layer-habits
tree-layer-markers
tree-layer-tooltips
habit-branch-group
month-branch-group
week-branch-group
leaf-node
tree-tooltip
```

---

## 6. Habit Tree Data Model

The rendering system should not directly depend on raw habit records.

First convert raw habits into tree growth data.

Raw habit:

```js
{
  id: "habit_001",
  wish: "减少熬夜后的疲惫感",
  goldenBehavior: "晚饭后坐到书桌前",
  entryAction: "打开台灯并坐下",
  realAction: "学习 10 分钟",
  promptSentence: "当我晚饭后回到宿舍之后，我就打开台灯并坐下。",
  createdAt: "2026-06-10",
  records: [
    {
      date: "2026-06-10",
      status: "real",
      reason: "",
      note: "完成真实行动"
    }
  ]
}
```

Tree growth data:

```js
{
  habitId: "habit_001",
  title: "减少熬夜后的疲惫感",
  branchSide: "left",
  branchIndex: 0,
  years: [
    {
      year: "2026",
      months: [
        {
          month: "2026-06",
          weeks: [
            {
              weekKey: "2026-W24",
              days: [
                {
                  date: "2026-06-10",
                  status: "real",
                  leafType: "fresh",
                  dayIndex: 0
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

Valid record statuses:

```text
real       完成真实行动
entry      完成入场动作
downgrade  今天降级
missed     今天没有发生
empty      尚未记录
```

Leaf mapping:

| Record Status | SVG Asset                         | Meaning      |
| ------------- | --------------------------------- | ------------ |
| real          | leaf-fresh.svg or leaf-normal.svg | 完成真实行动       |
| entry         | leaf-pale.svg                     | 完成入场动作       |
| downgrade     | leaf-bud.svg                      | 今天先降级        |
| missed        | leaf-withered.svg                 | 今天没有发生，但保留痕迹 |
| empty         | leaf-bud.svg with low opacity     | 未记录          |

---

## 7. Growth Rules

### 7.1 Habit Branch

When a user creates a new habit:

* create one primary branch
* assign a stable branch side and branch index
* branch asset can be selected from:

  * branch-primary-left.svg
  * branch-primary-right.svg
  * branch-primary-center.svg

The branch should appear as a new habit branch from the trunk.

Each habit branch should be wrapped in:

```html
<g class="habit-branch-group" data-habit-id="habit_001"></g>
```

Hovering this group should highlight the whole branch system.

Clicking this group should open `detail.html` for the selected habit.

### 7.2 Week Branch

Each week has up to seven daily leaves.

A week branch should appear when there is at least one record in that week.

Week branch assets:

* branch-week-left.svg
* branch-week-right.svg
* branch-week-up.svg

A week branch should hold up to seven leaf slots.

When a week reaches seven records or reaches the end of the week:

* the next week branch can grow from the current month branch
* this should look like natural branching, not a table row

### 7.3 Month Branch

Each month contains 4 to 5 week branches.

Month branch assets:

* branch-month-left.svg
* branch-month-right.svg

A new month branch should appear when a record enters a new month.

Month branch can be slightly thicker or more visually stable than week branches.

A month marker can use:

```text
assets/svg/marker/month-node.svg
```

### 7.4 Year Branch

Year-level branching is optional in the first enhanced version.

If implemented:

* use branch-year-left.svg
* use branch-year-right.svg
* use year-node.svg

The first enhanced version should prioritize:

```text
habit → month → week → day
```

Year-level rendering can remain a light marker.

---

## 8. Layout Rules

The tree must remain visually balanced.

### 8.1 Home Page

Home page shows all habits.

Rules:

* each habit gets one primary branch
* branches alternate left and right
* no more than 5-7 habit branches should be visually dominant
* if habits exceed available space, use compact placement or subtle scaling
* the trunk remains the visual anchor
* clicking a branch opens habit detail

Suggested canvas:

```text
viewBox="0 0 1200 760"
```

Suggested trunk location:

```text
x: 460
y: 120
width: 280
height: 560
```

Suggested habit branch anchors:

```js
[
  { x: 565, y: 500, side: "left" },
  { x: 635, y: 455, side: "right" },
  { x: 555, y: 405, side: "left" },
  { x: 650, y: 350, side: "right" },
  { x: 590, y: 300, side: "center" }
]
```

### 8.2 Detail Page

Detail page shows only one habit branch system.

Rules:

* show one enlarged primary branch
* show month and week branches more clearly
* show leaf records with richer tooltip
* allow hover on week branch and leaf
* do not show all habits in detail page

Detail page can use the same renderer with mode:

```js
renderGrowthTree({
  mode: "detail",
  habits: [selectedHabit]
})
```

### 8.3 Leaf Placement

Each week branch should have seven leaf slots.

Leaf positions should not form a rigid row. They should feel organic.

Use slight variations:

* x offset
* y offset
* rotation
* scale

But the layout should remain readable.

---

## 9. Interaction Rules

### 9.1 Hover Habit Branch

When the user hovers a habit branch:

* highlight the entire habit branch group
* slightly brighten leaves
* show habit title
* show current summary:

  * total records
  * recent status
  * current prompt

Do not highlight only one leaf.

### 9.2 Click Habit Branch

When clicked:

* call `setSelectedHabitId(habitId)`
* navigate to `detail.html`

### 9.3 Hover Leaf

When the user hovers a leaf:

* show date
* show status
* show reason if status is missed
* keep tooltip short

Example:

```text
6 月 10 日：完成真实行动
```

For missed day:

```text
6 月 11 日：太累了
```

### 9.4 Hover Week Branch

Optional:

* highlight the week branch
* show weekly summary:

  * completed days
  * entry-only days
  * missed days

### 9.5 Selected Habit

If a habit is selected:

* keep its branch group slightly highlighted
* dim other habit branches slightly
* do not hide other branches completely

---

## 10. Animation Rules

The animation should feel like growth, not gamified celebration.

### 10.1 Branch Growth

Branch growth can be implemented through:

* opacity fade-in
* scale from branch origin
* clip-path reveal
* mask reveal
* transform-origin based growth

Do not rely on complex SVG path parsing.

Recommended class:

```css
.branch-grow-in {
  animation: branchGrowIn 900ms ease-out both;
}
```

### 10.2 Leaf Growth

Leaf appears through:

* opacity 0 to 1
* scale 0.6 to 1
* slight rotation
* short delay based on day index

Recommended class:

```css
.leaf-grow-in {
  animation: leafGrowIn 420ms ease-out both;
}
```

### 10.3 Hover Highlight

Hover should use:

* soft drop-shadow
* brightness
* subtle scale
* glow-ring marker

Avoid:

* flashing
* shaking
* red warning
* exaggerated bounce
* confetti

### 10.4 Missed Day

Missed day should appear as a yellow or withered leaf.

It should not feel like punishment.

Allowed copy:

```text
这也会留下来。
```

Avoid copy:

```text
你失败了。
```

---

## 11. Required Files to Add or Modify

Recommended new files:

```text
assets/css/tree-growth.css
assets/js/tree-growth-model.js
assets/js/tree-renderer.js
```

Recommended modified files:

```text
index.html
detail.html
assets/css/garden.css
assets/css/detail.css
assets/css/animations.css
assets/js/garden.js
assets/js/detail.js
assets/js/app-state.js
```

Do not remove existing page logic unless necessary.

Integrate the new tree renderer gradually.

---

## 12. Implementation Stages

### Stage 1 — Asset Registry

Create a JavaScript asset registry:

```js
const TREE_ASSETS = {
  trunk: {
    base: "assets/svg/tree/trunk-base.svg",
    texture: "assets/svg/tree/bark-texture.svg",
    highlight: "assets/svg/tree/trunk-highlight.svg"
  },
  branch: {
    primaryLeft: "assets/svg/branch/branch-primary-left.svg",
    primaryRight: "assets/svg/branch/branch-primary-right.svg",
    primaryCenter: "assets/svg/branch/branch-primary-center.svg",
    weekLeft: "assets/svg/branch/branch-week-left.svg",
    weekRight: "assets/svg/branch/branch-week-right.svg",
    weekUp: "assets/svg/branch/branch-week-up.svg",
    monthLeft: "assets/svg/branch/branch-month-left.svg",
    monthRight: "assets/svg/branch/branch-month-right.svg"
  },
  leaf: {
    fresh: "assets/svg/leaf/leaf-fresh.svg",
    normal: "assets/svg/leaf/leaf-normal.svg",
    pale: "assets/svg/leaf/leaf-pale.svg",
    withered: "assets/svg/leaf/leaf-withered.svg",
    bud: "assets/svg/leaf/leaf-bud.svg",
    cluster: "assets/svg/leaf/leaf-cluster.svg"
  },
  marker: {
    week: "assets/svg/marker/week-node.svg",
    month: "assets/svg/marker/month-node.svg",
    year: "assets/svg/marker/year-node.svg",
    glow: "assets/svg/marker/glow-ring.svg"
  }
};
```

### Stage 2 — Data Adapter

Create functions:

```js
buildGrowthTreeData(habits)
groupRecordsByYearMonthWeek(records)
getLeafTypeByStatus(status)
getHabitBranchAnchor(index)
```

### Stage 3 — SVG Renderer

Create functions:

```js
renderGrowthTree(container, habits, options)
renderTrunk(svg)
renderHabitBranch(svg, habitTree, index, options)
renderMonthBranch(group, monthData, layout)
renderWeekBranch(group, weekData, layout)
renderLeaf(group, dayData, layout)
```

### Stage 4 — Home Integration

Replace old simple tree rendering in `garden.js` with:

```js
renderGrowthTree(container, habits, {
  mode: "home",
  interactive: true
});
```

### Stage 5 — Detail Integration

Replace old detail tree or timeline rendering with:

```js
renderGrowthTree(container, [selectedHabit], {
  mode: "detail",
  interactive: true,
  selectedHabitId: selectedHabit.id
});
```

### Stage 6 — Interaction Polish

Add:

* habit branch hover
* leaf tooltip
* selected branch highlight
* click to detail
* keyboard focus if simple to add

### Stage 7 — Animation Polish

Add:

* branch growth animation
* leaf growth animation
* hover glow
* reduced motion support

---

## 13. Quality Requirements

The enhanced tree is acceptable only if:

* it uses modular SVG assets
* habits appear as branch systems
* records appear as leaves
* weeks are visually grouped
* months can create larger branches
* hover highlights the whole habit branch
* click opens habit detail
* missed days are yellow/withered leaves
* detail page can show one habit branch clearly
* animations are calm and smooth
* the project remains static and runnable by opening `index.html`
* no framework or build tool is introduced

---

## 14. Do Not

Do not:

* replace the tree with a static screenshot
* create separate full-tree SVGs for every state
* introduce React, Vue, canvas engine, npm build tools, or backend
* make records look like a calendar table
* make missed days look like failure alerts
* use red warning states
* rewrite unrelated pages
* break the existing habit creation and record flow
