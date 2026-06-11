# Habit Garden Static Prototype

## 1. Current Product Direction

This project is a static web prototype for a low-pressure habit design product based on the Fogg Behavior Model.

The current visual direction is:

```text
Habit Garden + Behavior Design Curve + River Stage Habit System
```

The project no longer uses a habit tree as the home visual. The home page should become a fixed river-background stage. Habits and daily records are shown as soft overlays on top of the river, not as branches, trunks, tree rings, or generated plant growth.

The product is not a traditional check-in app. It should not pressure users to keep streaks, force discipline, or recover from "failure". Its core purpose is to help users design behaviors that are easier to happen, then leave visible traces in a gentle environment.

The prototype should guide users through a low-pressure behavior design process:

1. Clarify a wish.
2. Identify why the wish matters now.
3. Explore possible behaviors.
4. Select a golden behavior using a focus map.
5. Convert the golden behavior into a micro-habit.
6. Bind the micro-habit to a natural prompt.
7. Place the habit into the river stage.
8. Record behavior traces without shame.
9. Adjust the plan when interruption happens.
10. Help users return without judgment.

---

## 2. Deprecated Directions

The following directions are explicitly deprecated and must not be reintroduced as the home visual system:

* old habit tree / tree growth system
* branch / trunk / tree renderer as the home page main visual
* `tree-layout-registry` calibration workflow
* dynamic branch stitching or branch growth rendering
* tree rings as progress history
* multiple river systems competing for habit data
* Three.js plant-growing or watering simulation
* realistic trunk / realistic branch composition
* watering plants as the central habit interaction

Existing files may still contain names such as `garden` for historical reasons, but new implementation work should follow the river stage specs in `docs/RIVER_STAGE_SYSTEM.md`.

---

## 3. Core Design Philosophy

### 3.1 Product Positioning

The product should communicate:

```text
This is not a check-in app.
This is a behavior design assistant.
```

The interface should translate the Fogg Behavior Model into simple user actions.

Instead of saying:

```text
Behavior = Motivation + Ability + Prompt
```

The interface should help users understand:

```text
I want to do it.
I can do it.
I can remember to do it.
```

### 3.2 What the Product Should Emphasize

The prototype should emphasize:

* lower friction
* natural prompts
* golden behavior selection
* micro-habit design
* visible traces
* gentle recovery
* no-shame return
* quiet progress
* behavior adjustment
* one stable visual stage instead of simulated growth pressure

### 3.3 What the Product Should Avoid

The prototype must avoid:

* streak pressure
* reset punishment
* red failure warnings
* public ranking
* familiar-social supervision
* exaggerated celebration
* dense forms
* dashboard-like KPI panels
* long educational explanations
* traditional task management style
* tree growth language such as branch, trunk, tree ring, watering, or plant upgrade

---

## 4. Technical Constraints

This is a static prototype.

Hard constraints:

* Use only HTML, CSS, and vanilla JavaScript.
* The project must run by opening `index.html` directly in a browser.
* No backend.
* No database.
* No build step.
* No npm requirement.
* No React.
* No Vue.
* No Next.js.
* No Tailwind build pipeline.
* No external UI framework.
* Use `localStorage` only for simulated user state.
* Use local JSON files only for demo data.
* Do not rely on remote resources required for the page to work.
* Keep the code readable and modular.

Recommended state strategy:

* Store created habits in `localStorage`.
* Store current selected habit ID in `localStorage`.
* Store daily records inside each habit object.
* Store the selected home habit separately from the current detail habit if needed.
* Provide fallback demo data when no local habit exists.

---

## 5. Required File Structure

The current prototype keeps the existing static file structure. New river documentation is added under `docs/`.

```text
habit-garden-prototype/
├── index.html
├── create.html
├── detail.html
├── review.html
├── explore.html
├── assets/
│   ├── css/
│   ├── js/
│   └── svg/
├── data/
└── docs/
    ├── PRODUCT_BRIEF.md
    ├── UI_SPEC.md
    ├── INTERACTION_SPEC.md
    ├── COPY_RULES.md
    ├── ACCEPTANCE_CHECKLIST.md
    ├── RIVER_STAGE_SYSTEM.md
    ├── RIVER_HOME_SPEC.md
    ├── RIVER_DETAIL_SPEC.md
    └── RIVER_COMPONENT_SPEC.md
```

Do not add framework folders, package manifests, build tooling, or server code.

---

## 6. Required Pages

### 6.1 `index.html` - River Stage Home

The home page is the core visual hub.

