# Habit Garden Static Prototype

## 1. Project Goal

This project is a static web prototype for a habit design product based on the Fogg Behavior Model.

The product is not a traditional habit tracker. It should not pressure users to “keep streaks” or “force discipline”. Its core purpose is to help users design behaviors that are easier to happen.

The prototype should guide users through a low-pressure behavior design process:

1. Clarify a wish.
2. Identify why the wish matters now.
3. Explore possible behaviors.
4. Select a golden behavior using a focus map.
5. Convert the golden behavior into a micro-habit.
6. Bind the micro-habit to a natural prompt.
7. Place the habit into a visual habit garden.
8. Record behavior traces without shame.
9. Adjust the plan when interruption happens.
10. Help users return without judgment.

The main product metaphor is:

```text
Habit Garden + Behavior Design Curve + Habit Tree
```

The user should feel that they are planting, growing, adjusting, and returning to habits, not completing rigid tasks.

---

## 2. Core Design Philosophy

### 2.1 Product Positioning

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

### 2.2 What the Product Should Emphasize

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

### 2.3 What the Product Should Avoid

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

---

## 3. Technical Constraints

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
* Store daily records as simple arrays.
* Provide fallback demo data when no local habit exists.

---

## 4. Required File Structure

```text
habit-garden-prototype/
├─ index.html
├─ create.html
├─ detail.html
├─ review.html
├─ explore.html
├─ assets/
│  ├─ css/
│  │  ├─ base.css
│  │  ├─ garden.css
│  │  ├─ create.css
│  │  ├─ detail.css
│  │  └─ animations.css
│  ├─ js/
│  │  ├─ app-state.js
│  │  ├─ garden.js
│  │  ├─ create-flow.js
│  │  ├─ detail.js
│  │  ├─ review.js
│  │  └─ micro-interactions.js
│  └─ svg/
│     ├─ tree.svg
│     ├─ seed.svg
│     ├─ leaf.svg
│     └─ glow.svg
├─ data/
│  ├─ templates.json
│  ├─ behavior-cards.json
│  └─ demo-habits.json
├─ docs/
│  ├─ PRODUCT_BRIEF.md
│  ├─ UI_SPEC.md
│  ├─ INTERACTION_SPEC.md
│  ├─ COPY_RULES.md
│  └─ ACCEPTANCE_CHECKLIST.md
└─ .claude/
   ├─ skills/
   │  ├─ fogg-habit-ux-skill/
   │  │  └─ SKILL.md
   │  ├─ visual-garden-ui-skill/
   │  │  └─ SKILL.md
   │  ├─ static-prototype-code-skill/
   │  │  └─ SKILL.md
   │  ├─ micro-interaction-motion-skill/
   │  │  └─ SKILL.md
   │  ├─ low-text-copy-skill/
   │  │  └─ SKILL.md
   │  └─ qa-polish-review-skill/
   │     └─ SKILL.md
   └─ settings.json
```

---

## 5. Required Pages

### 5.1 `index.html` — Habit Garden Home

The home page is the core visual hub.

It should support two states:

#### Empty State

When the user has no habit:

* Show a seed, soil, or small empty tree.
* Show one short sentence:

```text
先种下一个容易发生的行为。
```

* Show three light state choices:

```text
我很有动力
我有点累，但想开始
我只是看看
```

* Show one primary button:

```text
生成一个微习惯方案
```

Clicking the button should navigate to `create.html`.

#### Existing Habit State

When the user has habits:

* Show a habit tree.
* Each branch represents one habit.
* Leaves represent daily traces.
* Green leaf means real action completed.
* Pale leaf means entry action completed.
* Yellow leaf means not completed, but history is still preserved.
* Clicking a branch navigates to `detail.html`.
* Hovering a leaf shows date and record note.
* The page should include a low-pressure “我回来了” entry when the user returns after interruption.

The home page must not look like an admin dashboard.

---

### 5.2 `create.html` — Behavior Design Curve

The creation page should use a growing curve instead of a traditional form.

The curve has six nodes:

1. 愿望
2. 为什么现在
3. 候选行为
4. 焦点地图
5. 微习惯
6. 自然提示

The curve should reveal gradually as the user completes steps.

Each step should show only one main question. The user should mainly interact through cards, small buttons, or drag actions. Long text input should be minimized.

At the end, the page should generate a three-day trial plan and provide a button:

