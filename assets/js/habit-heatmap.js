/* Soft year heatmap for River Detail. */
(function () {
  'use strict';

  var STATUS_LABELS = {
    real: '完成',
    entry: '入场',
    downgrade: '降级',
    missed: '未发生',
    unrecorded: '未记录',
    future: '未到'
  };

  function getModel() {
    return window.RiverStageModel;
  }

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function toISODate(date) {
    var model = getModel();
    if (model && typeof model.toISODate === 'function') return model.toISODate(date);
    return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
  }

  function parseISODate(dateISO) {
    var parts = String(dateISO || '').split('-').map(Number);
    if (parts.length < 3 || parts.some(function (part) { return Number.isNaN(part); })) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function getYearFromISO(dateISO) {
    var date = parseISODate(dateISO);
    return date ? date.getFullYear() : null;
  }

  function normalizeStatus(status) {
    if (status === 'future') return 'future';
    var model = getModel();
    return model ? model.normalizeStatus(status) : (status || 'unrecorded');
  }

  function getStatusLabel(status) {
    var normalized = normalizeStatus(status);
    if (STATUS_LABELS[normalized]) return STATUS_LABELS[normalized];
    var model = getModel();
    return model ? model.getStatusLabel(normalized) : normalized;
  }

  function getHeatmapStatusClass(status) {
    return 'habit-heatmap__day--' + normalizeStatus(status);
  }

  function getRecord(habit, dateISO) {
    var model = getModel();
    if (model) return model.getRecordForDate(habit, dateISO);
    if (!habit || !Array.isArray(habit.records)) return null;
    return habit.records.find(function (record) { return record.date === dateISO; }) || null;
  }

  function getYearsForHabit(habit) {
    var currentYear = new Date().getFullYear();
    var years = [currentYear];

    if (habit && habit.createdAt) {
      var createdYear = getYearFromISO(habit.createdAt);
      if (createdYear) years.push(createdYear);
    }

    if (habit && Array.isArray(habit.records)) {
      habit.records.forEach(function (record) {
        var recordYear = record && record.date ? getYearFromISO(record.date) : null;
        if (recordYear) years.push(recordYear);
      });
    }

    var minYear = Math.min.apply(null, years);
    var maxYear = Math.max.apply(null, years);
    var result = [];
    for (var year = minYear; year <= maxYear; year += 1) result.push(year);
    return result;
  }

  function createDayData(habit, date, year, todayISO) {
    var dateISO = toISODate(date);
    var record = getRecord(habit, dateISO);
    var isFuture = dateISO > todayISO;
    var status = isFuture ? 'future' : (record ? normalizeStatus(record.status) : 'unrecorded');

    return {
      dateISO: dateISO,
      dayOfWeek: date.getDay(),
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: year,
      status: status,
      record: record,
      note: record && typeof record.note === 'string' ? record.note.trim() : '',
      isFuture: isFuture,
      isPadding: false
    };
  }

  function buildYearHeatmapData(habit, year) {
    var selectedYear = Number.isInteger(year) ? year : new Date().getFullYear();
    var todayISO = toISODate(new Date());
    var weeks = [];
    var monthLabels = [];
    var currentWeek = {
      weekIndex: 0,
      days: []
    };
    var cursor = new Date(selectedYear, 0, 1);
    var end = new Date(selectedYear, 11, 31);

    for (var leading = 0; leading < cursor.getDay(); leading += 1) {
      currentWeek.days.push({ isPadding: true, dayOfWeek: leading });
    }

    while (cursor.getTime() <= end.getTime()) {
      if (cursor.getDay() === 0 && currentWeek.days.length) {
        weeks.push(currentWeek);
        currentWeek = {
          weekIndex: weeks.length,
          days: []
        };
      }

      var dayData = createDayData(habit, cursor, selectedYear, todayISO);
      currentWeek.days.push(dayData);

      if (cursor.getDate() === 1) {
        monthLabels.push({
          month: cursor.getMonth() + 1,
          label: (cursor.getMonth() + 1) + '月',
          weekIndex: currentWeek.weekIndex
        });
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    while (currentWeek.days.length < 7) {
      currentWeek.days.push({ isPadding: true, dayOfWeek: currentWeek.days.length });
    }
    weeks.push(currentWeek);

    weeks.forEach(function (week, index) {
      week.weekIndex = index;
    });
    monthLabels.forEach(function (label) {
      label.weekIndex = Math.max(0, Math.min(label.weekIndex, weeks.length - 1));
    });

    return {
      year: selectedYear,
      weeks: weeks,
      monthLabels: monthLabels
    };
  }

  function formatDateLabel(dateISO) {
    var date = parseISODate(dateISO);
    if (!date) return dateISO || '';
    return (date.getMonth() + 1) + '月' + date.getDate() + '日';
  }

  function findDayData(data, dateISO) {
    if (!data || !dateISO) return null;
    for (var weekIndex = 0; weekIndex < data.weeks.length; weekIndex += 1) {
      var days = data.weeks[weekIndex].days;
      for (var dayIndex = 0; dayIndex < days.length; dayIndex += 1) {
        if (days[dayIndex] && days[dayIndex].dateISO === dateISO) return days[dayIndex];
      }
    }
    return null;
  }

  function renderHeatmapDayDetail(container, dayData) {
    if (!container) return null;

    var root = document.createElement('section');
    root.className = 'heatmap-day-detail';
    root.setAttribute('aria-live', 'polite');

    if (!dayData || !dayData.dateISO) {
      root.textContent = '点选一天，看看它留下了什么。';
      container.replaceChildren(root);
      return root;
    }

    var date = document.createElement('h3');
    date.className = 'heatmap-day-detail__date';
    date.textContent = formatDateLabel(dayData.dateISO);
    root.appendChild(date);

    var status = document.createElement('p');
    status.className = 'heatmap-day-detail__status';
    status.textContent = getStatusLabel(dayData.status);
    root.appendChild(status);

    if (dayData.status === 'future') {
      var future = document.createElement('p');
      future.className = 'heatmap-day-detail__copy';
      future.textContent = '这一天还没到。';
      root.appendChild(future);
    } else if (dayData.status === 'unrecorded') {
      var empty = document.createElement('p');
      empty.className = 'heatmap-day-detail__copy';
      empty.textContent = '这一天还没有留下记录。';
      root.appendChild(empty);
    }

    if (dayData.note) {
      var note = document.createElement('p');
      note.className = 'heatmap-day-detail__note';
      note.textContent = dayData.note;
      root.appendChild(note);
    }

    container.replaceChildren(root);
    return root;
  }

  function renderMonthLabels(parent, data) {
    var labels = document.createElement('div');
    labels.className = 'heatmap-month-labels';
    labels.style.setProperty('--heatmap-columns', String(Math.max(data.weeks.length, 1)));

    data.monthLabels.forEach(function (item) {
      var label = document.createElement('span');
      label.className = 'heatmap-month-label';
      label.style.gridColumn = String(item.weekIndex + 1);
      label.textContent = item.label;
      labels.appendChild(label);
    });

    parent.appendChild(labels);
  }

  function renderYearControls(parent, years, selectedYear, onYearChange) {
    var controls = document.createElement('div');
    controls.className = 'habit-heatmap__year-controls';

    var subtitle = document.createElement('p');
    subtitle.className = 'habit-heatmap__year';
    subtitle.textContent = selectedYear + ' 年';
    controls.appendChild(subtitle);

    if (years.length > 1) {
      var select = document.createElement('select');
      select.className = 'habit-heatmap__year-select';
      select.setAttribute('aria-label', '选择年份');

      years.forEach(function (year) {
        var option = document.createElement('option');
        option.value = String(year);
        option.textContent = year + ' 年';
        option.selected = year === selectedYear;
        select.appendChild(option);
      });

      select.addEventListener('change', function () {
        if (typeof onYearChange === 'function') onYearChange(Number(select.value));
      });
      controls.appendChild(select);
    }

    parent.appendChild(controls);
  }

  function renderLegend(parent) {
    var legend = document.createElement('div');
    legend.className = 'heatmap-legend';
    [
      { status: 'unrecorded', label: '未记录' },
      { status: 'entry', label: '入场' },
      { status: 'downgrade', label: '降级' },
      { status: 'real', label: '完成' },
      { status: 'missed', label: '未发生' }
    ].forEach(function (item) {
      var entry = document.createElement('span');
      entry.className = 'heatmap-legend__item';

      var swatch = document.createElement('span');
      swatch.className = 'heatmap-legend__swatch ' + getHeatmapStatusClass(item.status);
      entry.appendChild(swatch);
      entry.appendChild(document.createTextNode(item.label));
      legend.appendChild(entry);
    });

    parent.appendChild(legend);
  }

  function renderHabitHeatmap(container, habit, options) {
    var opts = options || {};
    var model = getModel();
    if (!container || !model) return null;

    var years = getYearsForHabit(habit);
    var requestedYear = Number.isInteger(opts.year) ? opts.year : new Date().getFullYear();
    if (years.indexOf(requestedYear) === -1) {
      years.push(requestedYear);
      years.sort(function (a, b) { return a - b; });
    }

    var data = buildYearHeatmapData(habit, requestedYear);
    var selectedDay = findDayData(data, opts.selectedDate);

    var root = document.createElement('div');
    root.className = 'habit-heatmap';
    root.dataset.scope = 'year';
    root.dataset.year = String(data.year);

    var header = document.createElement('div');
    header.className = 'habit-heatmap__header';

    var title = document.createElement('h3');
    title.className = 'habit-heatmap__title';
    title.textContent = opts.title || '执行热力图';
    header.appendChild(title);
    renderYearControls(header, years, data.year, opts.onYearChange);
    root.appendChild(header);

    var viewport = document.createElement('div');
    viewport.className = 'habit-heatmap__viewport';

    renderMonthLabels(viewport, data);

    var body = document.createElement('div');
    body.className = 'heatmap-body';

    var weekdays = document.createElement('div');
    weekdays.className = 'heatmap-weekday-labels';
    ['', '一', '', '三', '', '五', ''].forEach(function (label) {
      var item = document.createElement('span');
      item.textContent = label;
      weekdays.appendChild(item);
    });
    body.appendChild(weekdays);

    var grid = document.createElement('div');
    grid.className = 'heatmap-grid';
    grid.style.setProperty('--heatmap-columns', String(Math.max(data.weeks.length, 1)));

    data.weeks.forEach(function (week) {
      week.days.forEach(function (day, rowIndex) {
        if (!day || day.isPadding) {
          var spacer = document.createElement('span');
          spacer.className = 'habit-heatmap__day habit-heatmap__day--padding';
          spacer.style.gridColumn = String(week.weekIndex + 1);
          spacer.style.gridRow = String(rowIndex + 1);
          grid.appendChild(spacer);
          return;
        }

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'habit-heatmap__day ' + getHeatmapStatusClass(day.status);
        button.style.gridColumn = String(week.weekIndex + 1);
        button.style.gridRow = String(day.dayOfWeek + 1);
        button.dataset.heatmapDay = 'true';
        button.dataset.date = day.dateISO;
        button.dataset.status = day.status;
        button.dataset.year = String(data.year);
        button.dataset.note = day.note || '';
        button.setAttribute('aria-label', day.dateISO + '，' + getStatusLabel(day.status));
        button.setAttribute('aria-disabled', day.isFuture ? 'true' : 'false');
        button.title = day.dateISO + ' ' + getStatusLabel(day.status);
        if (opts.selectedDate === day.dateISO) button.classList.add('is-selected');
        grid.appendChild(button);
      });
    });

    body.appendChild(grid);
    viewport.appendChild(body);
    root.appendChild(viewport);

    renderLegend(root);

    var detailMount = document.createElement('div');
    detailMount.className = 'heatmap-day-detail-mount';
    root.appendChild(detailMount);
    renderHeatmapDayDetail(detailMount, selectedDay);

    container.replaceChildren(root);

    if (opts.bindClick !== false) {
      bindHeatmapDayClick(root, {
        habit: habit,
        data: data,
        detailMount: detailMount,
        onDayClick: opts.onDayClick
      });
    }

    return root;
  }

  function bindHeatmapDayClick(container, options) {
    if (!container || container.__heatmapClickBound) return;
    var opts = options || {};

    container.addEventListener('click', function (event) {
      var cell = event.target.closest('[data-heatmap-day="true"]');
      if (!cell) return;

      container.querySelectorAll('.habit-heatmap__day.is-selected').forEach(function (selected) {
        selected.classList.remove('is-selected');
      });
      cell.classList.add('is-selected');

      var dayData = findDayData(opts.data, cell.dataset.date) || {
        dateISO: cell.dataset.date,
        status: cell.dataset.status || 'unrecorded',
        note: cell.dataset.note || '',
        record: getRecord(opts.habit, cell.dataset.date),
        isFuture: cell.dataset.status === 'future'
      };

      renderHeatmapDayDetail(opts.detailMount, dayData);

      var detail = {
        date: dayData.dateISO,
        status: dayData.status || 'unrecorded',
        note: dayData.note || '',
        record: dayData.record || null,
        habit: opts.habit || null,
        year: Number(cell.dataset.year),
        isFuture: !!dayData.isFuture,
        dayData: dayData
      };

      if (typeof opts.onDayClick === 'function') opts.onDayClick(detail);
      container.dispatchEvent(new CustomEvent('habit-heatmap:day-click', {
        bubbles: true,
        detail: detail
      }));
    });

    container.__heatmapClickBound = true;
  }

  window.HabitHeatmap = {
    renderHabitHeatmap: renderHabitHeatmap,
    buildYearHeatmapData: buildYearHeatmapData,
    getYearsForHabit: getYearsForHabit,
    getHeatmapStatusClass: getHeatmapStatusClass,
    bindHeatmapDayClick: bindHeatmapDayClick,
    renderHeatmapDayDetail: renderHeatmapDayDetail
  };
})();
