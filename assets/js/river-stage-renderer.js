/* River Stage rendering helpers. Rendering is storage-agnostic. */
(function () {
  'use strict';

  var BACKGROUND_SRC = 'assets/images/river-stage-bg.png';

  var RIVER_WEEK_SLOTS = [
    { slot: 1, x: 36, y: 90 },
    { slot: 2, x: 49, y: 80 },
    { slot: 3, x: 62, y: 78 },
    { slot: 4, x: 73, y: 60 },
    { slot: 5, x: 62, y: 45 },
    { slot: 6, x: 48, y: 40 },
    { slot: 7, x: 38, y: 30 }
  ];

  function getModel() {
    return window.RiverStageModel || null;
  }

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function getMonthWeeksBySlots(year, monthIndex) {
    var monthEnd = new Date(year, monthIndex + 1, 0).getDate();
    var weeks = [];

    for (var startDay = 1; startDay <= monthEnd; startDay += 7) {
      var endDay = Math.min(startDay + 6, monthEnd);
      var days = [];

      for (var day = startDay; day <= endDay; day += 1) {
        days.push({
          year: year,
          monthIndex: monthIndex,
          day: day,
          date: new Date(year, monthIndex, day),
          dateISO: year + '-' + pad2(monthIndex + 1) + '-' + pad2(day)
        });
      }

      weeks.push({
        weekIndex: weeks.length + 1,
        startDay: startDay,
        endDay: endDay,
        days: days
      });
    }

    return weeks;
  }

  function ensureStage(container, options) {
    if (!container) return null;

    container.classList.add('river-stage');
    if (options && options.mode) {
      container.classList.add('river-stage--' + options.mode);
    }

    var background = container.querySelector(':scope > .river-stage__background');
    if (!background) {
      background = document.createElement('div');
      background.className = 'river-stage__background';
      container.prepend(background);
    }

    if (!background.querySelector('img')) {
      var img = document.createElement('img');
      img.className = 'river-stage__background-image';
      img.src = (options && options.backgroundSrc) || BACKGROUND_SRC;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      background.appendChild(img);
    }

    var layer = container.querySelector(':scope > .river-stage__record-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'river-stage__record-layer';
      container.appendChild(layer);
    }

    var tooltipLayer = container.querySelector(':scope > .river-stage__tooltip-layer');
    if (!tooltipLayer) {
      tooltipLayer = document.createElement('div');
      tooltipLayer.className = 'river-stage__tooltip-layer';
      container.appendChild(tooltipLayer);
    }

    return {
      stage: container,
      background: background,
      layer: layer,
      tooltipLayer: tooltipLayer
    };
  }

  function renderRiverBackground(container, options) {
    return ensureStage(container, options || {});
  }

  function clearRiverLayer(container) {
    if (!container) return;
    var layer = container.classList && container.classList.contains('river-stage__record-layer')
      ? container
      : container.querySelector('.river-stage__record-layer');

    if (layer) {
      layer.replaceChildren();
    }
  }

  function buildSlot(dayModel, point) {
    return {
      dateISO: dayModel.dateISO,
      date: dayModel.dateISO,
      day: dayModel.day,
      monthIndex: dayModel.monthIndex,
      slot: point.slot,
      x: point.x,
      y: point.y
    };
  }

  function renderMonthRiverOverlay(container, habit, options) {
    var opts = options || {};
    var model = getModel();
    var stage = ensureStage(container, opts);
    if (!stage || !model) return [];

    clearRiverLayer(stage.layer);

    var monthDate = opts.date ? new Date(opts.date) : new Date();
    var year = Number.isInteger(opts.year) ? opts.year : monthDate.getFullYear();
    var monthIndex = Number.isInteger(opts.monthIndex) ? opts.monthIndex : monthDate.getMonth();
    var weekIndex = Number.isInteger(opts.weekIndex) ? opts.weekIndex : 0;
    var weeks = getMonthWeeksBySlots(year, monthIndex);
    var week = weeks[Math.max(0, Math.min(weekIndex, weeks.length - 1))] || { days: [] };
    var points = opts.points || RIVER_WEEK_SLOTS;

    return week.days.slice(0, 7).map(function (dayModel, index) {
      if (!points[index]) return null;
      return renderRiverItem(
        stage.layer,
        buildSlot(dayModel, points[index]),
        model.getRecordForDate(habit, dayModel.dateISO),
        opts
      );
    }).filter(Boolean);
  }

  function renderWeekRiverOverlay(container, habit, year, monthIndex, weekIndex, options) {
    var opts = options || {};
    var model = getModel();
    var stage = ensureStage(container, opts);
    if (!stage || !model) return [];

    clearRiverLayer(stage.layer);

    var weeks = getMonthWeeksBySlots(year, monthIndex);
    var week = weeks[Math.max(0, Math.min(weekIndex || 0, weeks.length - 1))] || { days: [] };
    var points = opts.points || RIVER_WEEK_SLOTS;

    return week.days.slice(0, 7).map(function (dayModel, index) {
      if (!points[index]) return null;
      return renderRiverItem(
        stage.layer,
        buildSlot(dayModel, points[index]),
        model.getRecordForDate(habit, dayModel.dateISO),
        opts
      );
    }).filter(Boolean);
  }

  function renderRiverItem(container, slot, record, options) {
    var target = container && container.querySelector
      ? (container.classList.contains('river-stage__record-layer') ? container : container.querySelector('.river-stage__record-layer'))
      : container;
    if (!target || !slot) return null;

    var opts = options || {};
    var model = getModel();
    var status = model ? model.normalizeStatus(record && record.status) : ((record && record.status) || 'unrecorded');
    var label = model ? model.getStatusLabel(status) : status;
    var asset = model ? model.getStatusAsset(status) : '';
    var objectType = model && model.getStatusObjectType ? model.getStatusObjectType(status) : status;
    var dateISO = slot.dateISO || slot.date;
    var note = record && record.note ? record.note : (record && record.reason ? record.reason : '');
    var dateLabel = slot.day && slot.monthIndex !== undefined
      ? (slot.monthIndex + 1) + ' 月 ' + slot.day + ' 日'
      : dateISO;
    var tooltip = dateLabel + '：' + label + (note ? '\n' + note : '');

    var item = document.createElement('button');
    item.type = 'button';
    item.className = 'river-item river-item--' + objectType;
    item.style.left = slot.x + '%';
    item.style.top = slot.y + '%';
    item.dataset.riverItem = 'true';
    item.dataset.date = dateISO;
    item.dataset.day = String(slot.day || '');
    item.dataset.slot = String(slot.slot || '');
    item.dataset.dateLabel = dateLabel;
    item.dataset.status = status;
    item.dataset.label = label;
    item.dataset.asset = asset;
    item.dataset.note = note;
    item.dataset.tooltip = tooltip;
    item.setAttribute('aria-label', dateISO + '，' + label);

    if (opts.selectedDate && opts.selectedDate === dateISO) {
      item.classList.add('is-selected');
      item.setAttribute('aria-pressed', 'true');
    } else {
      item.setAttribute('aria-pressed', 'false');
    }

    var img = document.createElement('img');
    img.className = 'river-item__image';
    img.src = asset;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    item.appendChild(img);

    var dayLabel = document.createElement('span');
    dayLabel.className = 'river-item__day';
    dayLabel.textContent = slot.day ? String(slot.day) : '';
    item.appendChild(dayLabel);

    target.appendChild(item);
    return item;
  }

  window.RiverStageRenderer = {
    RIVER_WEEK_SLOTS: RIVER_WEEK_SLOTS,
    getMonthWeeksBySlots: getMonthWeeksBySlots,
    renderRiverBackground: renderRiverBackground,
    renderMonthRiverOverlay: renderMonthRiverOverlay,
    renderWeekRiverOverlay: renderWeekRiverOverlay,
    renderRiverItem: renderRiverItem,
    clearRiverLayer: clearRiverLayer
  };
})();
