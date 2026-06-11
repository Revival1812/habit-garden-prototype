# Interaction Specification

## 1. Interaction Principle

The prototype should make the user feel:

```text
I can start with very little effort.
I can adjust instead of fail.
I can return without being judged.
```

Interactions should be:

* simple
* visual
* reversible
* low-pressure
* lightly animated
* meaningful

The river stage should respond to records, but it should not behave like a game that demands continuous growth.

---

## 2. Deprecated Interactions

Do not implement:

* tree branch clicking as the primary home navigation
* tree leaf growth as the daily record metaphor
* trunk or branch calibration
* dynamic branch stitching
* watering plants
* Three.js plant interactions
* streak recovery pressure
* reset or punishment flows

---

## 3. Home Page Interactions

### 3.1 Initial Load

On load:

1. Read habits from `localStorage`.
2. If no local habits exist, load fallback demo habits.
3. Read selected habit ID from `localStorage`.
4. Render left habit list.
5. Render fixed river background.
6. If no habit is selected, render motto panel.
7. If a habit is selected, render current-month river objects.

The river background must not change based on data.

### 3.2 Habit Selection

User action:

```text
Click habit in left floating list
```

Expected result:

* store selected habit ID
* set selected visual state in habit list
* hide motto panel
* compute current-month records for selected habit
* render one river object per day

Clicking the selected habit again may keep it selected. A separate close/clear control can return to the motto state.

### 3.2.1 Habit Rail Auto-Scroll

User action:

```text
Move pointer inside the left habit rail
```

Expected result:

* pointer in upper half scrolls the list upward
* pointer in lower half scrolls the list downward
* pointer near the center slows or stops scrolling
* pointer leaving the rail stops auto-scroll
* no obvious heavy scrollbar is required
* keyboard and wheel scrolling still work

User action:

```text
Click plus/add below the rail
```

Expected result:

```text
Navigate to create.html
```

### 3.3 River Object Hover / Focus

User action:

```text
Hover or keyboard-focus a river object
```

Expected result:

* show small tooltip
* include date
* include status label
* include note only if present
* no modal required

Tooltip examples:

```text
6 月 10 日：入场
6 月 11 日：还没有记录
```

### 3.4 River Object Click

User action:

```text
Click a river object
```

Expected result:

* select that day
* show lightweight single-day detail
* optionally provide a route to `detail.html`

On home, this should not open a dense editor.

### 3.5 Today Record Popover

User action:

```text
Click 今日记录
```

Expected result:

* open fixed-height floating panel
* keep river stage visible behind it
* list habits that can be recorded today
* each habit shows four status choices

Status choices:

```text
完成
入场
降级
未发生
```

Mapping:

| Choice | Stored status | River object |
| --- | --- | --- |
| 完成 | `real` | Lotus |
| 入场 | `entry` | Dark green small leaf |
| 降级 | `downgrade` | Light green small leaf |
| 未发生 | `missed` | Small stone |

### 3.6 Optional Reason / Thought

After selecting a status:

* show an optional note area
* user can write a reason/thought
* user can ignore it
* saving should not require text

If the user selected `missed`, ask gently:

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

Expected result:

* upsert today's record on the habit
* save habits to `localStorage`
* update the river object for today if that habit is selected
* keep copy low-pressure

---

## 4. Creation Flow Interactions

### 4.1 Curve Progression

The curve starts partially hidden.

When the user completes a step:

* current node becomes complete
* next segment of curve reveals
* next node softly appears
* plan preview updates

Users can click completed nodes to edit previous steps.

Incomplete future nodes should be visible only as faint hints.

### 4.2 Step 1 - Wish

Question:

```text
你想让什么变得容易一点？
```

Input methods:

* template card click
* short custom input

Expected result:

* store `wish`
* update preview

### 4.3 Step 2 - Real Motivation

Question:

```text
为什么是现在？
```

Expected result:

* store `reason`
* update preview

### 4.4 Step 3 - Candidate Behaviors

