/* Event helpers for River Stage objects. */
(function () {
  'use strict';

  var activeTooltip = null;

  function getItemFromEvent(event) {
    if (!event || !event.target) return null;
    return event.target.closest('[data-river-item="true"]');
  }

  function readItemData(item) {
    return {
      date: item.dataset.date || '',
      dateLabel: item.dataset.dateLabel || item.dataset.date || '',
      day: item.dataset.day || '',
      status: item.dataset.status || 'unrecorded',
      label: item.dataset.label || '',
      note: item.dataset.note || '',
      tooltip: item.dataset.tooltip || ''
    };
  }

  function showRiverTooltip(event, data) {
    hideRiverTooltip();

    var tooltip = document.createElement('div');
    tooltip.className = 'river-tooltip is-visible';
    tooltip.setAttribute('role', 'status');
    tooltip.textContent = (data && data.tooltip) || (data && data.label) || '';
    document.body.appendChild(tooltip);

    var rect = event && event.target && event.target.getBoundingClientRect
      ? event.target.getBoundingClientRect()
      : { left: 0, top: 0, width: 0 };
    tooltip.style.left = rect.left + rect.width / 2 + window.scrollX + 'px';
    tooltip.style.top = rect.top + window.scrollY - 10 + 'px';

    activeTooltip = tooltip;
    return tooltip;
  }

  function hideRiverTooltip() {
    if (activeTooltip && activeTooltip.parentNode) {
      activeTooltip.parentNode.removeChild(activeTooltip);
    }
    activeTooltip = null;
  }

  function bindRiverItemHover(container, options) {
    if (!container || container.__riverItemHoverBound) return;
    var opts = options || {};

    container.addEventListener('mouseover', function (event) {
      var item = getItemFromEvent(event);
      if (!item) return;
      if (event.relatedTarget && item.contains(event.relatedTarget)) return;
      var data = readItemData(item);
      if (typeof opts.onHover === 'function') opts.onHover(data, item);
      showRiverTooltip(event, data);
    });

    container.addEventListener('focusin', function (event) {
      var item = getItemFromEvent(event);
      if (!item) return;
      showRiverTooltip(event, readItemData(item));
    });

    container.addEventListener('mouseout', function (event) {
      var item = getItemFromEvent(event);
      if (!item) return;
      if (event.relatedTarget && item.contains(event.relatedTarget)) return;
      hideRiverTooltip();
    });

    container.addEventListener('focusout', function (event) {
      if (getItemFromEvent(event)) hideRiverTooltip();
    });

    container.__riverItemHoverBound = true;
  }

  function bindRiverItemClick(container, options) {
    if (!container || container.__riverItemClickBound) return;
    var opts = options || {};

    function activate(event) {
      var item = getItemFromEvent(event);
      if (!item) return;
      var data = readItemData(item);

      container.querySelectorAll('[data-river-item="true"].is-selected').forEach(function (selected) {
        selected.classList.remove('is-selected');
        selected.setAttribute('aria-pressed', 'false');
      });
      item.classList.add('is-selected');
      item.setAttribute('aria-pressed', 'true');

      if (typeof opts.onClick === 'function') opts.onClick(data, item);
      if (typeof opts.onSelectDate === 'function') opts.onSelectDate(data.date, data, item);

      container.dispatchEvent(new CustomEvent('river:item-select', {
        bubbles: true,
        detail: data
      }));
    }

    container.addEventListener('click', activate);
    container.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (!getItemFromEvent(event)) return;
      event.preventDefault();
      activate(event);
    });

    container.__riverItemClickBound = true;
  }

  window.RiverStageInteractions = {
    bindRiverItemHover: bindRiverItemHover,
    bindRiverItemClick: bindRiverItemClick,
    showRiverTooltip: showRiverTooltip,
    hideRiverTooltip: hideRiverTooltip
  };
})();