```text
放到我的树上
```

Clicking the button should save the habit to `localStorage` and return to `index.html`.

---

### 5.3 `detail.html` — Habit Branch Detail

The detail page shows one habit branch.

It should include:

* Wish
* Golden behavior
* Micro-habit
* Entry action
* Real action
* Natural prompt
* Three-day trial status
* Leaf timeline
* Daily record card
* Missed-day reason selection
* Light adjustment suggestion

It should not present failure as shame.

When users select “今天没有发生”, the interface should ask:

```text
今天卡在哪里？
```

Then provide options:

```text
忘记了
太累了
时间不合适
任务太大
环境不支持
突发事件
情绪低落
不想记录原因
```

The result should create a yellow leaf, not a failure warning.

---

### 5.4 `review.html` — Growth Reflection

The review page should show behavior insights.

It should include:

* Motivation observation
* Ability observation
* Prompt observation
* easiest time to complete
* most common friction
* most effective prompt
* next adjustment suggestion

The page should be calm and concise. It should not use complex charts unless they are lightweight and visually consistent.

---

### 5.5 `explore.html` — Optional Exploration Area

The explore page should be optional.

It can include:

* behavior inspiration cards
* anonymous micro-glow wall
* gentle habit examples
* same-goal room mockup

It must not include:

* leaderboard
* ranking
* comparison percentage
* public failure display
* pressure-based social features

---

## 6. Visual Style

The visual language should feel:

```text
quiet, natural, soft, clear, organic, low-pressure
```

Recommended palette:

* warm off-white background
* sage green
* moss green
* soft wood brown
* pale yellow
* light blue-gray for neutral prompts

Avoid:

* harsh red
* neon colors
* heavy black
* strong dashboard blue
* competitive gamification colors

The interface should use:

* rounded cards
* soft shadows
* organic curves
* SVG tree and leaves
* calm transitions
* visible whitespace
* subtle hover feedback

---

## 7. Interaction Requirements

Required interactions:

* Home empty state navigates to creation flow.
* Creation curve reveals node by node.
* Completed nodes can be clicked to go back and edit.
* Candidate behaviors can be selected through inspiration cards.
* Focus map allows choosing a golden behavior.
* Micro-habit generation supports three types:

  * quantity reduction
  * scene transition
  * preparation action
* Natural prompt generates:

```text
当我……之后，我就……
```

* Saving a habit creates a branch on the home tree.
* Completing a real action creates a green leaf.
* Completing only an entry action creates a pale leaf.
* Missing a day creates a yellow leaf.
* The user can return through a “我回来了” state.
* The tree should preserve history even after interruption.

---

## 8. Copy Rules

The UI copy must be short.

General rules:

* One main sentence per screen.
* Avoid long explanations.
* Avoid theoretical language when possible.
* Avoid judgmental wording.
* Avoid excessive praise.
* Avoid pressure words.

Do not use:

```text
失败
惩罚
清零
必须坚持
战胜自己
你太棒了
落后
排名
打败别人
```

Prefer:

```text
先试试看
今天只做第一步
欢迎回来
卡在哪里
这也会留下来
把它调轻一点
先放到树上
```

---

## 9. Data Model Suggestion

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
  trialDays: 3,
  createdAt: "2026-06-10",
  records: [
    {
      date: "2026-06-10",
      status: "entry",
      note: "完成了入场动作"
    }
  ],
  adjustments: []
}
```

Record status values:

```text
real       完成真实行动
entry      完成入场动作
downgrade  今天降级
missed     今天没有发生
```

---

## 10. Development Workflow

When modifying the project:

1. Read `CLAUDE.md`.
2. Read related files in `docs/`.
3. Use the matching skill.
4. Modify only the necessary files.
5. Keep the prototype static.
6. Avoid framework introduction.
7. Run self-review.
8. Confirm the page still opens from `index.html`.

---

## 11. Final Acceptance Standard

The prototype is acceptable only if:

* `index.html` can be opened directly.
* The home page looks like a habit garden.
* The creation flow uses a curve, not a form list.
* The user can create a habit with minimal typing.
* The habit appears as a branch.
* Daily records appear as leaves.
* Missed days become yellow leaves, not failure alerts.
* The interface avoids streak pressure.
* The product clearly reflects the Fogg model through interaction.
* The page has calm animations and visual feedback.
* All text is short and low-pressure.
