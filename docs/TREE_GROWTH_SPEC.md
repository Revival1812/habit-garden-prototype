# 习惯树 SVG 组件与生长系统设计规范

## 1. 设计目标

本规范用于指导 `habit-garden-prototype` 中“习惯树”的 SVG 资产设计、数据结构设计、渲染逻辑设计和动画交互设计。

习惯树不是静态装饰图，也不是简单的打卡列表可视化。它是整个产品的核心视觉容器，用于表达：

1. 用户创建了哪些习惯。
2. 每个习惯如何随着时间持续生长。
3. 每一天的执行痕迹如何保留。
4. 中断不会导致清零，而是成为树上的黄叶或空枝。
5. 用户可以通过点击枝干进入某个习惯的详情。
6. 首页和详情页使用同一套视觉语言。

核心原则：

```text
不是切换整张树图，而是让树根据数据一点点长出来。
```

---

## 2. 总体方案

采用：

```text
Inline SVG + 组件化 SVG 元素 + 数据驱动渲染 + CSS/JS 生长动画
```

不采用：

```text
多张完整树状态图切换
```

原因：

1. 完整状态图数量会迅速爆炸。
2. 不利于 hover、click、高亮、tooltip 等交互。
3. 不利于动态生成习惯分支。
4. 不利于根据年、月、周、日记录扩展。
5. 不利于首页和详情页复用同一套树逻辑。

最终实现方式：

```html
<svg id="habit-tree-scene" viewBox="0 0 1200 900">
  <defs>
    <!-- gradients / filters / leaf symbols / branch styles -->
  </defs>

  <g id="tree-trunk-layer"></g>
  <g id="habit-branch-layer"></g>
  <g id="leaf-layer"></g>
  <g id="tree-overlay-layer"></g>
</svg>
```

JS 根据 `localStorage` 中的 habit 和 record 数据，动态生成：

* 树干
* 习惯主枝
* 年枝
* 月枝
* 周枝
* 每日叶子
* hover 高亮
* tooltip
* 生长动画

---

## 3. 树的层级结构

习惯树采用五级时间结构。

```text
总树干 trunk
└── 习惯主枝 habit branch
    └── 年枝 year branch
        └── 月枝 month branch
            └── 周枝 week twig
                └── 日叶 daily leaf
```

### 3.1 总树干 trunk

含义：

```text
用户整体的行为系统。
```

视觉要求：

* 位于首页中心或偏下位置。
* 比其他枝干更粗。
* 有木质感。
* 可使用渐变、纹理、轻微阴影。
* 不承载具体点击行为，只作为总结构基础。

### 3.2 习惯主枝 habit branch

含义：

```text
一个用户创建的习惯。
```

视觉要求：

* 从总树干上分出。
* 每创建一个新习惯，生成一条新的习惯主枝。
* 不同习惯主枝可以向左、右、上方不同方向分布。
* 鼠标 hover 时，整条习惯主枝及其子枝、叶子整体高亮。
* 点击后进入 `detail.html`，查看该习惯详情。

### 3.3 年枝 year branch

含义：

```text
某个习惯在某一年的记录集合。
```

视觉要求：

* 从习惯主枝上继续延伸。
* 粗细小于习惯主枝，大于月枝。
* 首页中可以弱化显示。
* 详情页中可以更明确显示年份节点。

### 3.4 月枝 month branch

含义：

```text
某个习惯在某个月的记录集合。
```

视觉要求：

* 从年枝上分出。
* 每进入新月份生成一个月枝。
* 月枝可以带有轻微弯曲，避免机械直线。
* 如果首页空间有限，只展示最近 1-3 个月，历史月份可折叠或简化为小结点。

### 3.5 周枝 week twig

含义：

```text
某个月中一个自然周或连续 7 天记录。
```

视觉要求：

* 从月枝上分出。
* 每 7 天形成一个周枝。
* 周枝较细。
* 每个周枝最多承载 7 片日叶。
* 用户坚持一周后，该周枝视觉上会更完整。

### 3.6 日叶 daily leaf

含义：

```text
某一天的执行记录。
```

状态：

| 状态        | 含义     | 视觉           |
| --------- | ------ | ------------ |
| real      | 完成真实行动 | 深绿色叶子        |
| entry     | 完成入场动作 | 浅绿色叶子        |
| downgrade | 今天降级   | 小芽或半叶        |
| missed    | 今天没有发生 | 暖黄色叶子        |
| empty     | 尚未记录   | 可不显示，或显示淡色芽点 |

重要原则：

```text
黄叶不是失败标记，而是“这一天也被留下来了”。
```

---

## 4. 时间分支规则

### 4.1 创建新习惯

当用户在 `create.html` 完成流程并点击：

```text
放到我的树上
```

系统应：

1. 创建一个 habit 对象。
2. 保存到 `localStorage`。
3. 首页树干上生成一条新的习惯主枝。
4. 该主枝初始可以只有一段枝干和一个小芽。
5. 不需要立即显示大量叶子。

### 4.2 第一次记录

当该习惯第一次产生记录时：

1. 在习惯主枝上生成当前年份的年枝。
2. 在年枝上生成当前月份的月枝。
3. 在月枝上生成当前周的周枝。
4. 在周枝上生成当天的叶子。

### 4.3 每日记录

每天记录一次时：

* 如果当天已存在 record，则更新当天叶子状态。
* 如果当天没有 record，则添加新叶子。
* 叶子位置由该日期在当前周中的序号决定。

### 4.4 每 7 天形成周枝

一个周枝最多容纳 7 片叶子。

当记录进入新的一周：

1. 月枝上生成新的周枝。
2. 新周枝从月枝上分叉。
3. 新周枝承载新一周的叶子。

### 4.5 每月形成月枝

当记录进入新月份：

1. 当前年枝上生成新的月枝。
2. 新月枝从年枝不同位置分出。
3. 首页可只展示最近几个月。
4. 详情页可以展示完整月份结构。

### 4.6 每年形成年枝

当记录进入新年份：

1. 习惯主枝上生成新的年枝。
2. 年枝可作为更粗的二级结构。
3. 首页默认弱化历史年枝。
4. 详情页可通过“年份切换”或横向展开查看。

---

## 5. 首页与详情页的职责区分

### 5.1 首页树

首页重点不是完整时间档案，而是总览。

首页展示目标：

