# UI Specification

## 1. Overall UI Direction

The UI should be built around:

```text
River Stage Habit System
Behavior Design Curve
Quiet Records
Soft Reflection
```

The product should feel calm, organic, and lightweight.

It should not look like:

* dashboard
* CRM
* admin panel
* KPI tracker
* calendar-only check-in app
* competition product
* tree growth game
* plant watering simulation

---

## 2. Deprecated UI Direction

Do not use the following as the primary home visual:

* habit tree
* trunk and branch composition
* branch growth
* tree rings
* stitched branch SVGs
* `tree-layout-registry` visual calibration
* Three.js plant scene

Existing class names may still contain `garden`, but visual implementation should follow the river specs.

---

## 3. Page List

Required pages:

1. `index.html` - River Stage Home
2. `create.html` - Behavior Design Curve
3. `detail.html` - River Habit Detail
4. `review.html` - Growth Review
5. `explore.html` - Optional Exploration

---

## 4. Shared Layout

Each page should include:

* soft background
* simple top navigation
* clear page identity
* one primary visual system
* short guiding copy
* rounded floating panels
* gentle hover states

The top navigation must include:

```text
花园
设计
复盘
探索
今日记录
```

`今日记录` should open a fixed-height floating panel on the home page. It should not dominate the layout.

---

## 5. Color System

Recommended CSS variables:

```css
:root {
  --color-bg: #f4f0e7;
  --color-surface: #fffdf7;
  --color-surface-soft: #f0eadf;
  --color-river: #8fb7b6;
  --color-river-deep: #5f8f8e;
  --color-primary: #5f7f63;
  --color-primary-dark: #344f3b;
  --color-lotus: #f1c9c7;
  --color-leaf-dark: #4f7d54;
  --color-leaf-light: #a8c795;
  --color-stone: #b9b2a4;
  --color-ripple: rgba(255, 255, 255, 0.55);
  --color-text: #263328;
  --color-text-soft: #687466;
  --color-border: rgba(63, 95, 70, 0.16);
  --shadow-soft: 0 18px 40px rgba(63, 95, 70, 0.10);
}
```

Avoid:

```text
pure red
pure black
neon green
high-saturation blue
strong purple gradients
competitive gamification colors
```

---

## 6. Typography

Use system fonts.

Recommended font stack:

```css
font-family:
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  "PingFang SC",
  "Microsoft YaHei",
  sans-serif;
```

Text hierarchy:

| Element | Style |
| --- | --- |
| Page title | 28-40px, medium weight |
| Main question | 24-32px, medium weight |
| Floating panel title | 16-20px |
| Helper text | 13-15px |
| Button text | 14-16px |

Avoid large blocks of body text.

---

## 7. `index.html` UI

### 7.1 Base Layout

The home page should use a full-stage composition:

* top: navigation
* left: floating habit list
* center/background: fixed river image
* over river: motto panel or record objects
* top/right or nav anchored: today record popover

The fixed river background must:

* fill the main stage
* remain visually stable between states
* provide atmosphere only
* not contain real data
* not change shape based on records

### 7.2 Left Floating Habit List

The habit list should contain:

* habit name or wish
* short micro-habit label
* small current-month summary
* selected state
* create-new entry

The list should be visually light. It should not become a table.

Additional rail behavior:

* show the list as a light vertical rail
* keep habit text centered near the rail without intersecting the line
* use a bounded list area
* if there are many habits, auto-scroll by pointer position rather than showing a heavy scrollbar
* place a plus/add control below the rail
* plus/add opens `create.html`

### 7.3 No Habit Selected

When no habit is selected:

* show the river background
* show the left habit list
* show one core motto floating panel over the stage
* hide monthly record objects

Suggested motto:

```text
把今天发生的，轻轻放在河面上。
```

The motto panel can include one secondary line and one action button, but should stay compact.

### 7.4 Habit Selected

When a habit is selected:

* hide the motto panel
* show current month label
* place daily objects on fixed river points
* show object tooltip on hover/focus
* allow clicking an object to show single-day detail or navigate to detail view

Status visual mapping:

| Status | Visual |
| --- | --- |
| `real` | Lotus |
| `entry` | Dark green small leaf |
| `downgrade` | Light green small leaf |
| `missed` | Small stone |
| no record | Faint placeholder ripple |

### 7.5 Today Record Popover

The today record popover should:

* open from `今日记录`
* use fixed height
* float above the river stage
* show today's habits needing records
* allow status selection per habit
* allow optional reason/note
* close without forcing completion

Status choices:

```text
完成
入场
降级
未发生
```

---

## 8. `create.html` UI

The page should remain a behavior design canvas.

Layout:

* left or top: behavior design curve
* center: current step card
* right: live plan preview

Curve nodes:

```text
愿望
原因
行为
筛选
微习惯
提示
```

Final save copy should use river language:

```text
放到河流里
```

Do not show a long form.

---

## 9. `detail.html` UI

### 9.1 Base Layout

The detail page should use:

* same river background as home
* current habit identity at top/left
* week-focused river object overlay
* right collapsible floating panel

It should show one habit, one selected month, and one selected week.

### 9.2 River Detail Stage

The detail stage should:

* use larger spacing than home
* show only the selected week's objects by default
* allow month/week switching with small controls
* keep all objects on fixed points
* avoid chart-like grid dominance

### 9.3 Right Collapsible Panel

Modules:

1. Current plan
2. Execution heatmap
3. Single-day detail

Collapsed state:

* narrow vertical tab or icon button
* keeps river stage visible
* arrow points right

Expanded state:

* fixed width
* scroll internally if needed
* does not cover the top navigation
* arrow points left
* current plan and heatmap modules should remain visually balanced in height

### 9.4 Heatmap Style

The heatmap may reference GitHub contributions in structure:

* small day cells
* weeks grouped horizontally or softly wrapped
* color intensity indicates record type or presence

But it must not look like an engineering statistics panel:

* use rounded small cells
* use soft natural colors
* avoid harsh axes
* avoid dense labels
* avoid performance language

---

## 10. `review.html` UI

The review page should be quiet and insight-oriented.

Layout:

* three MAP cards
* one pattern card
* one adjustment suggestion card

MAP cards:

```text
动机
能力
提示
```

Avoid complicated data dashboards.

---

## 11. `explore.html` UI

Layout:

* inspiration cards
* gentle trace wall
* optional same-goal room preview

The page should feel optional and relaxed.

Do not show:

* ranking
* social pressure
* progress comparison
* performance competition

---

## 12. Responsive Design

Desktop:

* use river stage as the primary center area
* keep habit list on the left
* keep right panel collapsible on detail page

Mobile:

* stack top navigation and habit list carefully
* river stage remains visible
* habit list can become a horizontal selector
* today record popover becomes bottom sheet style
* right detail panel becomes bottom drawer

Minimum requirement:

* page should not break on narrow screens
* buttons should remain tappable
* text should not overflow
* river objects should remain selectable
* floating panels should not cover each other incoherently
