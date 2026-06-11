# River Stage Habit System

## 1. Purpose

The River Stage Habit System is the new primary visual system for Habit Garden.

It replaces the old habit tree direction. It should guide future implementation of the home page, detail page, daily record UI, and shared river components.

Core rule:

```text
The river background creates atmosphere. Real habit data is rendered only through overlay objects.
```

The background image must not encode habit count, completion count, streaks, growth, level, or progress.

---

## 2. Deprecated Systems

Do not implement or revive:

* old habit tree / tree growth system
* branch / trunk / tree renderer as home visual
* `tree-layout-registry` calibration
* dynamic branch stitching
* tree rings
* Three.js plant growing
* watering plants
* realistic tree assembly

If old file names remain, treat them as historical containers until renamed in a later cleanup.

---

## 3. Stage Layers

The river stage is composed of fixed layers:

1. **Base page layer**: body background and top navigation.
2. **River background layer**: one fixed local image or CSS-backed visual.
3. **Atmosphere layer**: optional static mist, light, or soft texture.
4. **Data object layer**: daily river objects generated from records.
5. **Interaction layer**: tooltips, selected-day outline, focus rings.
6. **Floating panel layer**: habit list, motto panel, today record panel, detail panel.

Only layer 4 and above may react to habit data.

Stage rules from the original product request:

* Use one river background image as the shared visual stage.
* Do not stack multiple rivers for multiple habits.
* Home can show a left habit rail; detail should not show that rail.
* Home is the project and habit entry page; it does not render selected habit records on the river.
* Detail shows one selected month/week for the selected habit.
* Today record is available from the top navigation on both home and detail.
* Detail right drawer contains current plan, heatmap, and single-day detail.

---

## 4. Status Mapping

Record status values are stable across home, detail, review, and storage.

| Stored status | User-facing label | River object | Meaning |
| --- | --- | --- | --- |
| `real` | 完成 | Lotus | Real action happened |
| `entry` | 入场 | Dark green small leaf | Entry action happened |
| `downgrade` | 降级 | Light green small leaf | A lighter version happened |
| `missed` | 未发生 | Small stone | It did not happen today |
| no record | 还没有记录 | Faint placeholder ripple | No record for that day |

Do not use red, warning icons, error copy, or broken visuals for `missed`.

---

## 5. River Week Slots

Each day maps to one fixed point on the river stage.

Implementation should define one reusable weekly slot registry:

```js
const RIVER_WEEK_SLOTS = [
  { slot: 1, x: 36, y: 90 },
  { slot: 2, x: 49, y: 80 },
  { slot: 3, x: 62, y: 78 },
  { slot: 4, x: 73, y: 60 },
  { slot: 5, x: 62, y: 45 },
  { slot: 6, x: 48, y: 40 },
  { slot: 7, x: 38, y: 30 }
];
```

Rules:

* `x` and `y` are percentages relative to the river stage.
* Points are fixed and deterministic.
* Points do not move based on status.
* Define only 7 slots.
* Detail uses `RIVER_WEEK_SLOTS`.
* The selected year, month, and week decide which actual dates map onto the 7 slots in detail.
* Week 1 is day 1-7, week 2 is day 8-14, week 3 is day 15-21, week 4 is day 22-28, and week 5 is day 29 through month end.
* If a month has 28 days, it has only 4 weeks.
* If a month has 29, 30, or 31 days, week 5 shows only the actual remaining days.
* Do not render 31 points across the background at the same time.
* Do not write month, week, or date text into the background image; render them as front-end overlays.
* If the viewport is too small, keep the point percentages but scale object size down.

The point registry replaces the old tree-layout calibration approach.

---

## 6. Data Model

Habit object:

```js
{
  id: "habit_001",
  wish: "减少熬夜后的疲惫感",
  reason: "最近学习效率下降",
  goldenBehavior: "晚饭后坐到书桌前",
  microHabitType: "scene-transition",
  entryAction: "打开台灯并坐下",
  realAction: "学习 10 分钟",
  prompt: "晚饭后回到宿舍",
  promptSentence: "当我晚饭后回到宿舍之后，我就打开台灯并坐下。",
  promptStrength: "visual-light",
  trialDays: 3,
  createdAt: "2026-06-10",
  records: [
    {
      date: "2026-06-10",
      status: "entry",
      reason: "",
      note: "完成了入场动作",
      updatedAt: "2026-06-10T20:10:00.000Z"
    }
  ],
  adjustments: []
}
```

Recommended localStorage keys:

```text
habitGarden.habits
habitGarden.selectedHabitId
habitGarden.homeSelectedMonth
habitGarden.detailSelectedWeek
habitGarden.todayRecordDraft
```

---

## 7. Record Upsert Flow

When a user records today:

1. Resolve today's ISO date.
2. Resolve target habit.
3. Find an existing record with the same date.
4. If found, update `status`, `reason`, `note`, and `updatedAt`.
5. If not found, append a new record.
6. Save the full habits array to `localStorage`.
7. Re-render visible river objects for affected views.

There should be only one record per habit per date.

---

## 8. Home Data Flow

Home renders:

* the fixed river background
* all habits in the left list
* a compact project intro card
* today record popover when requested

Home does not render weekly or monthly record objects. Clicking a habit saves its ID to `localStorage` and opens `detail.html`.

Data pipeline:

```text
localStorage habits
-> habit list items
-> click habit
-> selectedHabitId
-> detail.html
```

View model shape:

```js
{
  date: "2026-06-10",
  day: 10,
  status: "entry",
  objectType: "leaf-dark",
  label: "入场",
  note: "完成了入场动作",
  x: 46,
  y: 55
}
```

---

## 9. Detail Data Flow

Detail renders:

* selected habit
* selected month
* selected week
* week river objects
* current plan module
* execution heatmap module
* single-day detail module
* today record popover focused on the current habit when opened from detail

Data pipeline:

```text
localStorage habits
-> selected habit
-> selected month records
-> selected week dates
-> river object view models
-> heatmap cells
-> selected day detail
```

The detail page should never show records from multiple habits at the same time.

For a selected week, render at most 7 day objects. If the selected week crosses month boundaries, render only the actual days inside the selected month.

---

## 10. Object Rendering

River objects can be implemented as DOM elements, CSS shapes, inline SVG, or local SVG assets.

Requirements:

* each object is keyboard focusable if clickable
* each object has an accessible label
* selected state is visible but soft
* hover/focus does not shift layout
* object size is stable across statuses
* placeholder ripples are visible but quiet

Avoid realistic asset complexity. The objects should be symbolic and readable.

---

## 11. Empty and Edge States

No habits on home:

* show river background
* show project intro card
* show action to create first habit

Habits exist on home:

* show habit list
* show project intro card
* clicking a habit opens detail

Selected habit has no records in the selected week:

* show placeholder ripples only for actual dates in that week
* show short copy: `这个月还很安静。`

Record date outside selected month:

* do not render on the selected week river
* keep it available for heatmap/review

---

## 12. Accessibility

Minimum requirements:

* top navigation uses semantic links/buttons
* today record popover traps focus while open if implemented as modal-like panel
* river objects have `aria-label`
* status is not communicated by color alone
* tooltips are not the only place where record details exist
* reduced-motion preference should disable non-essential animation

---

## 13. Implementation Notes

This system must remain static:

* HTML
* CSS
* vanilla JavaScript
* localStorage
* direct `index.html` opening

Do not add:

* npm
* bundlers
* frameworks
* backend services
* remote assets required for core rendering
