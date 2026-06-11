/* ========================================
   tree-interactions.js — hover / click / tooltip
   ========================================

   Binds delegation-based pointer events on
   the habit-tree container so one listener
   handles every branch & leaf inside.

   Works with the DOM structure created by
   tree-renderer.js.  Does NOT touch the
   renderer internals.
   ======================================== */

(function () {
  'use strict';

  /* ==============================================
     Default options
     ============================================== */
  var DEFAULTS = {
    /** ID (or Element) of the tooltip node.
        Created automatically inside the container's
        parent if not found. */
    tooltipId: 'treeTooltip',

    /** Called when a habit group is clicked.
        Receives (habitId, event). */
    onHabitSelect: null,

    /** Pre-select a habit by id. */
    selectedHabitId: null,

    /** Dim other habits while one is hovered. */
    dimOnHover: false
  };

  /* ---- running state (one per bound container) ---- */
  var currentHighlight = null;   // currently hovered habitId
  var currentSelected  = null;   // currently selected habitId
  var tooltipEl        = null;   // cached tooltip DOM
  var activeLeafData   = null;   // leaf data for current tooltip
  var boundContainer   = null;
  var boundSvg         = null;   // the <svg> root inside container
  var boundOpts        = null;

  /* ==============================================
     DOM helpers
     ============================================== */

  /**
   * Walk up from el until a node matches `selector`.
   * Works on both HTML and SVG elements.
   */
  function closestUp(el, selector) {
    while (el && el.nodeType === 1) {
      if (el.matches && el.matches(selector)) return el;
      el = el.parentNode;
    }
    return null;
  }

  /**
   * Test whether an element matches a selector.
   */
  function matches(el, selector) {
    return el && el.matches && el.matches(selector);
  }

  function escapeCssValue(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') {
      return window.CSS.escape(value);
    }
    return String(value).replace(/["\\]/g, '\\$&');
  }

  /* ==============================================
     Tooltip
     ============================================== */

  /**
   * Find or create the tooltip element.
   */
  function ensureTooltip(container, opts) {
    if (tooltipEl) return tooltipEl;

    // try the configured id first
    var id = opts.tooltipId || 'treeTooltip';
    tooltipEl = document.getElementById(id);

    if (!tooltipEl) {
      // create one as a sibling of the container
      tooltipEl = document.createElement('div');
      tooltipEl.id = id;
      tooltipEl.className = 'tree-tooltip';
      tooltipEl.setAttribute('hidden', '');
      tooltipEl.setAttribute('role', 'tooltip');
      tooltipEl.innerHTML =
        '<div class="tooltip-date"></div>' +
        '<div class="tooltip-status"></div>' +
        '<div class="tooltip-reason"></div>';

      var parent = container.parentNode || document.body;
      parent.appendChild(tooltipEl);
    }

    return tooltipEl;
  }

  /**
   * showLeafTooltip(event, leafData)
   *
   * Positions the tooltip near the cursor and fills
   * it with leaf data.  Respects low-pressure copy rules.
   *
   * @param {MouseEvent} event
   * @param {Object}     leafData  { date, status, label, reason, note }
   */
  function showLeafTooltip(event, leafData) {
    if (!tooltipEl) return;
    if (!leafData) return hideLeafTooltip();

    activeLeafData = leafData;

    // ---- fill content ----
    var dateEl   = tooltipEl.querySelector('.tooltip-date');
    var statusEl = tooltipEl.querySelector('.tooltip-status');
    var reasonEl = tooltipEl.querySelector('.tooltip-reason');

    if (dateEl)   dateEl.textContent   = leafData.date || '';
    if (statusEl) statusEl.textContent = leafData.label || '';

    // show reason for missed days with low-pressure wording
    if (reasonEl) {
      if (leafData.status === 'missed' && leafData.reason) {
        reasonEl.textContent = leafData.reason;
        reasonEl.style.display = '';
      } else if (leafData.note && leafData.status !== 'missed') {
        reasonEl.textContent = leafData.note;
        reasonEl.style.display = '';
      } else {
        reasonEl.textContent = '';
        reasonEl.style.display = 'none';
      }
    }

    // ---- position near cursor ----
    tooltipEl.removeAttribute('hidden');

    // read dimensions after making visible but before positioning
    var rect = tooltipEl.getBoundingClientRect();
    var tx = event.clientX + 14;
    var ty = event.clientY - rect.height - 8;

    // keep tooltip within viewport
    if (tx + rect.width > window.innerWidth - 8) {
      tx = event.clientX - rect.width - 14;
    }
    if (ty < 8) {
      ty = event.clientY + 16;
    }

    tooltipEl.style.left = tx + 'px';
    tooltipEl.style.top  = ty + 'px';
    tooltipEl.classList.add('is-visible');
  }

  /**
   * hideLeafTooltip()
   */
  function hideLeafTooltip() {
    if (!tooltipEl) return;
    activeLeafData = null;
    tooltipEl.classList.remove('is-visible');
    // keep the element in DOM; just hidden via opacity
    setTimeout(function () {
      if (!activeLeafData && tooltipEl) {
        tooltipEl.setAttribute('hidden', '');
      }
    }, 180);
  }

  /* ==============================================
     Highlight
     ============================================== */

  /**
   * highlightHabitGroup(habitId)
   *
   * Adds `.is-hovered` to the habit-group with
   * the given data-habit-id.
   */
  function highlightHabitGroup(habitId) {
    if (currentHighlight === habitId) return; // already highlighted

    // clear previous
    clearHabitHighlight();

    if (!habitId || !boundSvg) return;

    var group = boundSvg.querySelector('.habit-group[data-habit-id="' + escapeCssValue(habitId) + '"]');
    if (group) {
      group.classList.add('is-hovered');
      currentHighlight = habitId;
    }
  }

  /**
   * clearHabitHighlight()
   *
   * Removes `.is-hovered` from whichever group
   * is currently highlighted.
   */
  function clearHabitHighlight() {
    if (!currentHighlight || !boundSvg) return;
    var group = boundSvg.querySelector('.habit-group[data-habit-id="' + escapeCssValue(currentHighlight) + '"]');
    if (group) {
      group.classList.remove('is-hovered');
    }
    currentHighlight = null;
  }

  /**
   * selectHabit(habitId)
   *
   * Adds `.is-selected` to one habit group, removing
   * it from any previously-selected group.
   */
  function selectHabit(habitId) {
    if (!boundSvg) return;

    // unselect previous
    if (currentSelected) {
      var prev = boundSvg.querySelector('.habit-group[data-habit-id="' + escapeCssValue(currentSelected) + '"]');
      if (prev) prev.classList.remove('is-selected');
    }

    currentSelected = habitId;

    if (habitId) {
      var selectedGroup = boundSvg.querySelector('.habit-group[data-habit-id="' + escapeCssValue(habitId) + '"]');
      if (selectedGroup) selectedGroup.classList.add('is-selected');
    }
  }

  /* ==============================================
     Event handlers (delegation)
     ============================================== */

  function extractLeafData(el) {
    return {
      date:   el.getAttribute('data-date')   || '',
      status: el.getAttribute('data-status') || '',
      label:  el.getAttribute('data-label')  || '',
      reason: el.getAttribute('data-reason') || null,
      note:   el.getAttribute('data-note')   || null
    };
  }

  function onMouseOver(e) {
    var target = e.target;

    // 1. find the nearest habit-group
    var habitGroup = closestUp(target, '.habit-group');
    if (habitGroup) {
      var habitId = habitGroup.getAttribute('data-habit-id');
      highlightHabitGroup(habitId);
    }

    // 2. is the direct target a leaf?
    if (matches(target, '.leaf-piece')) {
      var leafData = extractLeafData(target);
      showLeafTooltip(e, leafData);
    } else {
      // check if we're over a leaf (target might be a child of leaf image)
      var leafParent = closestUp(target, '.leaf-piece');
      if (leafParent) {
        var ld = extractLeafData(leafParent);
        showLeafTooltip(e, ld);
      }
    }
  }

  function onMouseOut(e) {
    // Check if we fully left the habit group or just moved within it
    var related = e.relatedTarget;
    var habitGroup = closestUp(e.target, '.habit-group');

    if (habitGroup) {
      // Did we leave this habit group entirely?
      var relatedGroup = closestUp(related, '.habit-group');
      if (!relatedGroup || relatedGroup !== habitGroup) {
        clearHabitHighlight();
      }
    }

    // did we leave a leaf?
    var leafEl = closestUp(e.target, '.leaf-piece');
    if (leafEl) {
      var relatedLeaf = closestUp(related, '.leaf-piece');
      if (!relatedLeaf || relatedLeaf !== leafEl) {
        hideLeafTooltip();
      }
    }
  }

  function onClick(e) {
    // Find the habit group that was clicked
    var habitGroup = closestUp(e.target, '.habit-group');
    if (!habitGroup) return;

    var habitId = habitGroup.getAttribute('data-habit-id');
    if (!habitId) return;

    // Mark selected
    selectHabit(habitId);

    // Call the user callback
    if (boundOpts && typeof boundOpts.onHabitSelect === 'function') {
      boundOpts.onHabitSelect(habitId, e);
    }
  }

  /* ==============================================
     Public API
     ============================================== */

  /**
   * bindTreeInteractions(container, options)
   *
   * Attaches delegation-based event listeners to
   * `container`.  Finds the <svg> root inside it
   * and listens for pointer events there.
   *
   * @param {Element} container  DOM node (e.g. #habitTreeCanvas)
   * @param {Object}  options    see DEFAULTS
   */
  function bindTreeInteractions(container, options) {
    if (!container) return;

    // merge options
    boundOpts = {};
    for (var k in DEFAULTS) { boundOpts[k] = DEFAULTS[k]; }
    if (options) {
      for (var ok in options) { boundOpts[ok] = options[ok]; }
    }

    // find SVG root
    boundContainer = container;
    boundSvg = container.querySelector('.habit-growth-svg');
    if (!boundSvg) {
      // the SVG might be the container itself (edge case)
      if (container.classList.contains('habit-growth-svg')) {
        boundSvg = container;
      } else {
        // no SVG yet — wait for render, then bind
        return;
      }
    }

    // ensure tooltip exists
    tooltipEl = ensureTooltip(container, boundOpts);

    // delegate events on the SVG
    boundSvg.addEventListener('mouseover', onMouseOver, { passive: true });
    boundSvg.addEventListener('mouseout',  onMouseOut,  { passive: true });
    boundSvg.addEventListener('click',     onClick);

    // pre-select if requested
    if (boundOpts.selectedHabitId) {
      selectHabit(boundOpts.selectedHabitId);
    }
  }

  /**
   * unbindTreeInteractions()
   *
   * Removes listeners.  Call before re-rendering.
   */
  function unbindTreeInteractions() {
    if (!boundSvg) return;

    boundSvg.removeEventListener('mouseover', onMouseOver);
    boundSvg.removeEventListener('mouseout',  onMouseOut);
    boundSvg.removeEventListener('click',     onClick);

    clearHabitHighlight();
    hideLeafTooltip();
    currentSelected = null;
    boundContainer  = null;
    boundSvg        = null;
    boundOpts       = null;
  }

  /* ==============================================
     Expose on window
     ============================================== */
  window.TreeInteractions = {
    bindTreeInteractions:   bindTreeInteractions,
    unbindTreeInteractions: unbindTreeInteractions,
    highlightHabitGroup:    highlightHabitGroup,
    clearHabitHighlight:    clearHabitHighlight,
    showLeafTooltip:        showLeafTooltip,
    hideLeafTooltip:        hideLeafTooltip,
    selectHabit:            selectHabit
  };

})();
