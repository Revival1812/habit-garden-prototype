# Acceptance Checklist

## 1. Static Prototype

* [ ] `index.html` can be opened directly in a browser.
* [ ] No backend is required.
* [ ] No database is required.
* [ ] No npm install is required.
* [ ] No build step is required.
* [ ] No React/Vue/Next framework is used.
* [ ] Core interactions work with vanilla JavaScript.
* [ ] Local state uses `localStorage`.

---

## 2. File Structure

* [ ] Required HTML files exist.
* [ ] Required CSS files exist.
* [ ] Required JS files exist.
* [ ] Required data files exist.
* [ ] Required docs files exist.
* [ ] River docs exist:
  * [ ] `docs/RIVER_STAGE_SYSTEM.md`
  * [ ] `docs/RIVER_HOME_SPEC.md`
  * [ ] `docs/RIVER_DETAIL_SPEC.md`
  * [ ] `docs/RIVER_COMPONENT_SPEC.md`
* [ ] No framework or build-tool files are required.

---

## 3. Deprecated Direction Guardrail

* [ ] Home page does not use habit tree as the main visual.
* [ ] No trunk / branch renderer is used as the main visual.
* [ ] No `tree-layout-registry` calibration workflow is required.
* [ ] No dynamic branch stitching is required.
* [ ] No tree rings are used for progress history.
* [ ] No Three.js plant-growing scene is required.
* [ ] No watering interaction is used as the central daily record action.

---

## 4. Home Page - River Stage

* [ ] Home page uses one fixed river background image as the stage.
* [ ] River background is atmospheric only and does not encode real data.
* [ ] Top navigation includes `花园 / 设计 / 复盘 / 探索 / 今日记录`.
* [ ] Habit list appears in a left floating area.
* [ ] Habit list is styled as a light vertical rail, not a dashboard list.
* [ ] Habit text does not intersect the vertical line.
* [ ] Overflowing habit list auto-scrolls by pointer position.
* [ ] Habit list does not show an obvious heavy scrollbar.
* [ ] Plus/add control sits below the habit rail and opens `create.html`.
* [ ] No-selected-habit state shows a core motto floating panel.
* [ ] Selecting a habit hides the motto panel.
* [ ] Selected habit shows current-month records on fixed river points.
* [ ] Each day maps to one river object.
* [ ] `real` renders as lotus.
* [ ] `entry` renders as dark green small leaf.
* [ ] `downgrade` renders as light green small leaf.
* [ ] `missed` renders as small stone.
* [ ] No record renders as faint placeholder ripple.
* [ ] River object hover/focus shows simple detail.
* [ ] Home page does not look like a dashboard.

---

## 5. Today Record Popover

* [ ] `今日记录` opens a fixed-height floating panel.
* [ ] Panel keeps the river stage visible behind it.
* [ ] Panel lists today's habits.
* [ ] Panel scrolls internally when habit count is high.
* [ ] Panel height does not grow indefinitely.
* [ ] Each habit can select one of four statuses:
  * [ ] 完成
  * [ ] 入场
  * [ ] 降级
  * [ ] 未发生
* [ ] Optional reason/thought can be written.
* [ ] Optional reason/thought can be skipped.
* [ ] If no status is selected, the date remains unrecorded.
* [ ] Status selection writes to that habit's date record.
* [ ] Saving updates `localStorage`.
* [ ] Selected habit's river object updates after save.
* [ ] Missing day copy asks `今天卡在哪里？`.
* [ ] No red failure warning appears.

---

## 6. Creation Page

* [ ] Creation page uses behavior design curve.
* [ ] Curve has six nodes.
* [ ] Curve reveals gradually.
* [ ] Each step has one main question.
* [ ] User can go back to completed nodes.
* [ ] Wish step works.
* [ ] Motivation step works.
* [ ] Candidate behavior cards work.
* [ ] Focus map or equivalent selection works.
* [ ] Golden behavior can be selected.
* [ ] Micro-habit can be generated.
* [ ] Natural prompt sentence can be generated.
* [ ] Three-day trial plan is shown.
* [ ] Habit can be saved to `localStorage`.
* [ ] Saving returns to home page.
* [ ] Save copy uses river language, not tree language.

