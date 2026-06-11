# Product Brief

## 1. Product Name

Habit Garden

Chinese name:

```text
习惯花园
```

The name can remain Habit Garden, but the home visual system is now the River Stage Habit System.

---

## 2. Product Positioning

Habit Garden is a static web prototype for a low-pressure habit design assistant.

It is not a traditional check-in tool. It does not ask users to rely on willpower, streaks, or public supervision. Instead, it helps users design behaviors that are easier to happen, then records traces in a calm visual stage.

The core idea is:

```text
不是逼自己坚持，而是把行为设计得更容易发生。
```

The product should feel like a quiet place where a user can place a habit, observe what happened, and adjust the design without shame.

---

## 3. Current Metaphor

The current metaphor is:

```text
River Stage Habit System
```

The home page uses a fixed river background as a stage. The river is not a data visualization by itself. Habit data is shown through objects placed on fixed points over the river.

Mapping:

| Product element | River stage metaphor |
| --- | --- |
| Habit list | Left floating habit shelf |
| Selected habit | Current river stage focus |
| Current month | Set of fixed river points |
| One day | One river object |
| Completed real action | Lotus |
| Entry action | Dark green small leaf |
| Downgraded action | Light green small leaf |
| Did not happen | Small stone |
| Not recorded | Faint placeholder ripple |
| Today record | Fixed-height floating panel |
| Detail view | Same river, one habit, one week |
| Plan review | Right collapsible floating panel |

This metaphor preserves traces without implying that the user must grow a plant every day.

---

## 4. Deprecated Metaphor

The following previous directions are no longer product directions:

* habit tree as the home visual
* branch growth as progress
* trunk / branch / tree renderer
* tree rings as long-term history
* `tree-layout-registry` calibration
* dynamic branch stitching
* realistic tree assets
* watering plants as the daily action
* Three.js plant raising

Future implementation should not rebuild these systems under new names.

---

## 5. Target Users

The main target users are young students and early adults who want to build better habits but often experience:

* unstable motivation
* fragmented time
* pressure from study or life
* guilt after interruption
* resistance to strict check-in tools
* dislike of rankings or public supervision
* desire for gentle but useful structure

The product should support three broad user tendencies:

### 5.1 Gentle Companion Type

Needs:

* low pressure
* emotional safety
* no shame after interruption
* soft visual feedback
* easy return

### 5.2 Rational Closed-loop Type

Needs:

* clear behavior logic
* objective diagnosis
* visible adjustment
* action records
* plan health feedback

### 5.3 Experience Exploration Type

Needs:

* visual metaphor
* sense of ritual
* quiet companionship
* meaningful traces
* enjoyable exploration

The first version should not force users to select a personality type. The interface should infer or adapt gradually through light choices.

---

## 6. Core Problem

Many habit tools assume that users already know what to do and only need reminders or tracking.

However, many users struggle because:

* the behavior is too large
* the prompt is not natural
* the environment does not support the behavior
* motivation is vague
* the plan is not adapted to low-energy days
* interruption creates guilt and prevents return

Habit Garden treats habit formation as a design problem rather than a discipline problem.

---

## 7. Core Model

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

---

## 8. Core User Journey

The main journey is:

```text
进入花园首页
-> 看到河流舞台和左侧习惯列表
-> 选择一个习惯，查看当月在河流上的痕迹
-> 从今日记录浮窗选择当天状态
-> 可选择填写理由/想法，也可以忽略
-> 记录写入该习惯当天 record
-> 河流舞台更新当天物件
-> 进入详情页查看该习惯某月某周
-> 在右侧浮窗查看当前方案、热力图、单日详情
-> 根据观察轻轻调整计划
```

Creation journey remains:

```text
设计
-> 愿望
-> 为什么是现在
-> 候选行为
-> 焦点地图
-> 微习惯
-> 自然提示
-> 放到河流里
```

---

## 9. MVP Scope

The first river-stage version must include:

1. River stage home page.
2. Fixed river background image.
3. Left floating habit list.
4. Pointer-directed auto-scroll habit rail with no obvious heavy scrollbar.
5. Plus/add control below the habit rail, linking to `create.html`.
6. No-selected-habit motto panel.
7. Selected-habit monthly record overlay.
8. One river object per day.
9. Status-to-object mapping.
10. Top navigation with `花园 / 设计 / 复盘 / 探索 / 今日记录`.
11. Today record fixed-height floating panel on home and detail.
12. Four today status choices.
13. Optional note/reason after status selection.
14. Detail page with same river background.
15. Detail page week overlay for one habit, with at most 7 actual days.
16. Detail page right collapsible panel.
17. Current-plan edit action returning to `create.html`.
18. Soft contribution-style heatmap.
19. Behavior design curve creation flow.
20. Static localStorage persistence.

---

## 10. Out of Scope for Static Prototype

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
* React / Vue / Next / npm workflow
* Three.js visual stage
* dynamic tree renderer

Use static simulation and localStorage only.

---

## 11. Success Criteria

The prototype succeeds if a user can understand and complete the core journey without reading long instructions.

A good experience should feel like:

```text
我只是放下一个愿望，系统一步步帮我把它变成今天能开始的小动作。记录时，它只是把今天发生的事留在河面上。
```

The prototype fails if it feels like:

```text
一个普通的打卡表格。
一个任务管理后台。
一个需要填写很多内容的问卷。
一个中断后让人有压力的监督工具。
一个树木养成小游戏。
```