1. 当前有哪些习惯。
2. 每个习惯最近是否在生长。
3. 哪些习惯有绿叶、浅绿叶、黄叶。
4. 用户可以点击习惯主枝进入详情。
5. 用户感觉树在持续生长。

首页不适合展示过多细节。

首页建议展示：

```text
习惯主枝
最近年份
最近 1-3 个月枝
最近若干周枝
最近 7-21 天叶子
```

超过范围的历史记录可以浓缩为：

* 年轮
* 小结点
* 淡色旧枝
* 折叠的叶痕

### 5.2 详情页树

详情页针对单个习惯展开。

详情页展示目标：

1. 查看该习惯完整方案。
2. 查看每日记录。
3. 查看周、月维度变化。
4. 查看黄叶原因。
5. 查看调整历史。
6. 记录今日状态。

详情页可以只渲染选中习惯的主枝，并将其放大。

详情页结构：

```text
左侧：习惯方案摘要
中间：单习惯枝干时间线
右侧：今日记录卡 / 方案健康度
```

---

## 6. SVG 资产设计规范

当前项目中已有：

```text
assets/svg/tree.svg
assets/svg/seed.svg
assets/svg/leaf.svg
assets/svg/glow.svg
```

建议保留这四个基础文件，同时新增一个组件化目录：

```text
assets/svg/tree-parts/
├─ trunk-base.svg
├─ branch-main-left.svg
├─ branch-main-right.svg
├─ branch-year-a.svg
├─ branch-year-b.svg
├─ branch-month-a.svg
├─ branch-month-b.svg
├─ branch-month-c.svg
├─ branch-week-a.svg
├─ branch-week-b.svg
├─ branch-week-c.svg
├─ leaf-real-a.svg
├─ leaf-real-b.svg
├─ leaf-entry-a.svg
├─ leaf-entry-b.svg
├─ leaf-missed-a.svg
├─ leaf-missed-b.svg
├─ leaf-bud-a.svg
├─ leaf-bud-b.svg
├─ bark-texture.svg
└─ glow-filter.svg
```

第一版不一定要全部完成，但应按这个结构设计。

---

## 7. 必要 SVG 组件清单

### 7.1 树干组件

文件：

```text
trunk-base.svg
```

用途：

* 首页总树干。
* 不包含具体习惯分支。
* 可作为静态底座。

视觉要求：

* 深浅木色渐变。
* 轻微纹理。
* 边缘不能太硬。
* 底部略粗，上方收窄。
* 保持自然形态，不要几何化。

建议：

```text
用 path 绘制树干主形体。
使用 linearGradient 表现木质明暗。
使用少量半透明 path 表现树皮纹理。
```

### 7.2 习惯主枝组件

文件：

```text
branch-main-left.svg
branch-main-right.svg
```

用途：

* 表示一个完整习惯的主分支。
* 创建新习惯时从树干分出。

视觉要求：

* 比年枝更粗。
* 有明显木质感。
* 左右方向各有模板。
* 不能每条都一样，可通过旋转、缩放、轻微 path 变体制造自然感。

### 7.3 年枝组件

文件：

```text
branch-year-a.svg
branch-year-b.svg
```

用途：

* 表示某习惯某一年的记录集合。

视觉要求：

* 粗细中等。
* 与主枝连接自然。
* 可以有小年轮结点。
* 首页中可以弱化，详情页中可以显示年份标签。

### 7.4 月枝组件

文件：

```text
branch-month-a.svg
branch-month-b.svg
branch-month-c.svg
```

用途：

* 表示某个月。
* 从年枝上分出。

视觉要求：

* 中细枝干。
* 弯曲程度适中。
* 可向不同方向分布。
* 每个月枝可承载 4-5 个周枝。

### 7.5 周枝组件

文件：

```text
branch-week-a.svg
branch-week-b.svg
branch-week-c.svg
```

用途：

* 表示一个周。
* 每条周枝最多承载 7 片叶子。

视觉要求：

* 细枝。
* 可以较短。
* 分叉角度自然。
* 叶子应沿周枝分布，而不是机械排成直线。

### 7.6 叶子组件

文件：

```text
leaf-real-a.svg
leaf-real-b.svg
leaf-entry-a.svg
leaf-entry-b.svg
leaf-missed-a.svg
leaf-missed-b.svg
leaf-bud-a.svg
leaf-bud-b.svg
```

状态设计：

#### real

含义：

```text
完成真实行动。
```

视觉：

* 深绿色。
* 叶片饱满。
* 可略大。

#### entry

含义：

```text
只完成入场动作。
```

视觉：

* 浅绿色。
* 叶片略小。
* 不要显得像失败。

#### downgrade

含义：

```text
今天降级完成。
```

视觉：

* 小芽。
* 介于叶子和节点之间。
* 表示“今天保留了入口”。

#### missed

含义：

```text
今天没有发生，但留下了原因。
```

视觉：

* 暖黄色。
* 不使用红色。
* 可以略微下垂。
* 不要像错误标志。

---

## 8. Inline SVG 结构规范

建议首页树使用一个主要 SVG 容器。

```html
<section class="garden-tree-panel">
  <svg
    id="habit-tree-scene"
    class="habit-tree-scene"
    viewBox="0 0 1200 900"
    role="img"
    aria-label="习惯树"
  >
    <defs id="tree-defs">
      <!-- gradients, filters, symbols -->
    </defs>

    <g id="tree-trunk-layer" class="tree-layer tree-trunk-layer"></g>
    <g id="habit-branch-layer" class="tree-layer habit-branch-layer"></g>
    <g id="leaf-layer" class="tree-layer leaf-layer"></g>
    <g id="tree-overlay-layer" class="tree-layer tree-overlay-layer"></g>
  </svg>

  <div id="tree-tooltip" class="tree-tooltip" hidden></div>
</section>
```

不建议在首页直接使用：

```html
<img src="assets/svg/tree.svg">
```

因为 `img` 无法很好地控制内部 path、group、hover、click 和动画。

---

## 9. SVG 分组规范

每个习惯分支应作为一个独立 group。

