# UI Specification

## 1. Overall UI Direction

The UI should be built around:

```text
Habit Garden
Behavior Design Curve
Habit Tree
Quiet Records
```

The product should feel calm, organic, and lightweight.

It should not look like:

* dashboard
* CRM
* admin panel
* KPI tracker
* calendar-only check-in app
* competition product

## 2. Page List

Required pages:

1. `index.html` — Habit Garden Home
2. `create.html` — Behavior Design Curve
3. `detail.html` — Habit Branch Detail
4. `review.html` — Growth Review
5. `explore.html` — Optional Exploration

## 3. Shared Layout

Each page should include:

* soft background
* simple top navigation
* clear page identity
* one primary visual object
* short guiding copy
* rounded cards
* gentle hover states

The top navigation should be minimal:

```text
花园
设计
复盘
探索
```

The navigation should not dominate. The main navigation should come from visual objects:

* branches
* leaves
* curve nodes
* cards

## 4. Color System

Recommended CSS variables:

```css
:root {
  --color-bg: #f7f3ea;
  --color-surface: #fffdf7;
  --color-surface-soft: #f0eadf;
  --color-primary: #6f8f72;
  --color-primary-dark: #3f5f46;
  --color-primary-light: #dce8d5;
  --color-wood: #a9825a;
  --color-leaf: #7fa86b;
  --color-leaf-pale: #bed4a9;
  --color-yellow-leaf: #d7b56d;
  --color-glow: #f4df9b;
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
```

## 5. Typography

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

| Element       | Style                  |
| ------------- | ---------------------- |
| Page title    | 28-40px, medium weight |
| Main question | 24-32px, medium weight |
| Card title    | 16-20px                |
| Helper text   | 13-15px                |
| Button text   | 14-16px                |

Avoid large blocks of body text.

## 6. `index.html` UI

### 6.1 Empty State

Layout:

* Centered seed/soil visual.
* One headline.
* Three state chips.
* One primary button.
* Optional small theory link.

Suggested copy:

```text
先种下一个容易发生的行为。
```

State chips:

```text
我很有动力
我有点累，但想开始
我只是看看
```

Primary button:

```text
生成一个微习惯方案
```

Visual:

* seed in soil
* subtle glow
* small empty branch silhouette
* soft floating particles

### 6.2 Existing Habit State

Layout:

* Top left: simple greeting
* Center: habit tree
* Right side: today card
* Bottom/right: anonymous glow card

Today card:

```text
今天只做第一步也可以。
```

Tree:

* each branch is clickable
* leaves are hoverable
* yellow leaves are not visually alarming
* branch growth should look organic

## 7. `create.html` UI

The page should be a design canvas.

Layout:

* Left or top: behavior design curve
* Center: current step card
* Right: live plan preview

Curve nodes:

```text
愿望
原因
行为
筛选
微习惯
提示
```

Step card should include:

* one main question
* short choices
* one primary action
* one secondary back action

Live plan preview should gradually fill:

```text
愿望：
黄金行为：
入场动作：
自然提示：
```

Do not show a long form.

## 8. `detail.html` UI

Layout:

* Left: branch summary
* Center: leaf timeline
* Right: today record card or adjustment card

Main sections:

1. Current plan
2. Today action
3. Leaf timeline
4. Plan health
5. Adjustment history

Status visual:

| Status                 | Visual      |
| ---------------------- | ----------- |
| real action completed  | green leaf  |
| entry action completed | pale leaf   |
| downgraded             | small bud   |
| missed                 | yellow leaf |

## 9. `review.html` UI

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

## 10. `explore.html` UI

Layout:

* inspiration cards
* micro-glow wall
* optional same-goal room preview

The page should feel optional and relaxed.

Do not show:

* ranking
* social pressure
* progress comparison
* performance competition

## 11. Responsive Design

Desktop:

* use two or three columns
* keep tree or curve as center visual

Mobile:

* stack sections vertically
* keep one main action visible
* convert large focus map into simpler card ranking if needed

Minimum requirement:

* page should not break on narrow screens
* buttons should remain tappable
* text should not overflow
* tree/curve should scale or scroll gracefully

---