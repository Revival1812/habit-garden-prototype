---
name: micro-interaction-motion-skill
description: Use this skill when implementing animations, transitions, hover states, page changes, behavior design curve reveal, river marker appearance, today record popover motion, detail drawer motion, tooltip motion, or low-pressure interaction feedback in the Habit Garden prototype.
---

# Micro Interaction Motion Skill

## Purpose

Use this skill to make the prototype feel alive without becoming noisy.

Motion should communicate:

```text
trace
return
soft feedback
quiet state change
```

The current visual system is the River Stage Habit System. Do not use branch growth, tree growth, watering, or plant-growing motion.

## General Motion Style

Use:

* soft fade
* gentle upward movement
* subtle scale
* calm glow
* slow reveal
* quiet ripple

Avoid:

* bounce-heavy animation
* confetti
* fireworks
* strong shaking
* red flashing
* aggressive celebration
* fast repeated motion
* plant growth pressure animation

## Timing Guide

Recommended durations:

| Interaction | Duration |
| --- | --- |
| Button press | 100-160ms |
| Card hover | 160-220ms |
| Page fade | 240-360ms |
| Tooltip fade | 120-180ms |
| Curve reveal | 500-900ms |
| River marker appear | 260-520ms |
| Today popover open | 180-280ms |
| Detail drawer toggle | 220-360ms |
| Soft glow or ripple pulse | 1800-3200ms |

## Required Animations

### Page Entry

Each page should lightly fade in.

Suggested effect:

```text
opacity 0 -> 1
translateY(8px) -> 0
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

### Card and Floating Panel Feedback

Card or panel hover:

```text
translateY(-2px)
shadow slightly stronger
```

Do not make floating panels bounce or wobble.

### Curve Reveal

When a creation step is completed:

* curve segment draws forward
* completed node fills
* next node glows softly

### River Marker Appearance

When a record is created or updated:

* marker fades in
* marker scales from 0.88 to 1
* selected marker receives a soft outline or glow
* no confetti
* no score-like celebration

### Placeholder Ripple

For unrecorded days:

* ripple is subtle
* optional slow opacity pulse is allowed
* pulse must not imply urgency

### Today Record Popover

The popover should:

* fade in
* slide slightly from the navigation area or top edge
* keep a fixed height
* avoid full-page takeover on desktop

### Detail Drawer

The right drawer should:

* slide horizontally
* keep the river stage visible
* use arrow direction consistently:
  * collapsed state arrow points right
  * expanded state arrow points left
* preserve selected day and scroll state when possible

### Tooltip

River marker hover/focus should show a tooltip with:

* date
* record status
* optional reason or note

Tooltip should fade in quickly and not shift marker positions.

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

## Deprecated Motion

Do not implement:

* branch growth
* tree drawing
* trunk assembly
* leaf growth as the primary record metaphor
* tree ring reveal
* watering animation
* Three.js plant growth

These are deprecated and no longer implementation directions.

## Motion Review

Before finalizing motion, check:

* Does the animation support meaning?
* Is the page still easy to use?
* Does anything feel childish or noisy?
* Does interruption feel judged?
* Does completion feel recorded rather than over-celebrated?
* Does the motion reinforce the river stage instead of the old tree system?
