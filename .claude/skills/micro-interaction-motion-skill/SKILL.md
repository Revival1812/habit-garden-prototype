# .claude/skills/micro-interaction-motion-skill/SKILL.md

---

name: micro-interaction-motion-skill
description: Use this skill when implementing animations, transitions, hover states, page changes, curve growth, branch growth, leaf appearance, or interaction feedback.
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Micro Interaction Motion Skill

## Purpose

Use this skill to make the prototype feel alive without becoming noisy.

Motion should communicate:

```text
growth
trace
return
soft feedback
```

Motion should not be used as empty decoration.

## General Motion Style

Use:

* soft fade
* gentle upward movement
* subtle scale
* organic growth
* calm glow
* slow reveal

Avoid:

* bounce-heavy animation
* confetti
* fireworks
* strong shaking
* red flashing
* aggressive celebration
* fast repeated motion

## Timing Guide

Recommended durations:

| Interaction       | Duration    |
| ----------------- | ----------- |
| Button press      | 100-160ms   |
| Card hover        | 160-220ms   |
| Page fade         | 240-360ms   |
| Tooltip fade      | 120-180ms   |
| Curve reveal      | 500-900ms   |
| Leaf growth       | 400-700ms   |
| Branch appearance | 700-1200ms  |
| Soft glow pulse   | 1800-3200ms |

## Required Animations

### Page Entry

Each page should lightly fade in.

Suggested effect:

```text
opacity 0 → 1
translateY(8px) → 0
```

### Button Feedback

Button hover:

```text
slightly lift
soft shadow increase
```

Button active:

```text
slightly press down
```

### Card Feedback

Card hover:

```text
translateY(-2px)
shadow slightly stronger
```

### Curve Reveal

When a creation step is completed:

* curve segment draws forward
* completed node fills
* next node glows softly

### Branch Growth

When a habit is created:

* new branch appears on tree
* branch can scale or draw in
* animation should be calm

### Leaf Appearance

When a record is created:

* leaf fades in
* slight scale from 0.8 to 1
* no confetti

### Yellow Leaf

When a day is missed:

* yellow leaf appears softly
* optional small downward drift
* no alarm effect

### Tooltip

Leaf hover should show a tooltip with:

* date
* record status
* optional reason

Tooltip should fade in quickly.

## Reduced Motion

Respect reduced motion if possible:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Motion Review

Before finalizing motion, check:

* Does the animation support meaning?
* Is the page still easy to use?
* Does anything feel childish or noisy?
* Does interruption feel judged?
* Does completion feel recorded rather than over-celebrated?

---

