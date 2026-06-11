---
name: fogg-habit-ux-skill
description: Use this skill when designing product flow, page structure, habit creation, habit recording, missed-day diagnosis, no-shame return, river-stage habit records, or any feature related to the Fogg Behavior Model in the Habit Garden prototype.
---

# Fogg Habit UX Skill

## Purpose

Use this skill to keep the product aligned with the Fogg Behavior Model.

The product is not a check-in app. It is a behavior design assistant.

The current visual system is the River Stage Habit System. Habit records should be shown as river objects, not as tree growth.

## Core Model

The behavior model is:

```text
Behavior = Motivation + Ability + Prompt
```

In this prototype, translate it as:

```text
想做
做得动
想得起来
```

Do not force users to understand theory. Let the interface embody the theory.

## Required Creation Flow

The creation flow must include:

1. Wish
2. Real motivation
3. Candidate behaviors
4. Focus map
5. Micro-habit
6. Natural prompt
7. Three-day trial

The final habit should be saved into the river system.

## Motivation Design

Motivation should be captured through:

* user wish
* current reason
* trigger event
* emotional need
* expected relief

Good question:

```text
为什么是现在？
```

Avoid:

```text
请阐述你的长期目标和深层价值。
```

## Ability Design

Ability should be supported through:

* smaller action
* entry action
* preparation action
* scene transition
* downgrade mode
* low-energy mode

Micro-habit is not always the smallest possible action.

It should be:

```text
容易启动，但不失真。
```

Examples:

| Habit type | Better micro-habit |
| --- | --- |
| Reading | Read one page |
| Exercise | Change shoes and go downstairs |
| Writing | Open document and write title |
| Study | Sit at desk and open notes |

## Prompt Design

Prompt should be natural.

Use:

```text
当我……之后，我就……。
```

Preferred anchors:

* after brushing teeth
* after dinner
* after plugging in charger
* after sitting at desk
* after returning to dorm
* after opening computer

Avoid default high-frequency push reminders.

## Daily Record Design

Use four daily states:

| User label | Stored status | River object |
| --- | --- | --- |
| 完成 | `real` | 莲花 |
| 入场 | `entry` | 深绿色小叶片 |
| 降级 | `downgrade` | 浅绿色小叶片 |
| 未发生 | `missed` | 小石头 |

No record should appear as a faint placeholder ripple.

Record fields:

```js
{
  date,
  status,
  note,
  reason
}
```

`note` and `reason` are optional.

## Missed-Day Diagnosis

When the user marks `未发生`, do not treat it as failure.

Ask:

```text
今天卡在哪里？
```

Possible reasons:

* forgot
* too tired
* wrong time
* action too large
* environment unsupported
* unexpected event
* low mood
* no reason recorded

Then suggest:

* lower action threshold
* change prompt
* add preparation action
* pause one day
* use entry action only

The visual result should be a small stone, not a warning.

## No-Shame Return

For returning users, show:

```text
欢迎回来。
今天可以从一个很小的动作重新开始。
```

Do not show:

```text
你已经中断 7 天。
```

## Do

* Make behavior easier to happen.
* Keep history even after interruption.
* Let users adjust plans.
* Use river objects for daily records.
* Make recovery one-click or very lightweight.
* Keep the main journey low-pressure.
* Preserve the fixed river background as atmosphere only.

## Do Not

* Emphasize streaks.
* Use reset punishment.
* Use red failure warnings.
* Use leaderboards.
* Force public sharing.
* Use shame-based reminders.
* Make the user fill long forms.
* Return to habit tree, branch, trunk, or watering-plant metaphors.