Question:

```text
它可能怎么发生？
```

Interaction:

* user selects behavior inspiration cards
* selected cards become candidate behavior chips
* user can remove chips
* user can add one custom behavior

Expected result:

* store candidate behaviors

### 4.5 Step 4 - Focus Map

Question:

```text
哪个最值得先开始？
```

Interaction options:

* drag candidate cards on a two-axis map
* or click recommended card
* or manually choose one behavior

Axes:

```text
容易发生
对目标有帮助
```

Expected result:

* selected behavior becomes `goldenBehavior`

### 4.6 Step 5 - Micro-habit

Question:

```text
把它变成今天能开始的版本。
```

Types:

```text
数量缩小型
场景切换型
准备动作型
```

The interface should generate:

```text
入场动作
真实动作
```

Expected result:

* store `entryAction`
* store `realAction`
* store `microHabitType`

### 4.7 Step 6 - Natural Prompt

Question:

```text
什么时候最容易发生？
```

Generated sentence:

```text
当我……之后，我就……。
```

Expected result:

* store `prompt`
* store `promptSentence`
* store `promptStrength`

### 4.8 Final Save

Button:

```text
放到河流里
```

Expected result:

* create habit object
* save to `localStorage`
* set selected habit ID to the new habit
* navigate to `index.html`
* home river stage displays the selected habit

---

## 5. Detail Page Interactions

### 5.1 Detail Load

On load:

1. Read selected habit ID from `localStorage` or URL query if added later.
2. Read habits from `localStorage`.
3. Resolve selected habit.
4. Render same river background.
5. Render selected month/week objects.
6. Render right collapsible panel.

If no selected habit exists, show a quiet empty state and a link back to the garden.

### 5.2 Month and Week Selection

User action:

```text
Select month or week
```

Expected result:

* update current period state
* compute records within the selected week
* update river objects
* update heatmap highlight

### 5.3 Right Panel Toggle

User action:

```text
Click collapse / expand control
```

Expected result:

* panel collapses to a narrow tab
* river stage gets more space
* expanded panel restores the three modules
* state can be saved in memory or localStorage
* collapsed arrow points right
* expanded arrow points left

### 5.4 Current Plan Module

Displays:

* wish
* golden behavior
* entry action
* real action
* natural prompt
* latest adjustment if any
* modify-plan action that returns to `create.html`

Actions can be static in the first version:

```text
调轻一点
换提示点
先保留观察
```

### 5.5 Execution Heatmap Module

User action:

```text
Hover heatmap cell
```

Expected result:

* show date and status
* update single-day detail preview if useful

The heatmap is for observation, not scoring.

### 5.6 Single-Day Detail Module

Displays selected day:

* date
* status
* reason if selected
* note if written
* soft suggestion if relevant

Do not use failure copy for `missed`.

### 5.7 Detail Today Record

User action:

```text
Click 今日记录 from detail page
```

Expected result:

* open the fixed-height today record popover
* focus the current habit by default
* allow the same four statuses
* allow optional reason/thought
* save by upserting today's current-habit record
* immediately update the detail river object and heatmap

---

## 6. Review Page Interactions

User can view:

* Motivation card
* Ability card
* Prompt card
* pattern card
* suggestion card

Optional interactions:

* click card to expand short detail
* click suggestion to return to detail page

Do not add complex filtering.

---

## 7. Explore Page Interactions

User can:

* click inspiration card
* simulate adding idea to creation flow
* view anonymous gentle messages
* return to garden

Allowed:

```text
有人今天也只是完成了第一步。
```

Not allowed:

```text
80% 的人都完成了，你也要加油。
```

---

## 8. Animation Requirements

Required animations:

* page fade in
* floating panel fade/slide
* habit list selection feedback
* river object soft appear
* tooltip fade
* today popover open/close
* heatmap cell hover
* button press feedback

Avoid:

* confetti
* dramatic bounce
* error shake
* red flash
* excessive particle effects
* plant growth pressure animation
