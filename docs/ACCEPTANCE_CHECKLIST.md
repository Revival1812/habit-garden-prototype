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

## 2. File Structure

* [ ] Required HTML files exist.
* [ ] Required CSS files exist.
* [ ] Required JS files exist.
* [ ] Required data files exist.
* [ ] Required docs files exist.
* [ ] Required skill files exist.
* [ ] File names match the planned structure.

## 3. Home Page

* [ ] Empty state shows seed, soil, or small tree.
* [ ] Empty state has short copy.
* [ ] Empty state has three user-state chips.
* [ ] Create button navigates to `create.html`.
* [ ] Existing state shows habit tree.
* [ ] Habit branches represent habits.
* [ ] Leaves represent daily records.
* [ ] Branch click navigates to `detail.html`.
* [ ] Leaf hover shows simple detail.
* [ ] Yellow leaf is not presented as failure.
* [ ] Home page does not look like dashboard.

## 4. Creation Page

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

## 5. Detail Page

* [ ] Selected habit can be read from `localStorage`.
* [ ] Habit summary is displayed.
* [ ] Entry action is displayed.
* [ ] Real action is displayed.
* [ ] Prompt sentence is displayed.
* [ ] Daily record options exist.
* [ ] Real action creates green leaf.
* [ ] Entry action creates pale leaf.
* [ ] Downgrade creates bud or light state.
* [ ] Missed day creates yellow leaf.
* [ ] Missed day asks “今天卡在哪里？”
* [ ] No red failure warning appears.

## 6. Review Page

* [ ] Review page includes Motivation card.
* [ ] Review page includes Ability card.
* [ ] Review page includes Prompt card.
* [ ] Review page includes pattern insight.
* [ ] Review page includes next adjustment suggestion.
* [ ] Page is concise.
* [ ] Page does not look like a KPI dashboard.

## 7. Explore Page

* [ ] Explore page includes behavior inspiration cards.
* [ ] Explore page includes anonymous glow wall.
* [ ] No ranking is shown.
* [ ] No comparison percentage is shown.
* [ ] No familiar-social pressure is shown.

## 8. Visual Design

* [ ] Overall style feels like a habit garden.
* [ ] Color palette is soft and natural.
* [ ] Red is not used as failure color.
* [ ] Cards have consistent rounded corners.
* [ ] Shadows are soft.
* [ ] Tree, branch, leaf, curve, and glow visuals are consistent.
* [ ] Visual hierarchy is clear.
* [ ] Page has enough whitespace.

## 9. Motion Design

* [ ] Page fade-in exists.
* [ ] Cards have hover feedback.
* [ ] Buttons have press feedback.
* [ ] Curve reveal is animated.
* [ ] Nodes have soft active state.
* [ ] Leaves appear with gentle motion.
* [ ] Yellow leaf appears calmly.
* [ ] No excessive celebration animation.
* [ ] No shaking error animation.

## 10. Copywriting

* [ ] Text is short.
* [ ] Each screen has one main sentence.
* [ ] No long theoretical explanation.
* [ ] No “失败”.
* [ ] No “清零”.
* [ ] No “战胜自己”.
* [ ] No exaggerated praise.
* [ ] Copy feels low-pressure.
* [ ] Copy guides action clearly.

## 11. Fogg Model Representation

* [ ] Motivation is represented through wish and reason.
* [ ] Ability is represented through micro-habit and downgrade.
* [ ] Prompt is represented through natural anchor.
* [ ] Failure diagnosis maps to MAP.
* [ ] The product feels like behavior design, not task tracking.

## 12. Final Pass

* [ ] Open all pages manually.
* [ ] Check browser console.
* [ ] Test basic localStorage flow.
* [ ] Create one habit.
* [ ] Return to home.
* [ ] Open habit detail.
* [ ] Record one real action.
* [ ] Record one missed day.
* [ ] Confirm tree state updates.
* [ ] Confirm no page is text-heavy.