---

## 7. Detail Page - River Detail

* [ ] Detail page uses the same river background as home.
* [ ] Detail page keeps the top navigation including `今日记录`.
* [ ] Detail page shows only the selected habit.
* [ ] Detail page supports selected month and selected week.
* [ ] Selected week renders at most 7 day objects.
* [ ] Partial week renders only actual days inside the selected month.
* [ ] Week records render on fixed river points.
* [ ] Status visual mapping matches home.
* [ ] Right floating panel exists.
* [ ] Right floating panel can collapse and expand.
* [ ] Collapsed drawer arrow points right.
* [ ] Expanded drawer arrow points left.
* [ ] Current plan module exists.
* [ ] Current plan module includes a modify-plan action that returns to `create.html`.
* [ ] Execution heatmap module exists.
* [ ] Single-day detail module exists.
* [ ] Drawer modules use internal scrolling for long content.
* [ ] Heatmap references contribution structure but feels soft and non-engineering.
* [ ] Single-day detail shows date, status, reason/note if present.
* [ ] `今日记录` on detail can record today's current habit and update the detail background.
* [ ] No failure language appears for missed days.

---

## 8. Review Page

* [ ] Review page includes Motivation card.
* [ ] Review page includes Ability card.
* [ ] Review page includes Prompt card.
* [ ] Review page includes pattern insight.
* [ ] Review page includes next adjustment suggestion.
* [ ] Page is concise.
* [ ] Page does not look like a KPI dashboard.

---

## 9. Explore Page

* [ ] Explore page includes behavior inspiration cards.
* [ ] Explore page includes gentle trace wall.
* [ ] No ranking is shown.
* [ ] No comparison percentage is shown.
* [ ] No familiar-social pressure is shown.

---

## 10. Visual Design

* [ ] Overall style feels like a calm river stage.
* [ ] Color palette is soft and natural.
* [ ] Red is not used as failure color.
* [ ] Cards and floating panels are consistent.
* [ ] Shadows are soft.
* [ ] River objects are visually consistent.
* [ ] Visual hierarchy is clear.
* [ ] Page has enough whitespace.
* [ ] Floating panels do not cover each other incoherently.

---

## 11. Motion Design

* [ ] Page fade-in exists.
* [ ] Floating panels have gentle open/close motion.
* [ ] Cards have hover feedback.
* [ ] Buttons have press feedback.
* [ ] River objects appear gently.
* [ ] Placeholder ripples are subtle.
* [ ] Tooltip fade works.
* [ ] No excessive celebration animation.
* [ ] No shaking error animation.
* [ ] No plant growth pressure animation.

---

## 12. Copywriting

* [ ] Text is short.
* [ ] Each screen has one main sentence.
* [ ] No long theoretical explanation.
* [ ] No `失败`.
* [ ] No `清零`.
* [ ] No `战胜自己`.
* [ ] No `你太棒了`.
* [ ] No tree-growth copy in the river stage.
* [ ] Copy feels low-pressure.
* [ ] Copy guides action clearly.

---

## 13. Fogg Model Representation

* [ ] Motivation is represented through wish and reason.
* [ ] Ability is represented through micro-habit and downgrade.
* [ ] Prompt is represented through natural anchor.
* [ ] Missed-day diagnosis maps to MAP.
* [ ] The product feels like behavior design, not task tracking.

---

## 14. Final Pass

* [ ] Open all pages manually.
* [ ] Check browser console.
* [ ] Test basic localStorage flow.
* [ ] Create one habit.
* [ ] Return to home.
* [ ] Select one habit from the left list.
* [ ] Open today record popover.
* [ ] Record one `real` day.
* [ ] Record one `missed` day.
* [ ] Confirm river stage updates.
* [ ] Open habit detail.
* [ ] Collapse and expand the right panel.
* [ ] Confirm no page is text-heavy.
