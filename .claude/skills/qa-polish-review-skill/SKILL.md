---
name: qa-polish-review-skill
description: Use this skill when reviewing the final prototype, checking quality, polishing code, verifying static operation, checking river-stage UX consistency, today record popover behavior, detail drawer and heatmap behavior, old tree-system residue, low-pressure copy, or preparing final delivery.
---

# QA Polish Review Skill

## Purpose

Use this skill for final review and polishing.

The goal is to ensure the prototype is:

* static
* runnable
* coherent
* visually polished
* low-pressure
* aligned with the Fogg model
* aligned with the River Stage Habit System

## Static Function Check

Verify:

* `index.html` opens directly.
* All page links work.
* No backend is required.
* No build step is required.
* No npm command is required.
* No framework dependency exists.
* JavaScript does not throw console errors.
* `localStorage` flow works.

## River Stage Check

Verify:

* Home uses one fixed river background as the stage.
* The river background is atmospheric only and does not encode real data.
* Habit data appears as overlay markers.
* The top navigation keeps `花园 / 设计 / 复盘 / 探索 / 今日记录`.
* The left floating habit selector exists.
* The habit selector can scroll without an obvious heavy scrollbar.
* The habit selector uses a vertical rail and text does not intersect the rail.
* Pointer position inside the rail can drive auto-scroll when content overflows.
* The plus/add control navigates to `create.html`.
* No selected habit shows the motto floating panel.
* Selecting a habit hides the motto and shows current-month markers.
* Daily objects use fixed positions and do not shift layout.

## Status Mapping Check

Verify the same mapping appears everywhere:

| Status | Object |
| --- | --- |
| `real` | 莲花 |
| `entry` | 深绿色小叶片 |
| `downgrade` | 浅绿色小叶片 |
| `missed` | 小石头 |
| no record | 淡淡占位波纹 |

Check:

* `missed` is not red.
* `missed` is not described as failure.
* status is not communicated by color alone.
* objects remain stable in size.

## Today Record Popover Check

Verify:

* `今日记录` opens a fixed-height floating popover.
* The popover keeps the river stage visible behind it.
* Today's habits are listed.
* Each habit can choose `完成 / 入场 / 降级 / 未发生`.
* Optional `note` can be written or skipped.
* Optional `reason` can be written or skipped.
* Choosing `未发生` asks `今天卡在哪里？`.
* Saving upserts today's record instead of appending duplicates.
* The selected habit's visible river marker updates after save.

## Detail Page Check

Verify:

* Detail uses the same river background as home.
* Detail keeps the top navigation.
* Detail shows one habit only.
* Month selection exists.
* Week selection exists.
* The selected week shows at most 7 day objects.
* A partial week shows only actual days in the selected month.
* The right drawer can collapse and expand.
* Collapsed drawer arrow points right.
* Expanded drawer arrow points left.
* The drawer includes current plan.
* Current plan includes a modify-plan action returning to `create.html`.
* The drawer includes a soft execution heatmap.
* The drawer includes single-day detail.
* Drawer modules scroll internally when content is long.
* The heatmap references contribution structure without looking like an engineering dashboard.
* `今日记录` on detail can record today's current habit and immediately update the river marker and heatmap.

## Old Tree-System Residue Check

Search implementation and UI for old direction residue:

```text
habit tree
tree growth
branch
trunk
tree renderer
tree-layout-registry
branch stitching
tree ring
watering
plant growing
Three.js
```

Allowed only when clearly documented as deprecated. Not allowed in active UI, runtime logic, primary visual copy, or new implementation comments.

## Page Check

### Creation Page

Check:

* curve has six nodes
* curve reveals gradually
* each step has one question
* user can go back
* candidate behavior cards work
* focus map or selection works
* micro-habit generation works
* natural prompt sentence works
* save button creates habit
* save flow places the habit into the river system, not onto a tree

### Review Page

Check:

* MAP cards exist
* review is concise
* no dashboard overload
* suggestion is actionable

### Explore Page

Check:

* inspiration cards exist
* gentle trace wall exists
* no ranking
* no comparison pressure

## UX Check

The prototype should feel like:

```text
river stage
behavior design
gentle adjustment
low-pressure return
```

It should not feel like:

```text
check-in dashboard
KPI tracker
discipline app
ranking system
survey form
tree growth game
```

## Visual Check

Check:

* consistent color palette
* consistent border radius
* consistent shadows
* enough whitespace
* river stage is visible
* lotus, leaves, stones, ripples, curve, and cards feel related
* no harsh red failure color
* no excessive visual noise

## Motion Check

Check:

* animations are calm
* page transitions are smooth
* hover effects are subtle
* marker appear motion is gentle
* drawer motion is not distracting
* no confetti
* no shaking error
* no loud celebration
* no motion that blocks interaction

## Copy Check

Check that UI does not use:

```text
失败
清零
惩罚
战胜自己
你太棒了
落后别人
```

Check that UI uses copy like:

```text
今天卡在哪里？
今天只做第一步也可以。
这也会留下来。
把今天发生的，轻轻放在河面上。
```

## Fogg Model Check

Verify that the prototype represents:

* Motivation through wish and reason
* Ability through micro-habit and downgrade
* Prompt through natural anchor
* Behavior through daily record
* Iteration through adjustment and review

## Final Output Format

When reporting QA results, use:

```text
发现的问题：
1.
2.
3.

已修复：
1.
2.
3.

仍需注意：
1.
2.
3.
```

Do not claim success if a feature was not checked.

Do not introduce new large features during QA unless necessary.
