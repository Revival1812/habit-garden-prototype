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

## 2. Home Page Interactions

### 2.1 Empty State

User action:

```text
Click “生成一个微习惯方案”
```

Expected result:

```text
Navigate to create.html
```

User action:

```text
Select current state chip
```

Expected result:

* selected chip becomes active
* creation tone can be stored in localStorage
* no additional form appears

State values:

```text
motivated
low-energy
exploring
```

### 2.2 Habit Tree

User action:

```text
Click branch
```

Expected result:

* store selected habit ID
* navigate to `detail.html`

User action:

```text
Hover leaf
```

Expected result:

* show small tooltip
* include date and record status
* no modal required

User action:

```text
Click yellow leaf
```

Expected result:

* show missed-day note
* show adjustment suggestion
* do not show failure warning

## 3. Creation Flow Interactions

### 3.1 Curve Progression

The curve starts partially hidden.

When the user completes a step:

* current node becomes complete
* next segment of curve reveals
* next node softly appears
* plan preview updates

Users can click completed nodes to edit previous steps.

Incomplete future nodes should be visible only as faint hints.

### 3.2 Step 1 — Wish

Question:

```text
你想让什么变得容易一点？
```

Input methods:

* template card click
* short custom input

Templates:

```text
早睡
学习
运动
阅读
减肥
记录笔记
```

Expected result:

* store `wish`
* update preview

### 3.3 Step 2 — Real Motivation

Question:

```text
为什么是现在？
```

Options:

```text
最近被某件事触发
已经困扰一阵了
我想给自己一点秩序
我只是想试试看
```

Expected result:

* store `reason`
* update preview

### 3.4 Step 3 — Candidate Behaviors

Question:

```text
它可能怎么发生？
```

Interaction:

* user selects behavior inspiration cards
* selected cards become candidate behavior chips
* user can remove chips
* user can add one custom behavior

Categories:

```text
降低阻力
改变环境
绑定已有动作
只做入场动作
```

Expected result:

* store candidate behaviors

### 3.5 Step 4 — Focus Map

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

Recommendation copy:

```text
它不是最宏大，但最容易在你现在的生活里发生。
```

### 3.6 Step 5 — Micro-habit

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
真实行动
```

Example:

```text
入场动作：打开台灯并坐下
真实行动：学习 10 分钟
```

Expected result:

* store `entryAction`
* store `realAction`
* store `microHabitType`

### 3.7 Step 6 — Natural Prompt

Question:

```text
什么时候最容易发生？
```

Anchor options:

```text
刷牙后
晚饭后
插上充电器后
坐到书桌前
回到宿舍后
打开电脑后
```

Generated sentence:

```text
当我……之后，我就……。
```

Prompt strength:

```text
无打扰视觉提示
轻提醒
强提醒
```

Default:

```text
无打扰视觉提示
```

Expected result:

* store `prompt`
* store `promptSentence`
* store `promptStrength`

### 3.8 Final Save

Button:

```text
放到我的树上
```

Expected result:

* create habit object
* save to localStorage
* navigate to index.html
* home tree displays new branch

## 4. Detail Page Interactions

### 4.1 Today Record

Record options:

```text
完成真实行动
完成入场动作
今天先降级
今天没有发生
```

Status mapping:

| Option | Status    | Visual      |
| ------ | --------- | ----------- |
| 完成真实行动 | real      | green leaf  |
| 完成入场动作 | entry     | pale leaf   |
| 今天先降级  | downgrade | bud         |
| 今天没有发生 | missed    | yellow leaf |

### 4.2 Missed Day Diagnosis

If user selects:

```text
今天没有发生
```

Ask:

```text
今天卡在哪里？
```

Options:

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

After selecting reason:

* create yellow leaf
* show light suggestion
* never display red error
* never use failure copy

Suggestion examples:

```text
明天可以只做第一步。
要不要换一个提示点？
可以把动作调轻一点。
```

### 4.3 Adjustment

Adjustment can be static in first version.

Possible actions:

```text
降低动作门槛
换一个提示点
加入准备动作
暂停一天
```

Clicking can show a mock confirmation.

## 5. Review Page Interactions

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

## 6. Explore Page Interactions

User can:

* click inspiration card
* simulate adding idea to creation flow
* view anonymous glow messages
* return to garden

Glow messages must be non-comparative.

Allowed:

```text
有人今天也只是完成了第一步。
```

Not allowed:

```text
80% 的人都完成了，你也要加油。
```

## 7. Animation Requirements

Required animations:

* page fade in
* card hover lift
* curve reveal
* node glow
* branch appear
* leaf grow
* yellow leaf soft fade
* tooltip fade
* button press feedback

Avoid:

* confetti
* dramatic bounce
* error shake
* red flash
* excessive particle effects

---