```html
<g class="habit-branch" data-habit-id="habit_001">
  <path class="branch-path habit-main-path" />

  <g class="year-branch" data-year="2026">
    <path class="branch-path year-path" />

    <g class="month-branch" data-month="2026-06">
      <path class="branch-path month-path" />

      <g class="week-branch" data-week="2026-W23">
        <path class="branch-path week-path" />

        <g class="daily-leaves">
          <use class="leaf leaf-real" data-date="2026-06-10" />
          <use class="leaf leaf-entry" data-date="2026-06-11" />
          <use class="leaf leaf-missed" data-date="2026-06-12" />
        </g>
      </g>
    </g>
  </g>
</g>
```

### 9.1 Class 命名规则

枝干：

```text
habit-branch
year-branch
month-branch
week-branch
branch-path
habit-main-path
year-path
month-path
week-path
```

叶子：

```text
leaf
leaf-real
leaf-entry
leaf-downgrade
leaf-missed
leaf-new
```

状态：

```text
is-hovered
is-selected
is-dimmed
is-growing
is-new
```

### 9.2 Data 属性规则

每个可交互元素应带上数据属性。

习惯主枝：

```html
<g class="habit-branch" data-habit-id="habit_001">
```

年枝：

```html
<g class="year-branch" data-year="2026">
```

月枝：

```html
<g class="month-branch" data-month="2026-06">
```

周枝：

```html
<g class="week-branch" data-week="2026-W23">
```

叶子：

```html
<use class="leaf leaf-real" data-date="2026-06-10" data-status="real">
```

---

## 10. 数据结构规范

### 10.1 habit 数据

```js
{
  id: "habit_001",
  wish: "减少熬夜后的疲惫感",
  reason: "最近学习效率下降",
  goldenBehavior: "晚饭后坐到书桌前",
  microHabitType: "scene-transition",
  entryAction: "打开台灯并坐下",
  realAction: "学习 10 分钟",
  prompt: "晚饭后回到宿舍",
  promptSentence: "当我晚饭后回到宿舍之后，我就打开台灯并坐下。",
  promptStrength: "visual",
  trialDays: 3,
  createdAt: "2026-06-10",
  records: [],
  adjustments: []
}
```

### 10.2 record 数据

```js
{
  date: "2026-06-10",
  status: "entry",
  reason: "",
  note: "完成了入场动作"
}
```

### 10.3 record status

```text
real       完成真实行动
entry      完成入场动作
downgrade  今天降级
missed     今天没有发生
```

---

## 11. 树渲染数据转换

不要直接用原始 records 渲染树。应先把 records 转成分层结构。

### 11.1 输入

```js
habit.records
```

### 11.2 输出

```js
{
  habitId: "habit_001",
  years: [
    {
      year: 2026,
      months: [
        {
          month: "2026-06",
          weeks: [
            {
              week: "2026-W23",
              days: [
                {
                  date: "2026-06-10",
                  status: "entry",
                  reason: "",
                  note: "完成了入场动作"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 11.3 推荐函数

在 `assets/js/garden.js` 或后续单独的 `tree-renderer.js` 中实现：

```js
function groupRecordsByTime(records) {}

function buildTreeModel(habits) {}

function renderHabitTree(svg, treeModel, options) {}

function renderHabitBranch(group, habitModel, layoutConfig) {}

function renderYearBranch(group, yearModel, layoutConfig) {}

function renderMonthBranch(group, monthModel, layoutConfig) {}

function renderWeekBranch(group, weekModel, layoutConfig) {}

function renderLeaf(group, dayRecord, positionConfig) {}
```

第一版可以先不单独创建 `tree-renderer.js`，但建议后续拆出。

---

## 12. 树布局算法规范

### 12.1 首页布局原则

首页中多条习惯主枝从树干不同高度分出。

示例：

```js
const branchAnchors = [
  { x: 575, y: 610, side: "left", angle: -32 },
  { x: 620, y: 555, side: "right", angle: 26 },
  { x: 560, y: 500, side: "left", angle: -22 },
  { x: 640, y: 455, side: "right", angle: 18 },
  { x: 585, y: 405, side: "left", angle: -16 }
];
```

规则：

1. 分支左右交替。
2. 分支起点沿树干向上分布。
3. 习惯数量较多时，旧习惯可以缩小或淡化。
4. 首页优先展示最近活跃习惯。
5. 不要让所有分支挤在同一区域。

### 12.2 单习惯分支布局

一个习惯主枝内部：

```text
主枝向外延伸
年枝沿主枝方向继续
月枝从年枝分叉
周枝从月枝分叉
叶子沿周枝排列
```

### 12.3 周枝叶子布局

一条周枝最多 7 片叶子。

叶子分布不应完全等距直线，可以轻微上下错开。

示例：

```js
const leafOffsets = [
  { t: 0.15, dx: 0, dy: -8, rotate: -18 },
  { t: 0.28, dx: 0, dy: 8, rotate: 14 },
  { t: 0.41, dx: 0, dy: -7, rotate: -10 },
  { t: 0.54, dx: 0, dy: 7, rotate: 12 },
  { t: 0.67, dx: 0, dy: -6, rotate: -8 },
  { t: 0.80, dx: 0, dy: 6, rotate: 10 },
  { t: 0.92, dx: 0, dy: -4, rotate: -6 }
];
```

`t` 表示叶子在周枝 path 上的位置比例。

第一版如果不方便计算 path 点位，可以使用预设坐标。

---

## 13. SVG path 生成策略

### 13.1 推荐使用 JS 动态生成 path

不建议所有枝干都用固定 SVG 文件。更好的方式是：

1. 树干使用固定 SVG 或固定 path。
2. 枝干使用 JS 根据起点、终点、弯曲度生成 cubic Bézier path。
3. 叶子使用 `<symbol>` 或 `<use>` 复用。

### 13.2 枝干 path 示例

```js
function createBranchPath(start, end, curve = 0.35) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const c1 = {
    x: start.x + dx * curve,
    y: start.y + dy * 0.15
  };

  const c2 = {
    x: start.x + dx * (1 - curve),
    y: end.y - dy * 0.15
  };

  return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
}
```

### 13.3 为什么推荐动态 path

优点：

1. 可根据习惯数量自动布局。
2. 可避免分支完全重复。
3. 更容易做生长动画。
4. 更容易控制 hover 范围。
5. 不需要提前画大量分支图片。

---

## 14. SVG 质感策略

### 14.1 树干质感

建议使用：

* linearGradient
* radialGradient
* 半透明纹理线
* filter drop-shadow
* 少量 noise filter

树干不要过于真实，以免和简洁 UI 冲突。

### 14.2 枝干质感

枝干 path 可以分两层：

```html
<path class="branch-shadow" />
<path class="branch-core" />
```

或者：

```html
<path class="branch-path branch-underlay" />
<path class="branch-path branch-highlight" />
```

表现方式：

* underlay 较粗，颜色较深。
* highlight 较细，颜色略亮。
* 叠加后形成木质明暗。

### 14.3 叶子质感

叶子可以使用：

* fill gradient
* 中央叶脉线
* 轻微阴影
* 2-3 个形态变体

不建议：

* 使用照片风叶子
* 过度复杂纹理
* 过强描边

---

## 15. 生长动画规范

### 15.1 枝干生长

使用 `stroke-dasharray` 和 `stroke-dashoffset`。

CSS 示例：

```css
.branch-path.is-growing {
  stroke-dasharray: var(--path-length);
  stroke-dashoffset: var(--path-length);
  animation: grow-branch 900ms ease-out forwards;
}

