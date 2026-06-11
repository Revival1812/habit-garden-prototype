# River Home Specification

## 1. Goal

`index.html` is the River Stage Home and habit entry page.

It should let users:

* see the river background as the main visual stage
* see all habits in a bounded left floating list
* open one habit by going directly to `detail.html`
* create a new habit from the left list
* open today's recording panel from the top navigation
* understand the project through one short intro card

The home page does not show a selected habit's month, week, daily objects, or status objects. Habit execution views live in `detail.html`.

---

## 2. Page Structure

Required DOM regions:

```text
top navigation
main river home mount
  river stage
    fixed river background
    left habit list
    project intro card
  today record popover
```

Current `index.html` provides:

```html
<section id="riverHomeMount" class="river-home-mount"></section>
```

The home system mounts inside this section.

---

## 3. Top Navigation

Required labels:

```text
花园
设计
复盘
探索
今日记录
```

Expected behavior:

* `花园` opens `index.html`
* `设计` opens `create.html`
* `复盘` opens `review.html`
* `探索` opens `explore.html`
* `今日记录` opens the fixed-height popover on home

---

## 4. Left Habit List

Purpose:

* display available habits
* provide the habit entry point
* provide a create-new entry

Each item should show:

* habit wish or short title
* micro-habit summary, such as entry action or prompt sentence

Item interactions:

* click writes that habit ID to `localStorage`
* click navigates directly to `detail.html`
* keyboard activation should do the same
* the home page does not expand, select, or render that habit's weekly records

Visual and scroll rules:

* The list should read as a light vertical habit rail, not a card stack.
* Use one vertical line as the visual anchor.
* Text must not intersect the vertical line.
* The list has a fixed width and fixed height.
* If habits overflow, the list scrolls internally.
* Pointer-directed auto-scroll is allowed but not required.
* Avoid an obvious heavy scrollbar in the left habit list.
* Place a plus/add control below the list, outside the scrolling content.
* The plus/add control navigates directly to `create.html`.

Empty state:

* show one compact prompt
* show the plus/add control

---

## 5. River Stage

The river stage contains:

* fixed background image
* optional atmosphere layer
* floating habit list
* project intro card

Background rules:

* use one fixed background for the home stage
* use `assets/images/river-stage-bg.png`
* no data embedded in the image
* no status-specific background changes
* no generated tree or plant scene
* no river daily objects on home

The river should remain stable while the user's data changes.

---

## 6. Project Intro Card

The home page shows one compact intro card near the middle-right area.

Copy:

```text
让行为自然发生
从微小的流动开始，慢慢留下自己的节奏。
```

Optional short points:

```text
想做：看见真正的愿望
做得动：把动作调轻一点
想得起：绑定自然提示
```

Rules:

* keep copy short
* do not explain the Fogg model at length
* do not use pressure, punishment, ranking, or exaggerated praise copy
* match the left habit list's visual style
* do not cover the left habit list or top navigation

---

## 7. Habit Detail Entry

When a habit is clicked:

1. save the habit ID to `habitGarden.selectedHabitId`
2. navigate to `detail.html`
3. let `detail.html` render the habit's month/week view

The home page must not:

* render `RIVER_WEEK_SLOTS`
* call `renderWeekRiverOverlay`
* show month controls
* show week controls
* show date range labels
* show lotus, leaves, stones, or ripples as habit status objects
* show one selected habit's execution state

---

## 8. Today Record Popover

Popover trigger:

```text
今日记录
```

Popover requirements:

* fixed height
* floating above the stage
* does not replace the whole page
* shows today's habits
* scrolls internally if there are many habits
* can close without saving
* saving writes to `localStorage`
* saving may refresh the habit list, but must not render weekly river objects on home

If the user later opens `detail.html`, the saved record should appear there.

---

## 9. Home State Management

Recommended in-memory state:

```js
{
  habits: [],
  isTodayPopoverOpen: false,
  railScrollFrame: 0,
  railScrollVelocity: 0
}
```

Persistent state:

```text
habitGarden.habits
habitGarden.selectedHabitId
```

`selectedHabitId` is used for navigation into detail, not for rendering a home week view.

---

## 10. Responsive Behavior

Desktop:

* habit list floats left
* intro card sits near the middle-right
* river background remains the main visual

Tablet:

* habit list can narrow
* intro card can move closer to center

Mobile:

* habit list and intro card stack vertically
* today record popover becomes bottom sheet style

---

## 11. Acceptance Notes

Home implementation is acceptable when:

* it uses the fixed river background
* it shows the top navigation
* it shows a bounded left habit list
* it shows a compact intro card
* clicking a habit opens `detail.html`
* plus/add opens `create.html`
* today record popover opens and saves records
* the home page does not render weekly or monthly record objects
* the home page does not call `RIVER_WEEK_SLOTS` or `renderWeekRiverOverlay`
* no tree/branch/trunk visual appears as the primary system
* the page still works by directly opening `index.html`
