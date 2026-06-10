# .claude/skills/fogg-habit-ux-skill/SKILL.md

---

name: fogg-habit-ux-skill
description: Use this skill when designing product flow, page structure, habit creation, habit recording, failure diagnosis, no-shame return, or any feature related to the Fogg Behavior Model.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Fogg Habit UX Skill

## Purpose

Use this skill to keep the product aligned with the Fogg Behavior Model.

The product is not a check-in app. It is a behavior design assistant.

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

## Required Flow

The creation flow must include:

1. Wish
2. Real motivation
3. Candidate behaviors
4. Focus map
5. Micro-habit
6. Natural prompt
7. Three-day trial

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

Micro-habit is not always “the smallest possible action”.

It should be:

```text
容易启动，但不失真。
```

Examples:

| Habit Type | Better Micro-habit             |
| ---------- | ------------------------------ |
| Reading    | Read one page                  |
| Exercise   | Change shoes and go downstairs |
| Writing    | Open document and write title  |
| Study      | Sit at desk and open notes     |

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

## Failure Diagnosis

When the user misses a habit, do not treat it as failure.

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
* Use yellow leaves for missed days.
* Make recovery one-click.
* Keep the main journey low-pressure.

## Do Not

* Emphasize streaks.
* Use reset punishment.
* Use red failure warnings.
* Use leaderboards.
* Force public sharing.
* Use shame-based reminders.
* Make the user fill long forms.

---
