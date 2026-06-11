# River Component Specification

## 1. Purpose

This document defines reusable components for the River Stage Habit System.

Components should be implemented with:

* HTML
* CSS
* vanilla JavaScript
* localStorage-backed state

No React, Vue, Next, npm, backend, or build step.

---

## 2. Component List

Required river components:

1. `RiverStage`
2. `HabitListPanel`
3. `MottoPanel`
4. `RiverObject`
5. `RiverTooltip`
6. `TodayRecordPopover`
7. `StatusPicker`
8. `OptionalReasonNote`
9. `RightDetailPanel`
10. `CurrentPlanModule`
11. `ExecutionHeatmap`
12. `SingleDayDetail`
13. `PointerAutoScrollRail`

These can be implemented as functions that create DOM nodes. They do not need framework component syntax.

---

## 3. `RiverStage`

Responsibility:

* render the fixed river background
* provide positioning container for river objects
* expose object layer and tooltip layer

Inputs:

```js
{
  mode: "home" | "detail",
  objects: [],
  selectedDate: null
}
```

Rules:

* background is data-independent
* object positions use percentages
* object layer does not shift layout
* stage can scale responsively
* home and detail both render one selected month/week at a time
* use `RIVER_WEEK_SLOTS`, not a full-month slot registry

---

## 4. `HabitListPanel`

Responsibility:

* render habits
* select a habit
* show create-new entry

Inputs:

```js
{
  habits: [],
  selectedHabitId: null
}
```

Events:

```text
onSelectHabit(habitId)
onCreateHabit()
```

Required item fields:

* wish/title
* micro-habit summary
* today status if any

Visual rules:

* Render as a light vertical habit rail.
* Keep habit text separate from the vertical line.
* Put the plus/add control below the scroll region.
* The add control calls `onCreateHabit()` and should navigate to `create.html`.
* Use `PointerAutoScrollRail` when the habit count exceeds the visible range.

---

## 5. `MottoPanel`

Responsibility:

* show core message when no habit is selected
* provide create action

Copy:

```text
把今天发生的，轻轻放在河面上。
不用追赶。先看见一个容易发生的小动作。
```

Action:

```text
设计一个小习惯
```

---

## 6. `RiverObject`

Responsibility:

* represent one date
* map status to visual object
* support hover/focus/click

Input:

```js
{
  date: "2026-06-10",
  day: 10,
  status: "entry",
  objectType: "leaf-dark",
  label: "入场",
  note: "",
  x: 42,
  y: 58,
  selected: false
}
```

Object type mapping:

| Status | `objectType` |
| --- | --- |
| `real` | `lotus` |
| `entry` | `leaf-dark` |
| `downgrade` | `leaf-light` |
| `missed` | `stone` |
| no record | `ripple` |

Accessibility:

* focusable when clickable
* `aria-label` includes date and status
* selected state is not color-only

The `x` and `y` coordinates should come from `RIVER_WEEK_SLOTS`. The registry has exactly 7 slots, and each selected week maps its actual dates to slot 1 through slot 7 in order.

---

## 7. `RiverTooltip`

Responsibility:

* show compact date/status detail
* follow hovered/focused object
* disappear on blur/mouseleave

Content:

```text
6 月 10 日：入场
```

If note exists:

```text
6 月 10 日：入场
完成了入场动作
```

Do not make the tooltip the only access to record detail.

---

## 8. `TodayRecordPopover`

Responsibility:

* show today's record workflow
* list habits
* collect status and optional note/reason
* save records

Inputs:

```js
{
  habits: [],
  today: "2026-06-11",
  drafts: {}
}
```

Events:

```text
onSaveRecord(habitId, record)
onClose()
```

Layout:

* fixed height
* internal scrolling
* one row/card per habit
* no full-page takeover on desktop
* can be opened from home for all habits
* can be opened from detail focused on the current habit

---

## 9. `StatusPicker`

Responsibility:

* choose one of four statuses

Options:

| Label | Status |
| --- | --- |
| 完成 | `real` |
| 入场 | `entry` |
| 降级 | `downgrade` |
| 未发生 | `missed` |

Rules:

* one selected status at a time
* selection is visible beyond color
* does not use success/failure language

---

## 10. `OptionalReasonNote`

Responsibility:

* collect optional reason and note after a status choice
* allow skipping

For all statuses, show:

```text
想留下一点想法吗？
```

For `missed`, also show:

```text
今天卡在哪里？
```

Reason options:

```text
忘记了
太累了
时间不合适
动作太大
环境不支持
突发事件
情绪低落
不想记录原因
```

---

## 11. `RightDetailPanel`

Responsibility:

* hold detail modules
* collapse and expand
* preserve selected-day context

Inputs:

```js
{
  habit: {},
  selectedDate: null,
  selectedMonth: "2026-06",
  selectedWeekIndex: 0,
  collapsed: false
}
```

Modules:

* `CurrentPlanModule`
* `ExecutionHeatmap`
* `SingleDayDetail`

Rules:

* Collapsed arrow points right.
* Expanded arrow points left.
* Preserve selected day when toggling.
* Keep current plan and heatmap modules visually balanced in height.
* Use internal scrolling for long plan text, heatmap content, notes, or reasons.

---

## 12. `CurrentPlanModule`

Shows:

* wish
* golden behavior
* entry action
* real action
* prompt sentence
* latest adjustment

Actions:

```text
调轻一点
换提示点
先保留观察
```

Actions can be mock interactions in the static prototype.

The required modify-plan action should navigate to `create.html` and later preload the current habit plan.

---

## 13. `ExecutionHeatmap`

Responsibility:

* show month-level pattern
* support hover/focus detail
* highlight selected week/day

Input:

```js
{
  records: [],
  selectedMonth: "2026-06",
  selectedWeekIndex: 0,
  selectedDate: "2026-06-10"
}
```

Rules:

* contribution-like structure
* soft organic color palette
* no scoring copy
* no harsh axes
* no dashboard framing

---

## 14. `SingleDayDetail`

Responsibility:

* show selected day's record detail
* provide gentle suggestion

Fields:

* date
* status label
* reason
* note
* suggestion

Default copy:

```text
点选河面上的一天，看看它留下了什么。
```

If note or reason content is long, the detail area should scroll internally instead of stretching the right drawer.

---

## 15. `PointerAutoScrollRail`

Responsibility:

* support the left habit list's no-heavy-scrollbar behavior
* scroll by pointer position inside a bounded list area

Behavior:

* pointer in upper half scrolls upward
* pointer in lower half scrolls downward
* pointer near center slows or stops
* pointer leaving the rail stops auto-scroll
* wheel and keyboard scrolling remain available

Do not hide content permanently. Items that scroll out above should disappear softly; items below should appear softly.

---

## 16. Shared Utilities

Recommended utility functions:

```js
getHabits()
saveHabits(habits)
getSelectedHabitId()
setSelectedHabitId(id)
upsertHabitRecord(habitId, record)
getMonthDates(year, month)
getMonthWeeks(year, monthIndex)
mapRecordToRiverObject(record, point)
formatDateLabel(date)
```

`getMonthWeeks(year, monthIndex)` must split by month day ranges, not weekday boundaries: days 1-7, 8-14, 15-21, 22-28, and 29-monthEnd when present.

Keep utilities small and readable.

---

## 17. Acceptance Notes

Component implementation is acceptable when:

* components are plain DOM/CSS/JS
* status mapping is consistent everywhere
* today record writes to localStorage
* home and detail use the same object mapping
* the habit rail supports pointer-directed auto-scroll
* detail drawer modules handle overflow internally
* no component assumes tree growth, branch layout, or Three.js
