---
name: river-stage-ui-skill
description: Use this skill whenever implementing, modifying, or reviewing the River Stage Habit System, including index.html river home, detail.html river detail, fixed river background, dynamic overlay markers, habit selector, selected month/week river view, today record popover, collapsible detail drawer, river object status mapping, and removal of old tree renderer or branch-growth behavior.
---

# River Stage UI Skill

## Purpose

Use this skill to keep the prototype aligned with the new River Stage Habit System.

The river stage is now the primary visual system. It replaces the old habit tree, branch growth, tree renderer, and plant-growing directions.

Core model:

```text
fixed river background + habit entry panels + low-pressure habit records in detail
```

## Required Context

Before implementing river pages, read:

1. `CLAUDE.md`
2. `docs/RIVER_STAGE_SYSTEM.md`
3. `docs/RIVER_HOME_SPEC.md`
4. `docs/RIVER_DETAIL_SPEC.md`
5. `docs/RIVER_COMPONENT_SPEC.md`
6. `.claude/skills/static-prototype-code-skill/SKILL.md`
7. `.claude/skills/low-text-copy-skill/SKILL.md`

Also use `visual-garden-ui-skill` for visual polish and `qa-polish-review-skill` for final checks.

## System Positioning

The river system must include:

* fixed river background
* habit selector
* home habit entry view
* selected month/week river view in detail
* weekly detail view
* today record popover
* collapsible detail drawer

The background provides mood only. It must not encode data, progress, habit count, completion count, streak, level, or growth.

Only detail overlay markers and floating panels may respond to habit records. Home remains an entry page and does not render record markers.

## Static Prototype Constraints

Keep the implementation static:

* HTML
* CSS
* vanilla JavaScript
* `localStorage`
* direct `index.html` opening

Do not introduce:

* React
* Vue
* Next
* npm build flow
* backend
* database
* complex server APIs

## Home Rules

The home page must use this structure:

```text
top navigation
left floating habit selector
fixed river stage
  left habit selector
  project intro card
today record popover
```

Rules:

* Home shows the fixed river background, left habit selector, and project intro card.
* Home does not show a selected habit's selected month/week records.
* Clicking a habit saves its ID and opens `detail.html`.
* The left floating habit list must support automatic scrolling without an obvious heavy scrollbar.
* The habit selector should read as a vertical rail; text must not intersect the rail line.
* Pointer in the upper half of the rail scrolls up; pointer in the lower half scrolls down.
* The plus/add control in the habit selector must navigate to `create.html`.
* The top navigation must keep `花园 / 设计 / 复盘 / 探索 / 今日记录`.
* `今日记录` should open a fixed-height floating popover on the home page.
* The river background must remain visually stable when records change.
* Do not use `RIVER_WEEK_SLOTS` on home.
* Do not render daily, weekly, or monthly record objects on home.
* Do not show a home habit tree, trunk, branch layout, or generated plant scene.

## Detail Rules

The detail page must use this structure:

```text
top navigation
same fixed river background
month selector
week selector
weekly river markers
right collapsible drawer
  current plan
  soft heatmap
  single-day detail
```

Rules:

* Keep the top navigation.
* Use the same background image or visual system as home.
* Support month and week selection.
* Show at most 7 day objects for the selected week.
* If a week has fewer than 7 actual days in the selected month, show only the actual days.
* Do not calculate river weeks by Monday-Sunday or Sunday-Saturday boundaries; split by month day ranges.
* The right drawer may be hidden/collapsed.
* The hidden/expanded drawer must show the current plan and soft heatmap.
* The heatmap may reference GitHub contributions structurally, but must feel soft and non-engineering.
* Detail must show records for one habit only.
* `今日记录` in detail opens the today record popover focused on the current habit.
* Saving from detail immediately updates the weekly river marker and heatmap.
* Current plan includes a modify-plan action that returns to `create.html`.
* Collapsed drawer arrow points right; expanded drawer arrow points left.
* Drawer modules use internal scrolling for long plan, heatmap, note, or reason content.

## Status Object Mapping

Use this mapping everywhere:

| User label | Stored status | River object |
| --- | --- | --- |
| 完成 | `real` | 莲花 |
| 入场 | `entry` | 深绿色小叶片 |
| 降级 | `downgrade` | 浅绿色小叶片 |
| 未发生 | `missed` | 小石头 |
| 未记录 | no record | 淡淡占位波纹 |

Rules:

* Do not use red or warning styling for `missed`.
* Do not describe `missed` as failure.
* Object size should remain stable across statuses.
* Markers should be keyboard accessible when clickable.
* Status must not be communicated by color alone.

## Record Fields

Each record must support:

```js
{
  date: "2026-06-11",
  status: "real",
  note: "",
  reason: ""
}
```

Required fields:

* `date`
* `status`

Optional fields:

* `note`
* `reason`

There should be only one record per habit per date. Saving today's record should upsert the existing record instead of appending duplicates.

## Today Record Popover

The today record popover must:

* open from `今日记录`
* use fixed height
* show today's habits
* allow status choice per habit
* allow optional note
* allow optional reason
* allow skipping note and reason
* save to the habit's record for today
* update visible river markers after save

Status choices:

```text
完成
入场
降级
未发生
```

If `未发生` is selected, ask:

```text
今天卡在哪里？
```

Allowed reasons:

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

## Forbidden Directions

Do not use:

* old tree branch stitching
* tree renderer
* branch / trunk / tree layout as the home visual
* `tree-layout-registry`
* Three.js
* watering plants
* plant-growing simulation
* multiple stacked rivers for different habits
* complex backend
* React
* Vue
* Next
* framework state management

If old file names still contain `garden`, use them as historical containers only. Do not infer that the home visual should return to a tree.

## Implementation Checklist

Before finishing river work, verify:

* home has fixed river background
* home habit selector exists
* home project intro card exists
* clicking a home habit opens `detail.html`
* home does not render selected-week markers
* plus/add navigates to `create.html`
* today record popover opens and saves records
* detail uses the same river background
* detail shows month/week controls
* detail shows no more than 7 actual day markers
* detail `今日记录` can record today's current habit
* detail drawer collapses and expands
* heatmap is soft, not dashboard-like
* no tree renderer, branch stitching, Three.js, or watering interaction remains in the implemented path
