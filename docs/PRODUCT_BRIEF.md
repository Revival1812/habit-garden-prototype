# Product Brief

## 1. Product Name

Habit Garden

中文可称为：

```text
习惯花园
```

## 2. Product Positioning

Habit Garden is a static web prototype for a low-pressure habit design assistant.

It is not a traditional check-in tool. It does not ask users to rely on willpower, streaks, or public supervision. Instead, it helps users design behaviors that are easier to happen.

The core idea is:

```text
不是逼自己坚持，而是把行为设计得更容易发生。
```

## 3. Target Users

The main target users are young students and early adults who want to build better habits but often experience:

* unstable motivation
* fragmented time
* pressure from study or life
* guilt after interruption
* resistance to strict check-in tools
* dislike of rankings or public supervision
* desire for gentle but useful structure

The product should support three broad user tendencies:

### 3.1 Gentle Companion Type

Needs:

* low pressure
* emotional safety
* no shame after interruption
* soft visual feedback
* easy return

### 3.2 Rational Closed-loop Type

Needs:

* clear behavior logic
* objective diagnosis
* visible adjustment
* action records
* plan health feedback

### 3.3 Experience Exploration Type

Needs:

* visual metaphor
* sense of ritual
* quiet companionship
* meaningful traces
* enjoyable exploration

The first version should not force users to select a personality type. The interface should infer or adapt gradually through light choices.

## 4. Core Problem

Many habit tools assume that users already know what to do and only need reminders or tracking.

However, many users fail not because they are lazy, but because:

* the behavior is too large
* the prompt is not natural
* the environment does not support the behavior
* motivation is vague
* the plan is not adapted to low-energy days
* interruption creates guilt and prevents return

Habit Garden treats habit formation as a design problem rather than a discipline problem.

## 5. Core Model

The product is based on the Fogg Behavior Model:

```text
Behavior = Motivation + Ability + Prompt
```

In the interface, this should be translated into:

```text
想做
做得动
想得起来
```

The user should not need to learn theory first. The model should appear through interaction.

## 6. Core User Journey

The main journey is:

```text
进入花园首页
→ 种下一个习惯
→ 进入行为设计曲线
→ 澄清愿望
→ 识别真实动机
→ 探索候选行为
→ 通过焦点地图选择黄金行为
→ 生成微习惯
→ 绑定自然提示
→ 生成 3 天试运行方案
→ 放到习惯树上
→ 每天留下叶子痕迹
→ 中断时生成黄叶
→ 回来后继续调整和生长
```

## 7. Core Metaphor

The product uses a garden metaphor.

Mapping:

| Product Element         | Visual Metaphor  |
| ----------------------- | ---------------- |
| New habit               | Seed             |
| Habit plan              | Branch           |
| Daily record            | Leaf             |
| Entry action completed  | Pale leaf        |
| Real action completed   | Green leaf       |
| Missed day              | Yellow leaf      |
| Long-term growth        | Tree ring        |
| Anonymous companionship | Glow             |
| Creation process        | Growing curve    |
| Adjustment              | New small branch |

The metaphor should help users feel that history is preserved even when progress is interrupted.

## 8. MVP Scope

The first version must include:

1. Habit garden home page.
2. Empty state with seed or soil.
3. Behavior design curve page.
4. Six-step creation flow.
5. Focus map interaction.
6. Micro-habit generation.
7. Natural prompt generation.
8. Habit tree display.
9. Daily record through leaves.
10. Missed-day yellow leaf.
11. No-shame return button.
12. Lightweight review page.
13. Optional exploration page.

## 9. Out of Scope for Static Prototype

Do not implement:

* real account system
* backend database
* authentication
* real push notifications
* mobile OS widgets
* AI backend generation
* real social network
* real leaderboard
* complex chart system
* server-side persistence

Use static simulation and localStorage only.

## 10. Success Criteria

The prototype succeeds if a user can understand and complete the core journey without reading long instructions.

A good experience should feel like:

```text
我只是放下一个愿望，系统就一步步帮我把它变成一个今天能开始的小动作。
```

The prototype fails if it feels like:

```text
一个普通的打卡表格。
一个任务管理后台。
一个需要填写很多内容的问卷。
一个失败后让人有压力的监督工具。
```

---