It uses one fixed river background image as the stage. The background only provides atmosphere and spatial rhythm. It must not encode real habit data.

Required structure:

* top navigation
* left floating habit list
* central river stage
* initial motto floating panel when no habit is selected
* monthly record overlay when a habit is selected
* fixed-height today record popover opened from the top navigation

When no habit is selected:

* show the river background
* show the habit list on the left
* show one core motto panel floating over the stage
* do not show monthly river objects

Left habit list rules:

* Use a light vertical rail style.
* Habit text must not intersect the rail line.
* If habits overflow, scroll by pointer position inside the list area.
* Avoid an obvious heavy scrollbar for the habit rail.
* Place a plus/add control below the rail.
* The plus/add control navigates to `create.html`.

When a habit is selected:

* hide the motto panel
* keep the same river background
* show that habit's current month records on fixed river points
* each day maps to one river object

Status visual mapping:

| Record status | River object |
| --- | --- |
| `real` | lotus |
| `entry` | dark green small leaf |
| `downgrade` | light green small leaf |
| `missed` | small stone |
| no record | faint placeholder ripple |

The home page must not look like a dashboard.

### 6.2 `create.html` - Behavior Design Curve

The creation page keeps the behavior design curve.

The curve has six nodes:

1. Wish
2. Why now
3. Candidate behaviors
4. Focus map
5. Micro-habit
6. Natural prompt

At the end, the page should generate a three-day trial plan and provide a button to place the habit into the river stage.

### 6.3 `detail.html` - River Habit Detail

The detail page uses the same river background as the home page, but focuses on one habit and one week within a selected month.

Required structure:

* top navigation
* river detail stage
* current habit identity
* week record overlay on fixed river points
* collapsible right floating panel
* today record popover opened from the top navigation

Right floating panel modules:

* current plan
* soft execution heatmap
* single-day detail

Detail page rules:

* Keep the same top navigation.
* `今日记录` can record today's current habit from the detail page.
* Support selected month and selected week.
* Show at most 7 day objects for a selected week.
* If a week has fewer actual days in the selected month, show only those actual days.
* Collapsed right panel arrow points right.
* Expanded right panel arrow points left.
* Current plan includes a modify-plan action that returns to `create.html`.
* Long plan, heatmap, note, or reason content scrolls inside the drawer modules.

The heatmap can reference GitHub contributions structurally, but it must feel soft, organic, and non-engineering.

### 6.4 `review.html` - Growth Reflection

The review page should show behavior insights:

* motivation observation
* ability observation
* prompt observation
* easiest time to complete
* most common friction
* most effective prompt
* next adjustment suggestion

It should be calm and concise.

### 6.5 `explore.html` - Optional Exploration Area

The explore page can include:

* behavior inspiration cards
* anonymous gentle trace wall
* habit examples
* same-goal room mockup

It must not include:

* leaderboard
* ranking
* comparison percentage
* public failure display
* pressure-based social features

---

## 7. Top Navigation

The shared navigation is:

```text
花园
设计
复盘
探索
今日记录
```

`今日记录` opens a fixed-height floating panel instead of navigating away when implemented on the home page. The existing static HTML may still link to `detail.html` until the interaction is implemented.

---

## 8. Data Model Suggestion

Use a simple `habit` object:

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
      note: "完成了入场动作",
      reason: ""
    }
  ],
  adjustments: []
}
```

Record status values:

```text
real        completed the real action
entry       completed the entry action
downgrade   used a lighter version
missed      did not happen today
```

Missing days are rendered as quiet stones. They are not errors.

---

## 9. Development Workflow

When modifying the project:

1. Read `CLAUDE.md`.
2. Read related files in `docs/`.
3. For river work, read `docs/RIVER_STAGE_SYSTEM.md` first.
4. Modify only the necessary files.
5. Keep the prototype static.
6. Avoid framework introduction.
7. Run self-review.
8. Confirm the page still opens from `index.html`.

---

## 10. Final Acceptance Standard

The prototype is acceptable only if:

* `index.html` can be opened directly.
* The home page uses a fixed river background stage.
* The river background does not carry real data.
* The habit list appears in a left floating area.
* No selected habit shows the core motto panel.
* Selecting a habit shows current-month river objects.
* Daily record status maps to lotus, leaves, stone, and ripple.
* Today record is available through a fixed-height floating panel.
* The detail page reuses the river background for one habit's week view.
* The detail page has a collapsible right panel with plan, heatmap, and single-day detail.
* The creation flow still reflects the Fogg model.
* The interface avoids streak pressure.
* The page has calm animations and visual feedback.
* All text is short and low-pressure.