@keyframes grow-branch {
  to {
    stroke-dashoffset: 0;
  }
}
```

JS 需要计算 path 长度：

```js
const length = path.getTotalLength();
path.style.setProperty("--path-length", length);
path.classList.add("is-growing");
```

### 15.2 叶子生长

叶子出现：

```css
.leaf.is-new {
  opacity: 0;
  transform: scale(0.72);
  transform-box: fill-box;
  transform-origin: center;
  animation: grow-leaf 520ms ease-out forwards;
}

@keyframes grow-leaf {
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 15.3 黄叶出现

黄叶不要使用错误动效。

建议：

```css
.leaf-missed.is-new {
  opacity: 0;
  transform: translateY(-4px) scale(0.85) rotate(-4deg);
  animation: yellow-leaf-settle 620ms ease-out forwards;
}

@keyframes yellow-leaf-settle {
  to {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0);
  }
}
```

### 15.4 分支高亮

hover 某个 habit branch：

```css
.habit-branch.is-hovered .branch-path {
  filter: url(#soft-glow);
  stroke-opacity: 1;
}

.habit-branch.is-hovered .leaf {
  opacity: 1;
}

.habit-branch.is-dimmed {
  opacity: 0.36;
}
```

### 15.5 新习惯创建动画

顺序：

```text
主枝生长
→ 年/月/周小枝淡入
→ 小芽出现
→ 轻微 glow
```

时间建议：

| 动画      | 时间          |
| ------- | ----------- |
| 主枝生长    | 800-1100ms  |
| 子枝生长    | 600-800ms   |
| 叶子出现    | 400-600ms   |
| glow 脉冲 | 1200-1800ms |

---

## 16. 交互规范

### 16.1 Hover 习惯主枝

触发区域：

```text
整个 .habit-branch group
```

效果：

1. 当前习惯主枝高亮。
2. 子枝和叶子略微变亮。
3. 其他习惯分支可轻微淡化。
4. 出现简短 tooltip。

Tooltip 内容：

```text
习惯名称
最近一次记录
当前试运行状态
```

示例：

```text
晚饭后坐到书桌前
最近：完成入场动作
```

### 16.2 Click 习惯主枝

行为：

1. 保存 `selectedHabitId`。
2. 当前分支短暂高亮。
3. 跳转到 `detail.html`。

### 16.3 Hover 叶子

Tooltip 内容：

```text
日期
状态
原因或备注
```

示例：

```text
6 月 10 日
完成入场动作
```

黄叶示例：

```text
6 月 12 日
今天太累了
这也会留下来
```

### 16.4 Click 叶子

第一版可只显示 tooltip。

后续可扩展：

* 打开当天记录详情。
* 在详情页定位到某一天。
* 显示当天调整建议。

### 16.5 Detail 页面分支交互

详情页中只展示当前习惯分支。

支持：

1. hover 叶子查看记录。
2. 点击周枝查看该周摘要。
3. 点击月枝查看该月摘要。
4. 今日记录后，在当前周枝上长出新叶。

第一版可以只实现叶子 hover 和今日记录生长。

---

## 17. 首页与详情页复用规范

不要为首页和详情页写两套完全不同的树逻辑。

建议抽象出一个渲染器：

```js
renderHabitTree({
  container,
  habits,
  mode: "home"
});
```

```js
renderHabitTree({
  container,
  habits: [selectedHabit],
  mode: "detail"
});
```

### 17.1 home mode

特点：

* 多习惯。
* 树干完整显示。
* 每个习惯一条主枝。
* 只显示最近记录。
* 点击主枝进入详情。

### 17.2 detail mode

特点：

* 单习惯。
* 分支放大。
* 显示更多时间层级。
* 显示更多叶子。
* 与今日记录卡联动。

如果第一版不想单独拆渲染器，也至少要保证：

```text
首页和详情页使用相同 class 命名、颜色、叶子状态和数据结构。
```

---

## 18. 渐进实现阶段

### 阶段 1：基础树替换

目标：

```text
替换当前简单 tree.svg/img 逻辑，改为 inline SVG 容器。
```

实现内容：

1. 首页显示 inline SVG 树干。
2. 根据 habits 渲染习惯主枝。
3. 每个 habit 有一条 branch。
4. branch 可以 hover 高亮。
5. branch 可以 click 进入详情。

暂不要求完整年/月/周结构。

### 阶段 2：叶子记录接入

目标：

```text
让 records 映射成叶子。
```

实现内容：

1. real → 绿叶。
2. entry → 浅绿叶。
3. downgrade → 小芽。
4. missed → 黄叶。
5. 叶子 hover 显示 tooltip。
6. detail 记录后首页同步显示。

### 阶段 3：周枝结构

目标：

```text
每 7 天形成一个周枝。
```

实现内容：

1. records 按周分组。
2. 每个 week 渲染一条 week twig。
3. 每周最多 7 片叶子。
4. 新周自动生成新周枝。

### 阶段 4：月枝结构

目标：

```text
每个月形成月枝。
```

实现内容：

1. records 按月分组。
2. 月枝承载周枝。
3. detail 页面显示完整月份。
4. 首页只显示最近月份。

### 阶段 5：年枝结构

目标：

```text
长期习惯形成年度结构。
```

实现内容：

1. records 按年分组。
2. 年枝承载月枝。
3. 首页折叠历史年份。
4. detail 页面可展开年份。

### 阶段 6：质感与丝滑动画

目标：

```text
让树变得有质感、有生命感。
```

实现内容：

1. 树干纹理。
2. 枝干渐变。
3. branch drawing animation。
4. leaf growth animation。
5. hover glow。
6. reduced motion 支持。

---

## 19. 第一版最小可实现范围

为了避免一次性过度复杂，第一版建议只实现：

```text
总树干
→ 习惯主枝
→ 最近周枝
→ 最近 7-14 天叶子
```

也就是说，第一版可以先不完整展示年/月结构，但数据和 class 命名要为后续预留。

第一版必须实现：

1. 新习惯生成新主枝。
2. 今日记录生成对应叶子。
3. 叶子状态区分 real / entry / downgrade / missed。
4. hover 分支高亮。
5. 点击分支进入详情。
6. 黄叶不表示失败。
7. 生长动画基本可见。

---

## 20. 对 Claude Code / Codex 的分阶段实现提示词建议

本节用于指导 AI 编程助手逐步实现习惯树生长系统。

重要原则：

```text
不要一次性实现完整年/月/周/日树结构。
先实现可运行的树渲染最小闭环，再逐步增加时间分层、动画、质感和详情页复用。
```

推荐实现顺序：

```text
阶段 0：建立树渲染子系统边界
阶段 1：替换首页静态树为 inline SVG 容器
阶段 2：实现树干和习惯主枝渲染
阶段 3：接入 localStorage habit 数据
阶段 4：接入 records 并渲染叶子
阶段 5：实现 hover、tooltip、click 交互
阶段 6：实现基础生长动画
阶段 7：增加周枝结构
阶段 8：让 detail 页面复用单习惯树逻辑
阶段 9：再考虑月枝、年枝和更高级质感
```

第一版必须完成：

```text
创建习惯 → 首页长出新主枝
记录今天 → 枝上出现绿叶 / 浅绿叶 / 小芽 / 黄叶
hover 枝干 → 整条习惯分支高亮
click 枝干 → 进入 detail.html
刷新页面 → 树状态仍然存在
```

第一版暂时不强求：

```text
完整年枝
完整月枝
所有历史叶子
复杂折叠展开
高度拟真的树皮纹理
复杂 SVG morph 动画
```

---

### 20.1 阶段 0：建立树渲染子系统边界

目标：

先让 AI 理解，习惯树是一个独立子系统，不是首页的普通装饰图。

建议新增文件：

```text
assets/js/tree-renderer.js
assets/js/tree-layout.js
assets/js/tree-model.js
```

也可以第一版先只新增：

```text
assets/js/tree-renderer.js
```

但为了后续维护，推荐拆成三个文件：

| 文件                 | 作用                       |
| ------------------ | ------------------------ |
| `tree-model.js`    | 将 habits 和 records 转为树模型 |
| `tree-layout.js`   | 计算枝干、叶子、坐标、角度            |
| `tree-renderer.js` | 根据模型生成 inline SVG DOM    |

Claude Code / Codex Prompt：

```text
请先读取：
- CLAUDE.md
- docs/TREE_GROWTH_SPEC.md
- docs/UI_SPEC.md
- docs/INTERACTION_SPEC.md
- .claude/skills/static-prototype-code-skill/SKILL.md
- .claude/skills/visual-garden-ui-skill/SKILL.md

本轮只允许修改或新增：
- assets/js/tree-model.js
- assets/js/tree-layout.js
- assets/js/tree-renderer.js

不要修改 index.html。
不要修改 garden.js。
不要修改 detail.html。
不要修改现有业务逻辑。

本轮目标：
1. 建立习惯树渲染子系统的基础函数，但不接入页面。
2. tree-model.js 负责把 habits 转为 treeModel。
3. tree-layout.js 负责提供主枝、叶子、角度、坐标的计算函数。
4. tree-renderer.js 负责暴露 renderHabitTree(options) 函数。
5. 当前只需要写函数框架和简单可用实现，不需要完整年/月/周。
6. 不引入框架，不引入 npm，不依赖后端。

数据输入：
- habits 数组
- 每个 habit 包含 id、wish、goldenBehavior、records

第一版 treeModel 结构：
{
  habits: [
    {
      id,
      title,
      branchIndex,
      records: [
        { date, status, reason, note }
      ]
    }
  ]
}

请实现以下函数：
- buildTreeModel(habits)
- getBranchAnchor(index, total)
- createBranchPath(start, end, curve)
- getLeafPositionsForBranch(branchIndex, recordCount)
- renderHabitTree({ svg, habits, mode, onBranchClick, onLeafHover })

完成后请输出：
1. 新增了哪些文件
2. 每个文件的职责
3. 当前还没有接入页面的原因
4. 下一步应该如何接入 index.html
```

验收标准：

```text
有 tree-renderer.js
有 buildTreeModel()
有 renderHabitTree()
代码不依赖框架
代码没有立刻破坏首页
```

---

### 20.2 阶段 1：替换首页静态树为 inline SVG 容器

目标：

把首页原本简单的 `img tree.svg` 或静态树结构，替换为可动态渲染的 inline SVG 容器。

Claude Code / Codex Prompt：

```text
请先读取：
- CLAUDE.md
- docs/TREE_GROWTH_SPEC.md
- .claude/skills/static-prototype-code-skill/SKILL.md
- .claude/skills/visual-garden-ui-skill/SKILL.md

本轮只允许修改：
- index.html
- assets/css/garden.css
- assets/js/garden.js

可以读取但不要修改：
- assets/js/app-state.js
- assets/js/tree-renderer.js
- assets/js/tree-model.js
- assets/js/tree-layout.js

本轮目标：
1. 将首页已有的静态树图替换为 inline SVG 容器。
2. index.html 中增加：
   <svg id="habit-tree-scene" class="habit-tree-scene" viewBox="0 0 1200 900"></svg>
3. 增加 tooltip 容器：
   <div id="tree-tooltip" class="tree-tooltip" hidden></div>
4. 在 garden.js 中获取 habit-tree-scene，并调用 renderHabitTree()。
5. 如果 localStorage 中没有 habit，仍然显示原来的种子/空状态。
6. 如果 localStorage 中有 habit，显示 inline SVG 树。
7. 当前阶段只需要容器和调用成功，不要求视觉最终美观。

硬性约束：
- 不使用 img 标签作为主树。
- 不引入框架。
- 不重写 create.html 和 detail.html。
- 不破坏首页空状态。
- 不出现 dashboard 风格。

完成后请输出：
1. 修改了哪些文件
2. 首页空状态如何测试
3. 首页有习惯状态如何测试
4. SVG 容器是否已经接入 renderHabitTree()
```

验收标准：

```text
index.html 中有 inline SVG
空状态仍然可用
有 habit 时进入 SVG 树状态
没有控制台错误
```

---

### 20.3 阶段 2：实现树干和习惯主枝

目标：

先只实现：

```text
树干 trunk
→ 每个 habit 一条主枝
```

暂时不要做年/月/周。

Claude Code / Codex Prompt：

```text
请先读取：
- docs/TREE_GROWTH_SPEC.md
- .claude/skills/visual-garden-ui-skill/SKILL.md
- .claude/skills/micro-interaction-motion-skill/SKILL.md
- .claude/skills/static-prototype-code-skill/SKILL.md

本轮只允许修改：
- assets/js/tree-renderer.js
- assets/js/tree-layout.js
- assets/css/garden.css
- assets/css/animations.css

不要修改 create.html。
不要修改 detail.html。
不要修改 localStorage 数据结构。

本轮目标：
1. 在 inline SVG 中渲染基础树干。
2. 树干可以先用 SVG path 生成，不必依赖外部 tree.svg。
3. 每个 habit 渲染为一个：
   <g class="habit-branch" data-habit-id="...">
4. 每个 habit-branch 至少包含一条主枝 path。
5. 主枝左右交替分布，不能全部挤在一起。
6. 主枝应从树干不同高度自然分出。
7. 主枝有基础木色、圆角线帽、柔和阴影。
8. 每条主枝末端可以显示一个小芽，表示习惯已种下。

第一版只需要：
- trunk
- habit main branch
- branch bud

暂时不要渲染 records 叶子。

完成后请输出：
1. 修改了哪些文件
2. 树干如何生成
3. 习惯主枝如何布局
4. 如何通过创建多个 habit 测试多枝干显示
```

验收标准：

```text
有 trunk
每个 habit 有主枝
多 habit 左右交替
没有叶子也能显示小芽
视觉不像任务列表
```

---

### 20.4 阶段 3：接入 records 并渲染最近叶子

目标：

将 `habit.records` 渲染为叶子。第一版只显示最近 14 天或最近 21 条记录，避免首页太复杂。

Claude Code / Codex Prompt：

```text
请读取：
- docs/TREE_GROWTH_SPEC.md
- docs/COPY_RULES.md
- .claude/skills/visual-garden-ui-skill/SKILL.md
- .claude/skills/static-prototype-code-skill/SKILL.md

本轮只允许修改：
- assets/js/tree-model.js
- assets/js/tree-layout.js
- assets/js/tree-renderer.js
- assets/css/garden.css

可以读取但不要大改：
- assets/js/app-state.js
- assets/js/detail.js

本轮目标：
1. 将 habit.records 映射为叶子。
2. 第一版首页只显示每个 habit 最近 14 条 records。
3. record.status 映射规则：
   - real → leaf-real 深绿叶
   - entry → leaf-entry 浅绿叶
   - downgrade → leaf-downgrade 小芽
   - missed → leaf-missed 黄叶
4. 叶子应沿习惯主枝或最近周枝错落分布，不要机械排成表格。
5. 每个叶子必须带 data-date 和 data-status。
6. 叶子应有 title 或可被 tooltip 读取的数据。
7. 黄叶不能使用红色，不能表达失败。

暂时不要求：
- 完整周枝
- 完整月枝
- 完整年枝

完成后请输出：
1. 修改了哪些文件
2. records 如何映射为叶子
3. 四种 status 如何测试
4. 首页最多显示多少片叶子
```

验收标准：

```text
real 是深绿叶
entry 是浅绿叶
downgrade 是小芽
missed 是黄叶
刷新后叶子仍在
叶子不是表格排列
```

---

### 20.5 阶段 4：hover、tooltip、click 交互

目标：

让树成为真正的导航，而不是装饰。

Claude Code / Codex Prompt：

```text
请读取：
- docs/TREE_GROWTH_SPEC.md
- docs/INTERACTION_SPEC.md
- docs/COPY_RULES.md
- .claude/skills/fogg-habit-ux-skill/SKILL.md
- .claude/skills/static-prototype-code-skill/SKILL.md

本轮只允许修改：
- assets/js/tree-renderer.js
- assets/js/garden.js
- assets/css/garden.css

可以读取但不要大改：
- assets/js/app-state.js

本轮目标：
1. hover 某个 .habit-branch 时，整条习惯分支高亮。
2. hover 当前分支时，其他分支轻微淡化。
3. click 某个 .habit-branch 时：
   - 调用 setSelectedHabitId(habitId)
   - 跳转到 detail.html
4. hover 叶子时显示 tooltip。
5. tooltip 内容包括：
   - 日期
   - 状态短文案
   - 如果是 missed，显示“这也会留下来”
6. tooltip 文案必须短，不使用“失败”。

状态文案：
- real：完成真实行动
- entry：完成入场动作
- downgrade：今天调轻了
- missed：这也会留下来

完成后请输出：
1. 修改了哪些文件
2. hover 分支如何测试
3. click 分支如何测试
4. hover 叶子 tooltip 如何测试
```

验收标准：

```text
hover 分支整体高亮
其他分支淡化
click 分支进入 detail.html
叶子 tooltip 正常
tooltip 文案低压
```

---

### 20.6 阶段 5：基础生长动画

目标：

让新枝和新叶有“长出来”的感觉。

Claude Code / Codex Prompt：

```text
请读取：
- docs/TREE_GROWTH_SPEC.md
- .claude/skills/micro-interaction-motion-skill/SKILL.md
- .claude/skills/visual-garden-ui-skill/SKILL.md

本轮只允许修改：
- assets/css/animations.css
- assets/css/garden.css
- assets/js/tree-renderer.js

不要修改数据结构。
不要修改 create.html。
不要修改 detail.html。

本轮目标：
1. 主枝出现时使用 stroke-dasharray / stroke-dashoffset 实现生长动画。
2. 叶子出现时使用 opacity + scale 实现轻微生长动画。
3. 黄叶出现时使用柔和 fade，不使用错误动画。
4. hover 高亮使用 soft glow，不要强烈发光。
5. 支持 prefers-reduced-motion。
6. 不使用 confetti，不使用 bounce，不使用红色 warning。

完成后请输出：
1. 修改了哪些文件
2. 枝干生长动画如何实现
3. 叶子出现动画如何实现
4. reduced motion 是否支持
```

验收标准：

```text
枝干不是突然出现
叶子有轻微生长
黄叶不刺眼
动画不卡顿
没有夸张庆祝
```

---

### 20.7 阶段 6：增加周枝结构

目标：

引入“7 天形成一个周枝”的逻辑。
注意：先做周枝，不要同时做月枝和年枝。

Claude Code / Codex Prompt：

```text
请读取：
- docs/TREE_GROWTH_SPEC.md
- .claude/skills/static-prototype-code-skill/SKILL.md
- .claude/skills/visual-garden-ui-skill/SKILL.md

本轮只允许修改：
- assets/js/tree-model.js
- assets/js/tree-layout.js
- assets/js/tree-renderer.js
- assets/css/garden.css

本轮目标：
1. 新增 groupRecordsByWeek(records)。
2. 将 habit.records 按周分组。
3. 每个 week 渲染为：
   <g class="week-branch" data-week="...">
4. 每个 week branch 中最多显示 7 片叶子。
5. 首页只显示最近 2-3 个 week branch。
6. 周枝从习惯主枝或简化月枝上分出。
7. 叶子沿周枝错落排列。
8. 保留之前的 hover、click、tooltip 逻辑。

暂时不要实现：
- 月份折叠
- 年份折叠
- 复杂历史导航

完成后请输出：
1. 修改了哪些文件
2. records 如何按周分组
3. 每周叶子如何排列
4. 首页最多展示几个周枝
5. 如何构造测试数据验证跨周记录
```

验收标准：

```text
7 天内叶子在同一周枝
跨周后生成新周枝
首页不拥挤
hover/click 仍正常
```

---

### 20.8 阶段 7：detail 页面复用单习惯树

目标：

详情页不要再使用普通时间列表作为主视觉，而是使用同一套树枝视觉语言展示当前习惯。

Claude Code / Codex Prompt：

```text
请读取：
- docs/TREE_GROWTH_SPEC.md
- docs/UI_SPEC.md
- docs/INTERACTION_SPEC.md
- docs/COPY_RULES.md
- .claude/skills/fogg-habit-ux-skill/SKILL.md
- .claude/skills/visual-garden-ui-skill/SKILL.md
- .claude/skills/static-prototype-code-skill/SKILL.md

本轮只允许修改：
- detail.html
- assets/css/detail.css
- assets/js/detail.js

可以读取但不要大改：
- assets/js/tree-renderer.js
- assets/js/tree-model.js
- assets/js/tree-layout.js
- assets/js/app-state.js

本轮目标：
1. 在 detail.html 中增加单习惯树 SVG 容器。
2. 读取 selectedHabitId。
3. 使用 renderHabitTree({ mode: "detail" }) 或等价逻辑渲染当前 habit。
4. detail 模式只显示当前 habit 的分支。
5. detail 模式比首页展示更多 leaves 和 week branches。
6. 今日记录后，该分支立即更新新叶子。
7. 保留原来的习惯方案摘要、今日记录卡、方案健康度。
8. 叶子 hover 显示日期和状态。
9. 不使用失败、清零、红色警告等文案。

完成后请输出：
1. 修改了哪些文件
2. detail 如何读取 selectedHabitId
3. detail 如何复用树渲染逻辑
4. 今日记录后如何更新树
5. 如何测试 real / entry / downgrade / missed 四种状态
```

验收标准：

```text
detail 页面显示单习惯树
今日记录后树更新
首页和详情页叶子语义一致
没有普通 dashboard 风格
```

---

### 20.9 阶段 8：月枝结构，作为后续增强

目标：

在周枝稳定后，再增加月枝。
不要在第一版首页完整展开所有月份。

Claude Code / Codex Prompt：

```text
请读取 docs/TREE_GROWTH_SPEC.md。

本轮目标：
在已有周枝基础上增加 month branch。

只允许修改：
- assets/js/tree-model.js
- assets/js/tree-layout.js
- assets/js/tree-renderer.js
- assets/css/garden.css
- assets/css/detail.css

要求：
1. 新增 groupRecordsByMonth(records)。
2. 每个月生成：
   <g class="month-branch" data-month="YYYY-MM">
3. month branch 承载该月的 week branches。
4. 首页只展示最近 1-2 个月。
5. detail 页面可以展示更多月份。
6. 历史月份可以淡化，不要全部拥挤展开。
7. 保留周枝、叶子、tooltip、click 逻辑。

完成后请输出：
1. 月份分组逻辑
2. 首页展示策略
3. detail 展示策略
4. 如何测试跨月数据
```

验收标准：

```text
跨月记录生成新月枝
首页不拥挤
详情页能看出月份结构
旧月份不过度抢视觉
```

---

### 20.10 阶段 9：年枝结构，作为长期扩展

目标：

在项目展示需要长期成长感时，再增加年枝。
如果只是课程静态原型，这一阶段可以不做完整实现，只做视觉预留。

Claude Code / Codex Prompt：

```text
请读取 docs/TREE_GROWTH_SPEC.md。

本轮目标：
在月枝基础上增加 year branch 的数据和视觉预留。

只允许修改：
- assets/js/tree-model.js
- assets/js/tree-layout.js
- assets/js/tree-renderer.js
- assets/css/garden.css
- assets/css/detail.css

要求：
1. 新增 groupRecordsByYear(records)。
2. 每一年生成：
   <g class="year-branch" data-year="YYYY">
3. 年枝承载月枝。
4. 首页只显示当前年份，历史年份折叠或淡化。
5. detail 页面可以通过简单标签或轻节点展示年份。
6. 不做复杂年视图切换。
7. 不破坏已有周/月/叶子逻辑。

完成后请输出：
1. 年份分组逻辑
2. 首页如何处理历史年份
3. detail 如何展示年份
4. 是否建议当前版本完整开启此功能
```

验收标准：

```text
跨年数据结构可用
当前年份显示清楚
历史年份不会造成视觉拥挤
```

---

### 20.11 阶段 10：最终树系统 QA

Claude Code / Codex Prompt：

```text
请读取：
- CLAUDE.md
- docs/TREE_GROWTH_SPEC.md
- docs/ACCEPTANCE_CHECKLIST.md
- .claude/skills/qa-polish-review-skill/SKILL.md
- .claude/skills/fogg-habit-ux-skill/SKILL.md
- .claude/skills/visual-garden-ui-skill/SKILL.md

本轮目标：
对习惯树 SVG 生长系统进行最终 QA。

检查：
1. index.html 是否可以直接打开。
2. 无 habit 时是否显示种子/空状态。
3. 创建 habit 后是否生成新主枝。
4. 多个 habit 是否生成多条主枝。
5. real 是否显示深绿叶。
6. entry 是否显示浅绿叶。
7. downgrade 是否显示小芽。
8. missed 是否显示黄叶。
9. 黄叶是否没有失败感。
10. hover habit branch 是否整支高亮。
11. click habit branch 是否进入 detail.html。
12. hover leaf 是否显示 tooltip。
13. detail 页面是否显示单习惯树。
14. 今日记录后首页和详情是否同步。
15. 刷新页面后 localStorage 数据是否保留。
16. 是否没有 React/Vue/npm/后端依赖。
17. 是否没有“失败、清零、战胜自己、你太棒了”等文案。
18. 是否没有传统 dashboard 风格。

发现问题后可以直接修复，但不要引入新功能。

请输出：
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

最终测试步骤：
1.
2.
3.
```

---

## 21. 给 AI 编程助手的执行规则

每次执行习惯树相关任务时，都必须遵守：

```text
1. 一轮只做一个阶段。
2. 一轮只允许修改指定文件。
3. 不允许顺手重构其他页面。
4. 不允许引入框架。
5. 不允许引入后端。
6. 不允许改变 habit / record 的核心数据结构，除非本轮明确要求。
7. 不允许把树做成任务列表。
8. 不允许使用失败、清零、红色警告等压迫性语义。
9. 每轮完成后必须给出手动测试方法。
10. 如果发现现有实现不符合 TREE_GROWTH_SPEC，应先说明问题，再做最小修改。
```

---

## 22. 推荐实际执行顺序

如果当前项目还在第 2 轮首页阶段，建议只执行到阶段 6：

```text
阶段 0：建立 tree-renderer 子系统
阶段 1：替换首页 inline SVG 容器
阶段 2：渲染树干和习惯主枝
阶段 3：渲染最近叶子
阶段 4：hover / tooltip / click
阶段 5：基础生长动画
阶段 6：周枝结构
```

先不要急着做：

```text
完整月枝
完整年枝
复杂折叠
复杂树皮纹理
高级动效
```

完成上述阶段后，首页已经具备足够展示价值：

```text
创建习惯会长出新枝。
坚持会长出绿叶。
只完成入场动作会长出浅叶。
没完成也会留下黄叶。
一周会形成一个小周枝。
点击枝干能进入详情。
```

这已经能体现产品的核心设计思想。

---

## 23. 验收标准

### 23.1 数据验收

* 创建新习惯后，首页出现新主枝。
* 记录真实行动后，出现深绿叶。
* 记录入场动作后，出现浅绿叶。
* 记录降级后，出现小芽。
* 记录未发生后，出现黄叶。
* 刷新页面后树状态仍然存在。
* 点击习惯主枝可以进入详情页。

### 23.2 视觉验收

* 树不是简单列表。
* 枝干有层级。
* 叶子不机械排列。
* 黄叶不刺眼。
* 树干有基本质感。
* hover 时整条习惯分支能被识别。
* 首页和详情页视觉语言一致。

### 23.3 动效验收

* 新枝出现有生长感。
* 新叶出现有轻微生长感。
* hover 有柔和高亮。
* 页面没有夸张庆祝。
* 不使用红色失败动效。
* 动画不卡顿。

### 23.4 产品语义验收

* 树表达的是“习惯生长”，不是“任务完成率”。
* 黄叶表达的是“记录被保留”，不是“失败”。
* 分支表达的是“一个习惯”，不是普通菜单项。
* 叶子表达的是“某一天的行为痕迹”。
* 用户中断后仍能回到原分支继续生长。

---

## 24. 设计取舍说明

### 24.1 为什么不用大量完整 SVG

因为完整 SVG 状态图无法承载动态习惯数量、每日记录、周/月/年分层、hover 高亮和详情页联动。

### 24.2 为什么使用 inline SVG

因为 inline SVG 可以：

1. 动态生成 path。
2. 给每条分支绑定 habitId。
3. 给每片叶子绑定日期。
4. 使用 CSS 控制 hover。
5. 使用 JS 控制点击。
6. 使用 stroke-dash 动画表现生长。

### 24.3 为什么首页不展示全部年/月/周

因为首页是总览，不是档案。
完整时间结构应主要放在详情页或复盘页。

### 24.4 为什么黄叶必须保留

因为产品理念是无审判回归。
中断不是清零，而是行为设计中的可调整数据。

---

## 25. 后续扩展方向

后续可以继续扩展：

1. 年轮视图：展示长期累计。
2. 月份折叠：点击月枝展开周枝。
3. 行为天气预报：根据黄叶原因预测阻力。
4. 方案健康度：根据黄叶比例判断动作是否过重。
5. 同目标微光：在树周围显示匿名光点。
6. 季节变化：不同月份有轻微视觉变化。
7. 低能量模式：树枝颜色更柔和，动作自动降级。
8. 完整时间胶囊：点击某片叶子查看当天记录详情。

---

## 26. 最终实现原则

本系统的关键不是画出一棵复杂的树，而是建立一套可维护的生长机制。

优先级顺序：

```text
数据结构正确
→ SVG 分组清晰
→ 交互语义明确
→ 基础动画可用
→ 视觉质感增强
→ 长期时间结构扩展
```

不要为了视觉复杂度牺牲可维护性。

不要为了动画炫技破坏低压体验。

不要把习惯树做成打卡统计图。

习惯树最终应该让用户感到：

```text
我的习惯不是被考核的任务。
它是一条可以继续生长的枝。
即使某一天变成黄叶，它也没有消失。
```
