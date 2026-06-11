/* ========================================
   tree-renderer.js - anchor-based SVG composer
   ======================================== */

(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  var DEFAULTS = {
    mode: 'home',
    animation: true,
    debug: false
  };

  var LEAF_ORDER = ['real', 'entry', 'downgrade', 'missed'];

  function registry() {
    return window.TreeLayoutRegistry || null;
  }

  function optionMerge(options) {
    var opts = {};
    var key;
    for (key in DEFAULTS) opts[key] = DEFAULTS[key];
    if (options) {
      for (key in options) opts[key] = options[key];
    }
    return opts;
  }

  function elSVG(tag) {
    return document.createElementNS(NS, tag);
  }

  function setAttrs(el, attrs) {
    Object.keys(attrs).forEach(function (key) {
      if (attrs[key] !== null && attrs[key] !== undefined) {
        el.setAttribute(key, attrs[key]);
      }
    });
    return el;
  }

  function clearTree(container) {
    if (!container) return;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  function createSvgRoot(opts) {
    var layout = registry();
    var world = layout ? layout.world : { width: 1200, height: 760 };
    var svg = elSVG('svg');
    setAttrs(svg, {
      xmlns: NS,
      viewBox: '0 0 ' + world.width + ' ' + world.height,
      preserveAspectRatio: 'xMidYMid meet',
      role: 'img',
      'aria-label': 'habit tree'
    });
    svg.classList.add('habit-growth-svg');
    if (opts && opts.debug) svg.classList.add('is-debugging');
    return svg;
  }

  function point(x, y) {
    return { x: x, y: y };
  }

  function scalePoint(localPoint, scale) {
    return {
      x: localPoint.x * scale,
      y: localPoint.y * scale
    };
  }

  function imagePosition(assetMeta, attach, scale) {
    return {
      x: attach.x - assetMeta.anchor.x * scale,
      y: attach.y - assetMeta.anchor.y * scale
    };
  }

  function worldLocalPoint(assetMeta, imagePos, localPoint, scale) {
    return {
      x: imagePos.x + localPoint.x * scale,
      y: imagePos.y + localPoint.y * scale
    };
  }

  function dataAttrs(data) {
    var attrs = {};
    Object.keys(data || {}).forEach(function (key) {
      if (data[key] !== null && data[key] !== undefined) {
        attrs['data-' + key] = data[key];
      }
    });
    return attrs;
  }

  /**
   * Render one image-based SVG asset by aligning its local anchor
   * to a world attach point. Rotation is always around attach.
   */
  function renderSvgAsset(svgRoot, assetMeta, placement, className, data = {}) {
    if (!svgRoot || !assetMeta || !placement || !placement.attach) return null;

    var scale = placement.scale == null ? 1 : placement.scale;
    var rotation = placement.rotation || 0;
    var attach = placement.attach;
    var pos = imagePosition(assetMeta, attach, scale);
    var group = elSVG('g');

    if (rotation) {
      group.setAttribute('transform', 'rotate(' + rotation + ' ' + attach.x + ' ' + attach.y + ')');
    }

    var attrs = {
      href: assetMeta.href,
      x: pos.x,
      y: pos.y,
      width: assetMeta.width * scale,
      height: assetMeta.height * scale,
      preserveAspectRatio: 'xMidYMid meet',
      class: className || ''
    };
    var extra = dataAttrs(data);
    Object.keys(extra).forEach(function (key) {
      attrs[key] = extra[key];
    });

    var image = elSVG('image');
    setAttrs(image, attrs);
    if (placement.animation === false) image.style.animation = 'none';

    group.appendChild(image);
    svgRoot.appendChild(group);

    return {
      group: group,
      image: image,
      x: pos.x,
      y: pos.y,
      width: assetMeta.width * scale,
      height: assetMeta.height * scale,
      scale: scale,
      attach: attach,
      anchor: worldLocalPoint(assetMeta, pos, assetMeta.anchor, scale),
      tip: assetMeta.tip ? worldLocalPoint(assetMeta, pos, assetMeta.tip, scale) : attach
    };
  }

  function renderTrunk(svgRoot, opts) {
    var layout = registry();
    if (!layout || !layout.trunk) return null;

    var trunk = layout.trunk;
    var group = elSVG('g');
    group.classList.add('tree-trunk');

    var clipId = 'trunkTextureClip-' + Math.floor(Math.random() * 1000000);
    var defs = elSVG('defs');
    var clip = elSVG('clipPath');
    clip.setAttribute('id', clipId);
    setAttrs(clip, { clipPathUnits: 'userSpaceOnUse' });
    var clipShape = elSVG('path');
    setAttrs(clipShape, {
      d: trunkClipPath(trunk)
    });
    clip.appendChild(clipShape);
    defs.appendChild(clip);
    svgRoot.appendChild(defs);

    (trunk.layers || []).forEach(function (layer) {
      var img = elSVG('image');
      setAttrs(img, {
        href: layer.href,
        x: trunk.x,
        y: trunk.y,
        width: trunk.width,
        height: trunk.height,
        preserveAspectRatio: 'xMidYMid meet',
        class: layer.className || ''
      });
      if (layer.href && layer.href.indexOf('bark-texture.svg') !== -1) {
        img.setAttribute('clip-path', 'url(#' + clipId + ')');
      }
      if (opts && !opts.animation) img.style.animation = 'none';
      group.appendChild(img);
    });

    svgRoot.appendChild(group);
    if (opts && opts.debug) renderDebugBox(svgRoot, trunk.x, trunk.y, trunk.width, trunk.height, 'trunk');
    return group;
  }

  function trunkClipPath(trunk) {
    var x = trunk.x;
    var y = trunk.y;
    var w = trunk.width;
    var h = trunk.height;
    return [
      'M', x + w * 0.48, y + h * 0.05,
      'C', x + w * 0.28, y + h * 0.18, x + w * 0.26, y + h * 0.34, x + w * 0.34, y + h * 0.52,
      'C', x + w * 0.25, y + h * 0.69, x + w * 0.30, y + h * 0.86, x + w * 0.18, y + h * 0.95,
      'C', x + w * 0.36, y + h * 0.91, x + w * 0.46, y + h * 0.91, x + w * 0.50, y + h * 0.99,
      'C', x + w * 0.55, y + h * 0.91, x + w * 0.68, y + h * 0.91, x + w * 0.85, y + h * 0.95,
      'C', x + w * 0.70, y + h * 0.84, x + w * 0.76, y + h * 0.69, x + w * 0.66, y + h * 0.52,
      'C', x + w * 0.75, y + h * 0.32, x + w * 0.70, y + h * 0.16, x + w * 0.48, y + h * 0.05,
      'Z'
    ].join(' ');
  }

  function normalizeHabitNodes(habits) {
    if (!Array.isArray(habits)) return [];
    if (!habits.length) return [];
    if (habits[0] && Object.prototype.hasOwnProperty.call(habits[0], 'habitId')) {
      return habits;
    }
    if (window.TreeGrowthModel && typeof window.TreeGrowthModel.buildHabitTreeModel === 'function') {
      return window.TreeGrowthModel.buildHabitTreeModel(habits).habits || [];
    }
    return habits.map(function (habit) {
      return {
        habitId: habit.id || '',
        title: habit.goldenBehavior || habit.entryAction || habit.wish || '',
        wish: habit.wish || '',
        years: []
      };
    });
  }

  function getSlot(index) {
    var layout = registry();
    var slots = layout.habitSlots || [];
    return slots[index % slots.length];
  }

  function getBranchAsset(slot) {
    var layout = registry();
    return layout.branchAssets[slot.asset];
  }

  function renderHabitBranch(svgRoot, habitNode, layoutSlot, opts) {
    var asset = getBranchAsset(layoutSlot);
    if (!asset) return null;

    var group = elSVG('g');
    group.classList.add('habit-group');
    group.setAttribute('data-habit-id', habitNode.habitId);
    if (layoutSlot.rotation) {
      group.setAttribute(
        'transform',
        'rotate(' + layoutSlot.rotation + ' ' + layoutSlot.attach.x + ' ' + layoutSlot.attach.y + ')'
      );
    }

    var title = elSVG('title');
    title.textContent = habitNode.title || '';
    group.appendChild(title);

    var branchLayer = elSVG('g');
    branchLayer.classList.add('habit-branch-layer');
    group.appendChild(branchLayer);

    var monthLayer = elSVG('g');
    monthLayer.classList.add('month-branch-layer');
    group.appendChild(monthLayer);

    var weekLayer = elSVG('g');
    weekLayer.classList.add('week-branch-layer');
    group.appendChild(weekLayer);

    var leafLayer = elSVG('g');
    leafLayer.classList.add('leaf-layer');
    group.appendChild(leafLayer);

    svgRoot.appendChild(group);

    var branch = renderSvgAsset(branchLayer, asset, {
      attach: layoutSlot.attach,
      scale: layoutSlot.scale || asset.defaultScale || 1,
      rotation: asset.defaultRotation || 0,
      animation: opts.animation
    }, 'branch-piece habit-branch', {
      habitId: habitNode.habitId,
      slotId: layoutSlot.id
    });

    if (opts.debug && branch) {
      renderDebugBox(group, branch.x, branch.y, branch.width, branch.height, layoutSlot.id);
      renderDebugPoint(group, layoutSlot.attach, 'tree-attach-point', 'attach');
      renderDebugPoint(group, branch.anchor, 'tree-asset-anchor', 'anchor');
    }

    return {
      group: group,
      branchLayer: branchLayer,
      monthLayer: monthLayer,
      weekLayer: weekLayer,
      leafLayer: leafLayer,
      branch: branch,
      tip: branch ? branch.tip : layoutSlot.attach
    };
  }

  function renderTimeLayers(habitRender, years, opts) {
    if (!habitRender || !years || !years.length) return;

    var monthAttach = habitRender.tip;
    var monthIndex = 0;

    for (var yi = 0; yi < years.length; yi++) {
      var months = years[yi].months || [];
      for (var mi = 0; mi < months.length; mi++) {
        var month = months[mi];
        var monthRender = renderMonthBranch(habitRender.monthLayer, monthAttach, monthIndex, opts);
        monthIndex++;
        if (!monthRender) continue;

        var weeks = month.weeks || [];
        var weekAttach = monthRender.tip;

        for (var wi = 0; wi < weeks.length; wi++) {
          var week = weeks[wi];
          if (!week || !week.days || !week.days.length) continue;

          var weekRender = renderWeekBranch(habitRender.weekLayer, weekAttach, wi, opts);
          if (!weekRender) continue;
          renderLeaves(habitRender.leafLayer, week.days, weekRender, opts);
          weekAttach = stepAttachFromTip(weekRender.tip, wi);
        }

        monthAttach = stepAttachFromTip(monthRender.tip, mi);
      }
    }
  }

  function renderMonthBranch(layer, attach, monthIndex, opts) {
    var layout = registry();
    var keys = ['monthRight', 'monthLeft', 'monthRight', 'monthLeft'];
    var key = keys[monthIndex % keys.length];
    var asset = layout.monthBranchAssets[key];
    var rotation = asset.defaultRotation || 0;

    var result = renderSvgAsset(layer, asset, {
      attach: attach,
      scale: asset.defaultScale || 1,
      rotation: rotation,
      animation: opts.animation
    }, 'branch-piece month-branch', {
      branchLevel: 'month'
    });

    if (opts.debug && result) {
      renderDebugBox(layer, result.x, result.y, result.width, result.height, key);
      renderDebugPoint(layer, attach, 'tree-attach-point', 'month');
      renderDebugPoint(layer, result.anchor, 'tree-asset-anchor', 'anchor');
    }

    return result;
  }

  function renderWeekBranch(layer, attach, weekIndex, opts) {
    var layout = registry();
    var keys = ['weekRight', 'weekLeft', 'weekUp', 'weekRight'];
    var key = keys[weekIndex % keys.length];
    var asset = layout.weekBranchAssets[key];
    var rotation = asset.defaultRotation || 0;

    var result = renderSvgAsset(layer, asset, {
      attach: attach,
      scale: asset.defaultScale || 1,
      rotation: rotation,
      animation: opts.animation
    }, 'branch-piece week-branch', {
      branchLevel: 'week'
    });

    if (result) result.asset = asset;

    if (opts.debug && result) {
      renderDebugBox(layer, result.x, result.y, result.width, result.height, key);
      renderDebugPoint(layer, attach, 'tree-attach-point', 'week');
      renderDebugPoint(layer, result.anchor, 'tree-asset-anchor', 'anchor');
    }

    return result;
  }

  function renderLeaves(layer, days, weekRender, opts) {
    var slots = (weekRender.asset && weekRender.asset.leafSlots) || [];
    var layout = registry();
    var count = Math.min(days.length, slots.length);

    for (var i = 0; i < count; i++) {
      var day = days[i];
      var slot = slots[i];
      var leafAsset = layout.leafAssets[day.status] || layout.leafAssets.missed;
      var slotPoint = {
        x: weekRender.x + slot.x * weekRender.scale,
        y: weekRender.y + slot.y * weekRender.scale
      };
      var scale = (slot.scale || 0.62) * 0.42;
      var leafClass = 'leaf-piece ' + (leafAsset.className || 'leaf-missed');

      renderSvgAsset(layer, leafAsset, {
        attach: slotPoint,
        scale: scale,
        rotation: slot.rotate || 0,
        animation: opts.animation
      }, leafClass, {
        date: day.date,
        status: day.status,
        label: day.label || '',
        reason: day.reason || '',
        note: day.note || ''
      });

      if (opts.debug) {
        renderDebugPoint(layer, slotPoint, 'tree-debug-leaf-slot', String(i + 1));
      }
    }
  }

  function stepAttachFromTip(tip, index) {
    return {
      x: tip.x + (index % 2 === 0 ? 12 : -12),
      y: tip.y + 10
    };
  }

  function renderDebugPoint(parent, p, className, text) {
    var circle = elSVG('circle');
    setAttrs(circle, {
      cx: p.x,
      cy: p.y,
      r: 5,
      class: 'tree-debug-point ' + className
    });
    parent.appendChild(circle);
    if (text) renderDebugLabel(parent, text, p.x + 8, p.y - 8);
  }

  function renderDebugBox(parent, x, y, width, height, text) {
    var rect = elSVG('rect');
    setAttrs(rect, {
      x: x,
      y: y,
      width: width,
      height: height,
      class: 'tree-debug-box'
    });
    parent.appendChild(rect);
    if (text) renderDebugLabel(parent, text, x + 4, y - 6);
  }

  function renderDebugLabel(parent, text, x, y) {
    var label = elSVG('text');
    setAttrs(label, {
      x: x,
      y: y,
      class: 'tree-debug-label'
    });
    label.textContent = text;
    parent.appendChild(label);
  }

  function renderDebugGrid(svgRoot) {
    var layout = registry();
    if (!layout) return;
    var grid = elSVG('g');
    grid.classList.add('tree-debug-grid');
    for (var x = 0; x <= layout.world.width; x += 40) {
      grid.appendChild(setAttrs(elSVG('line'), {
        x1: x,
        y1: 0,
        x2: x,
        y2: layout.world.height,
        class: x % 200 === 0 ? 'tree-debug-grid-major' : ''
      }));
    }
    for (var y = 0; y <= layout.world.height; y += 40) {
      grid.appendChild(setAttrs(elSVG('line'), {
        x1: 0,
        y1: y,
        x2: layout.world.width,
        y2: y,
        class: y % 200 === 0 ? 'tree-debug-grid-major' : ''
      }));
    }
    svgRoot.appendChild(grid);
  }

  function renderHabitForest(container, habits, options) {
    if (!container) return;
    clearTree(container);

    var layout = registry();
    if (!layout) return;

    var opts = optionMerge(options);
    var habitNodes = normalizeHabitNodes(habits);
    var svg = createSvgRoot(opts);

    if (opts.debug) renderDebugGrid(svg);
    renderTrunk(svg, opts);

    for (var i = 0; i < habitNodes.length; i++) {
      var slot = getSlot(i);
      var habitRender = renderHabitBranch(svg, habitNodes[i], slot, opts);
      renderTimeLayers(habitRender, habitNodes[i].years, opts);
    }

    container.appendChild(svg);
  }

  function renderSingleHabitTree(container, habit, options) {
    if (!container || !habit) return;
    clearTree(container);

    var opts = optionMerge(options);
    var model = habit.habitId ? habit : (
      window.TreeGrowthModel ? window.TreeGrowthModel.buildSingleHabitTreeModel(habit) : habit
    );
    var svg = createSvgRoot(opts);

    renderTrunk(svg, opts);
    var slot = getSlot(2) || getSlot(0);
    var habitRender = renderHabitBranch(svg, model, slot, opts);
    renderTimeLayers(habitRender, model.years, opts);

    container.appendChild(svg);
  }

  window.TreeRenderer = {
    renderHabitForest: renderHabitForest,
    renderSingleHabitTree: renderSingleHabitTree,
    clearTree: clearTree,
    createSvgRoot: createSvgRoot,
    renderSvgAsset: renderSvgAsset,
    renderTrunk: renderTrunk,
    renderHabitBranch: renderHabitBranch,
    renderMonthBranch: renderMonthBranch,
    renderWeekBranch: renderWeekBranch,
    DEFAULTS: DEFAULTS,
    LEAF_ORDER: LEAF_ORDER
  };
})();
