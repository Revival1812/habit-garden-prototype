# .claude/skills/qa-polish-review-skill/SKILL.md

---

name: qa-polish-review-skill
description: Use this skill when reviewing the final prototype, checking quality, polishing code, verifying static operation, checking UX consistency, or preparing final delivery.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# QA Polish Review Skill

## Purpose

Use this skill for final review and polishing.

The goal is to ensure the prototype is:

* static
* runnable
* coherent
* visually polished
* low-pressure
* aligned with the Fogg model

## Static Function Check

Verify:

* `index.html` opens directly.
* All page links work.
* No backend is required.
* No build step is required.
* No npm command is required.
* No framework dependency exists.
* JavaScript does not throw console errors.
* localStorage flow works.

## Page Check

### Home Page

Check:

* empty state is clear
* create button works
* habit tree appears when data exists
* branches are clickable
* leaves are visible
* yellow leaves are gentle
* anonymous glow is not comparative

### Creation Page

Check:

* curve has six nodes
* curve reveals gradually
* each step has one question
* user can go back
* candidate behavior cards work
* focus map or selection works
* micro-habit generation works
* natural prompt sentence works
* save button creates habit

### Detail Page

Check:

* selected habit loads
* plan summary appears
* record options work
* green leaf appears for real action
* pale leaf appears for entry action
* yellow leaf appears for missed day
* missed-day reason copy is gentle

### Review Page

Check:

* MAP cards exist
* review is concise
* no dashboard overload
* suggestion is actionable

### Explore Page

Check:

* inspiration cards exist
* glow wall exists
* no ranking
* no comparison pressure

## UX Check

The prototype should feel like:

```text
habit garden
behavior design
gentle adjustment
low-pressure return
```

It should not feel like:

```text
check-in dashboard
KPI tracker
discipline app
ranking system
survey form
```

## Visual Check

Check:

* consistent color palette
* consistent border radius
* consistent shadows
* enough whitespace
* garden metaphor is visible
* tree, leaves, curve, and cards feel related
* no harsh red failure color
* no excessive visual noise

## Motion Check

Check:

* animations are calm
* page transitions are smooth
* hover effects are subtle
* no confetti
* no shaking error
* no loud celebration
* no motion that blocks interaction

## Copy Check

Check that UI does not use:

```text
失败
清零
惩罚
战胜自己
你太棒了
落后别人
```

Check that UI uses copy like:

```text
今天卡在哪里？
欢迎回来。
今天只做第一步也可以。
这也会留下来。
```

## Fogg Model Check

Verify that the prototype represents:

* Motivation through wish and reason
* Ability through micro-habit and downgrade
* Prompt through natural anchor
* Behavior through daily record
* Iteration through adjustment and review

## Final Output Format

When reporting QA results, use:

```text
发现的问题：
1.
2.
3.

已修复：
1.
2.
3.

仍需注意：
1.
2.
3.
```

Do not claim success if a feature was not checked.

Do not introduce new large features during QA unless necessary.
