# River Detail Specification

## 1. Goal

`detail.html` is the focused view for one habit.

It uses the same river background as the home page, but narrows the data scope to:

```text
one habit
one selected month
one selected week
```

The page should help users observe the behavior design, not judge performance.

---

## 2. Page Structure

Required DOM regions:

```text
top navigation
main river detail mount
  river detail stage
    river background
    week record objects
    selected-day tooltip/detail anchor
  right collapsible panel
    current plan module
    execution heatmap module
    single-day detail module
  today record popover
```

Current `detail.html` already provides:

```html
<section id="riverDetailMount" class="river-detail-mount">
  <!-- River detail system will be mounted here later -->
</section>
```

Future implementation should mount the detail system inside this section.

---

## 3. Data Scope

Detail page reads:

* selected habit ID from `localStorage`
* habits array from `localStorage`
* selected month
* selected week
* selected day

It renders records only for the selected habit.

If no habit is selected:

* show quiet empty state
* provide `回到花园`
* do not show fake detail data unless demo mode is explicitly used

---

## 4. River Detail Stage

The river detail stage uses the same background as home.

Differences from home:

* objects represent one selected week by default
* object spacing can be larger
* selected day has a soft outline
* month/week controls are visible
* no left habit list is required

Status mapping stays identical:

| Status | Object |
| --- | --- |
| `real` | Lotus |
| `entry` | Dark green small leaf |
| `downgrade` | Light green small leaf |
| `missed` | Small stone |
| no record | Faint placeholder ripple |

---

## 5. Month and Week Controls

Controls should be compact:

* previous month
* current month and week label
* next month
* week selector

Week selector can be:

* segmented controls
* small chips
* a simple dropdown on mobile

Changing month/week should:

* update river objects
* update heatmap highlight
* clear selected day if outside the new range

Week display rules:

* Show at most 7 day objects for the selected week.
* Week 1 is day 1-7, week 2 is day 8-14, week 3 is day 15-21, week 4 is day 22-28, and week 5 is day 29 through month end.
* If the selected week contains fewer than 7 actual days, show only those actual days.
* If a month has 28 days, expose only 4 weeks.
* If a month has 29, 30, or 31 days, expose week 5 with only the remaining dates.
* Do not create placeholder objects for days outside the selected month.
* Use `RIVER_WEEK_SLOTS`, a fixed 7-slot coordinate registry.
* Do not render a full month of 31 points on the background.

---

## 6. Right Collapsible Panel

The right panel is a floating surface with three modules.

Expanded:

* fixed width on desktop
* internal scroll if content is tall
* does not cover top navigation

Collapsed:

* narrow tab or icon button remains
* river stage gains space
* selected day state is preserved
* arrow points right

Modules:

1. Current plan
2. Execution heatmap
3. Single-day detail

Expanded:

* arrow points left
* current plan and heatmap areas should have consistent visual height
* if content is long, each module scrolls internally instead of stretching the drawer indefinitely

---

## 7. Current Plan Module

Shows:

* wish
* golden behavior
* entry action
* real action
* natural prompt
* latest adjustment
* modify-plan action that returns to `create.html`

Possible actions:

```text
调轻一点
换提示点
先保留观察
```

In the static prototype, actions can show mock confirmation or write a simple adjustment entry to localStorage.

The required modify-plan action should return to `create.html`. A later implementation round can preload the current habit plan for editing.

---

## 8. Execution Heatmap Module

The heatmap references GitHub contributions structurally, but not visually.

It should use:

* small rounded cells
* soft natural colors
* minimal labels
* month/week grouping
* hover/focus detail

It should avoid:

* engineering dashboard style
* hard grid lines
* intense green scale
* scoring language
* contribution count language

Cell mapping can be:

| Status | Cell style |
| --- | --- |
| `real` | soft lotus tint |
| `entry` | dark leaf tint |
| `downgrade` | light leaf tint |
| `missed` | stone tint |
| no record | pale empty cell |

---

## 9. Single-Day Detail Module

Shows selected day:

* date
* status
* status object name
* reason if present
* note if present
* soft suggestion if relevant

Default state when no day is selected:

```text
点选河面上的一天，看看它留下了什么。
```

For `missed`, use:

```text
这一天没有发生。它也会留下来。
```

Do not use:

```text
未达标
中断惩罚
```

---

## 10. Detail Record Editing

First implementation can keep editing in the today record popover only.

If detail editing is added later:

* use the same four statuses
* use the same optional reason/note flow
* upsert one record per date
* keep river and heatmap in sync

Navigation `今日记录` requirement:

* `今日记录` remains visible in the top navigation on detail.
* On detail, it may open the same today record popover focused on the current habit.
* Saving today's current-habit record should immediately update the detail river marker and heatmap.

---

## 11. Responsive Behavior

Desktop:

* right panel floats on the right
* river stage remains the main focus

Tablet:

* right panel can narrow
* heatmap wraps softly

Mobile:

* right panel becomes a bottom drawer
* week controls move above the river stage
* river objects remain tappable

---

## 12. Acceptance Notes

Detail implementation is acceptable when:

* it uses the same river background as home
* it shows only one habit
* it supports month/week scope
* it shows at most 7 actual day objects for the selected week
* it has the three right-panel modules
* the panel can collapse
* the collapsed arrow points right and the expanded arrow points left
* the heatmap is soft and non-engineering
* `今日记录` can record today's current habit from the detail page
* no tree/branch/trunk visual appears as the primary system
