(function () {
  'use strict';

  var STORAGE_KEYS = {
    selectedHabitId: 'habitGarden.selectedHabitId',
    detailSelectedMonth: 'habitGarden.detailSelectedMonth',
    detailSelectedWeek: 'habitGarden.detailSelectedWeek',
    detailDrawerCollapsed: 'habitGarden.detailDrawerCollapsed',
    editingHabitId: 'habitGarden.editingHabitId'
  };

  var state = {
    habit: null,
    selectedHabitId: '',
    selectedYear: 0,
    selectedMonthIndex: 0,
    selectedWeekIndex: 0,
    selectedDate: '',
    selectedHeatmapDate: '',
    selectedHeatmapYear: new Date().getFullYear(),
    drawerCollapsed: false
  };

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof text === 'string') element.textContent = text;
    return element;
  }

  function toISODate(date) {
    if (window.RiverStageModel && typeof window.RiverStageModel.toISODate === 'function') {
      return window.RiverStageModel.toISODate(date);
    }
    return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
  }

  function getTodayISO() {
    if (window.AppState && typeof window.AppState.getTodayISO === 'function') {
      return window.AppState.getTodayISO();
    }
    return toISODate(new Date());
  }

  function getSelectedHabitId() {
    try {
      return localStorage.getItem(STORAGE_KEYS.selectedHabitId) || '';
    } catch (error) {
      return '';
    }
  }

  function setSelectedHabitId(id) {
    if (!id) return;
    if (window.AppState && typeof window.AppState.setSelectedHabitId === 'function') {
      window.AppState.setSelectedHabitId(id);
    } else {
      localStorage.setItem(STORAGE_KEYS.selectedHabitId, id);
    }
    state.selectedHabitId = id;
  }

  function getHabits() {
    if (window.AppState && typeof window.AppState.getHabits === 'function') {
      return window.AppState.getHabits();
    }

    try {
      var raw = localStorage.getItem('habitGarden.habits');
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function getHabitById(id) {
    if (!id) return null;
    if (window.AppState && typeof window.AppState.getHabitById === 'function') {
      return window.AppState.getHabitById(id);
    }

    var habits = getHabits();
    for (var i = 0; i < habits.length; i += 1) {
      if (habits[i] && habits[i].id === id) return habits[i];
    }
    return null;
  }

  function getHabitTitle(habit) {
    return habit.wish || habit.goldenBehavior || habit.entryAction || '一个习惯';
  }

  function getHabitSummary(habit) {
    if (habit.promptSentence) return habit.promptSentence;
    if (habit.entryAction) return habit.entryAction + '。';
    if (habit.goldenBehavior) return habit.goldenBehavior + '。';
    return '先从第一步开始。';
  }

  function getPlanRows(habit) {
    return [
      { label: '愿望', value: habit.wish },
      { label: '黄金行为', value: habit.goldenBehavior },
      { label: '入场动作', value: habit.entryAction },
      { label: '真实行动', value: habit.realAction },
      { label: '自然提示', value: habit.promptSentence || habit.prompt },
      { label: '当前提示强度', value: habit.promptStrength }
    ].filter(function (row) {
      return row.value !== undefined && row.value !== null && String(row.value).trim() !== '';
    });
  }

  function currentWeekIndexForDate(date) {
    return Math.floor((date.getDate() - 1) / 7);
  }

  function getMonthWeeks(year, monthIndex) {
    if (window.RiverStageRenderer && typeof window.RiverStageRenderer.getMonthWeeksBySlots === 'function') {
      return window.RiverStageRenderer.getMonthWeeksBySlots(year, monthIndex);
    }

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
          dateISO: year + '-' + pad2(monthIndex + 1) + '-' + pad2(day)
        });
      }
      weeks.push({ weekIndex: weeks.length + 1, startDay: startDay, endDay: endDay, days: days });
    }
    return weeks;
  }

  function clampWeekIndex(year, monthIndex, weekIndex) {
    var weeks = getMonthWeeks(year, monthIndex);
    if (!weeks.length) return 0;
    return Math.max(0, Math.min(Number(weekIndex) || 0, weeks.length - 1));
  }

  function readDetailViewState() {
    var now = new Date();
    var monthKey = localStorage.getItem(STORAGE_KEYS.detailSelectedMonth);
    var weekValue = localStorage.getItem(STORAGE_KEYS.detailSelectedWeek);
    var year = now.getFullYear();
    var monthIndex = now.getMonth();
    var weekIndex = currentWeekIndexForDate(now);

    if (monthKey && /^\d{4}-\d{2}$/.test(monthKey)) {
      var parts = monthKey.split('-').map(Number);
      year = parts[0];
      monthIndex = parts[1] - 1;
      weekIndex = Number.isFinite(Number(weekValue)) ? Number(weekValue) : weekIndex;
    }

    state.selectedYear = year;
    state.selectedMonthIndex = monthIndex;
    state.selectedWeekIndex = clampWeekIndex(year, monthIndex, weekIndex);
    state.drawerCollapsed = localStorage.getItem(STORAGE_KEYS.detailDrawerCollapsed) === 'true';
  }

  function saveDetailViewState() {
    localStorage.setItem(
      STORAGE_KEYS.detailSelectedMonth,
      state.selectedYear + '-' + pad2(state.selectedMonthIndex + 1)
    );
    localStorage.setItem(STORAGE_KEYS.detailSelectedWeek, String(state.selectedWeekIndex));
  }

  function saveDrawerState() {
    localStorage.setItem(STORAGE_KEYS.detailDrawerCollapsed, state.drawerCollapsed ? 'true' : 'false');
  }

  function getSelectedWeek() {
    var weeks = getMonthWeeks(state.selectedYear, state.selectedMonthIndex);
    state.selectedWeekIndex = clampWeekIndex(state.selectedYear, state.selectedMonthIndex, state.selectedWeekIndex);
    return weeks[state.selectedWeekIndex] || null;
  }

  function getRecordForDate(habit, dateISO) {
    if (window.RiverStageModel && typeof window.RiverStageModel.getRecordForDate === 'function') {
      return window.RiverStageModel.getRecordForDate(habit, dateISO);
    }
    if (!habit || !Array.isArray(habit.records)) return null;
    for (var i = 0; i < habit.records.length; i += 1) {
      if (habit.records[i] && habit.records[i].date === dateISO) return habit.records[i];
    }
    return null;
  }

  function getStatusLabel(status) {
    if (window.RiverStageModel && typeof window.RiverStageModel.getStatusLabel === 'function') {
      return window.RiverStageModel.getStatusLabel(status);
    }
    return status || '未记录';
  }

  function formatMonthTitle(year, monthIndex) {
    return year + ' 年 ' + (monthIndex + 1) + ' 月';
  }

  function formatWeekRange(week) {
    if (!week || !week.days.length) return '';
    var first = week.days[0];
    var last = week.days[week.days.length - 1];
    return (first.monthIndex + 1) + '.' + first.day + ' - ' + (last.monthIndex + 1) + '.' + last.day;
  }

  function formatDateLabelFromISO(dateISO) {
    var parts = String(dateISO || '').split('-').map(Number);
    if (parts.length < 3 || parts.some(function (part) { return Number.isNaN(part); })) return dateISO || '';
    return parts[1] + ' 月 ' + parts[2] + ' 日';
  }

  function getYearFromISO(dateISO) {
    var parts = String(dateISO || '').split('-').map(Number);
    return parts.length >= 3 && !Number.isNaN(parts[0]) ? parts[0] : new Date().getFullYear();
  }

  function getDayDetail(habit, dateISO) {
    var record = getRecordForDate(habit, dateISO);
    var status = record ? record.status : 'unrecorded';
    return {
      dateISO: dateISO,
      dateLabel: formatDateLabelFromISO(dateISO),
      status: status,
      label: getStatusLabel(status),
      note: record && (record.note || record.reason) ? (record.note || record.reason) : ''
    };
  }

  function getTodayPopoverHost() {
    var host = document.getElementById('todayRecordPopoverHost');
    if (host) return host;

    host = document.createElement('div');
    host.id = 'todayRecordPopoverHost';
    host.className = 'today-record-host';
    document.body.appendChild(host);
    return host;
  }

  function isTodayPopoverOpen() {
    var host = getTodayPopoverHost();
    var popover = host.querySelector('.today-record-popover');
    return !!(popover && !popover.hidden);
  }

  function renderTodayPopover() {
    if (!window.TodayRecordPopover) return null;

    return window.TodayRecordPopover.renderTodayRecordPopover(getTodayPopoverHost(), getHabits(), {
      source: 'detail',
      focusHabitId: getSelectedHabitId(),
      onSaveRecord: refreshDetailAfterTodayRecord
    });
  }

  function refreshDetailAfterTodayRecord(habitId) {
    var selectedHabitId = getSelectedHabitId();
    if (!selectedHabitId || selectedHabitId === habitId) {
      renderDetailPage();
    }
  }

  function shiftMonth(delta) {
    var next = new Date(state.selectedYear, state.selectedMonthIndex + delta, 1);
    state.selectedYear = next.getFullYear();
    state.selectedMonthIndex = next.getMonth();
    state.selectedWeekIndex = 0;
    state.selectedDate = '';
    saveDetailViewState();
    renderDetailPage();
  }

  function setSelectedWeekIndex(weekIndex) {
    state.selectedWeekIndex = clampWeekIndex(state.selectedYear, state.selectedMonthIndex, weekIndex);
    state.selectedDate = '';
    saveDetailViewState();
    renderDetailPage();
  }

  function selectDay(dateISO) {
    state.selectedDate = dateISO;
    state.selectedHeatmapDate = dateISO;
    state.selectedHeatmapYear = getYearFromISO(dateISO);
    state.drawerCollapsed = false;
    saveDrawerState();
    renderDetailPage();
  }

  function selectHeatmapDay(detail) {
    var dateISO = typeof detail === 'string' ? detail : (detail && detail.date);
    if (!dateISO) return;
    state.selectedHeatmapDate = dateISO;
    state.selectedDate = dateISO;
    state.selectedHeatmapYear = (detail && detail.year) || getYearFromISO(dateISO);
    state.drawerCollapsed = false;
    saveDrawerState();
    renderDetailPage();
  }

  function selectHeatmapYear(year) {
    state.selectedHeatmapYear = Number(year) || new Date().getFullYear();
    renderDetailPage();
  }

  function toggleDrawer() {
    state.drawerCollapsed = !state.drawerCollapsed;
    saveDrawerState();
    renderDetailPage();
  }

  function saveEditingHabitId(habitId) {
    if (!habitId) return;
    localStorage.setItem(STORAGE_KEYS.editingHabitId, habitId);
    localStorage.setItem(STORAGE_KEYS.selectedHabitId, habitId);
  }

  function renderEmpty(container) {
    container.innerHTML = '';
    container.className = 'river-detail-mount river-detail-mount--empty';

    var card = createElement('section', 'detail-empty-panel river-fade-in');
    card.setAttribute('aria-label', '未选择习惯');

    var title = createElement('h1', 'detail-empty-panel__title', '还没选中习惯。');
    var copy = createElement('p', 'detail-empty-panel__copy', '先回花园，从一个习惯开始。');
    var action = document.createElement('a');
    action.className = 'btn btn--primary';
    action.href = 'index.html';
    action.textContent = '回到花园';

    card.appendChild(title);
    card.appendChild(copy);
    card.appendChild(action);
    container.appendChild(card);
  }

  function renderHabitPanel(parent, habit, week) {
    var panel = createElement('section', 'river-detail-panel river-fade-in');
    panel.setAttribute('aria-label', '当前习惯信息');

    var top = createElement('div', 'river-detail-panel__top');
    var titleWrap = createElement('div', 'river-detail-panel__title-wrap');

    var eyebrow = createElement('p', 'river-detail-panel__eyebrow', '这周的痕迹');
    var title = createElement('h1', 'river-detail-panel__title', getHabitTitle(habit));
    var summary = createElement('p', 'river-detail-panel__summary', getHabitSummary(habit));

    titleWrap.appendChild(eyebrow);
    titleWrap.appendChild(title);
    titleWrap.appendChild(summary);

    var back = document.createElement('a');
    back.className = 'river-detail-panel__back';
    back.href = 'index.html';
    back.textContent = '回到花园';

    top.appendChild(titleWrap);
    top.appendChild(back);
    panel.appendChild(top);

    var monthControls = createElement('div', 'river-detail-month-controls');
    var prev = createElement('button', 'river-detail-month-button', '上个月');
    prev.type = 'button';
    prev.addEventListener('click', function () { shiftMonth(-1); });

    var month = createElement('strong', 'river-detail-month-label', formatMonthTitle(state.selectedYear, state.selectedMonthIndex));

    var next = createElement('button', 'river-detail-month-button', '下个月');
    next.type = 'button';
    next.addEventListener('click', function () { shiftMonth(1); });

    monthControls.appendChild(prev);
    monthControls.appendChild(month);
    monthControls.appendChild(next);
    panel.appendChild(monthControls);

    var weekControls = createElement('div', 'river-detail-week-controls');
    var weekText = createElement(
      'p',
      'river-detail-week-label',
      week ? '第 ' + week.weekIndex + ' 周 · ' + formatWeekRange(week) : '这一周'
    );
    var weekCount = createElement('p', 'river-detail-week-count', week ? '本周 ' + week.days.length + ' 天' : '');

    var select = document.createElement('select');
    select.className = 'river-detail-week-select';
    select.setAttribute('aria-label', '选择周次');
    getMonthWeeks(state.selectedYear, state.selectedMonthIndex).forEach(function (item, index) {
      var option = document.createElement('option');
      option.value = String(index);
      option.textContent = '第 ' + item.weekIndex + ' 周';
      option.selected = index === state.selectedWeekIndex;
      select.appendChild(option);
    });
    select.addEventListener('change', function () {
      setSelectedWeekIndex(Number(select.value));
    });

    weekControls.appendChild(weekText);
    weekControls.appendChild(weekCount);
    weekControls.appendChild(select);
    panel.appendChild(weekControls);

    parent.appendChild(panel);
  }

  function renderDayPanel(parent, habit) {
    var panel = createElement('section', 'river-detail-day-panel river-fade-in');
    panel.setAttribute('aria-label', '这一天');

    var title = createElement('p', 'river-detail-day-panel__eyebrow', '这一天');
    panel.appendChild(title);

    if (!state.selectedDate) {
      var empty = createElement('p', 'river-detail-day-panel__empty', '点选河面上的一天，看看它留下了什么。');
      panel.appendChild(empty);
      parent.appendChild(panel);
      return;
    }

    var detail = getDayDetail(habit, state.selectedDate);
    var date = createElement('h2', 'river-detail-day-panel__date', detail.dateLabel);
    var status = createElement('p', 'river-detail-day-panel__status', detail.label);
    panel.appendChild(date);
    panel.appendChild(status);

    if (detail.note) {
      var note = createElement('p', 'river-detail-day-panel__note', detail.note);
      panel.appendChild(note);
    }

    parent.appendChild(panel);
  }

  function renderPlanModule(parent, habit) {
    var module = createElement('section', 'river-detail-drawer__module river-detail-plan-module drawer-panel plan-panel');
    var title = createElement('h2', 'river-detail-drawer__title', '当前方案');
    module.appendChild(title);

    var body = createElement('div', 'river-detail-drawer__module-body drawer-panel-body');
    var list = createElement('dl', 'river-detail-plan-list');
    getPlanRows(habit).forEach(function (row) {
      var item = createElement('div', 'river-detail-plan-list__item');
      var term = createElement('dt', '', row.label);
      var value = createElement('dd', '', String(row.value));
      item.appendChild(term);
      item.appendChild(value);
      list.appendChild(item);
    });
    body.appendChild(list);

    var action = document.createElement('a');
    action.className = 'river-detail-plan-action';
    action.href = 'create.html';
    action.textContent = '调整方案';
    action.addEventListener('click', function () {
      saveEditingHabitId(habit.id);
    });
    body.appendChild(action);

    var hint = createElement('p', 'river-detail-plan-hint', '已保存当前习惯，设计页后续可读取。');
    body.appendChild(hint);

    module.appendChild(body);
    parent.appendChild(module);
  }

  function renderDrawerDayDetail(parent, habit) {
    var detailDate = state.selectedHeatmapDate || state.selectedDate;
    var module = createElement('section', 'river-detail-drawer__day-detail');

    if (!detailDate) {
      module.textContent = '点选一天，看看它留下了什么。';
      parent.appendChild(module);
      return;
    }

    var detail = getDayDetail(habit, detailDate);
    var date = createElement('h3', 'river-detail-drawer__day-date', detail.dateLabel);
    var status = createElement('p', 'river-detail-drawer__day-status', detail.label);
    module.appendChild(date);
    module.appendChild(status);

    if (detail.note) {
      var note = createElement('p', 'river-detail-drawer__day-note', detail.note);
      module.appendChild(note);
    }

    parent.appendChild(module);
  }

  function renderHeatmapModule(parent, habit) {
    var module = createElement('section', 'river-detail-drawer__module river-detail-heatmap-module drawer-panel heatmap-panel');
    var title = createElement('h2', 'river-detail-drawer__title', '执行热力图');
    module.appendChild(title);

    var body = createElement('div', 'river-detail-drawer__module-body drawer-panel-body');
    var heatmapMount = createElement('div', 'river-detail-heatmap-mount');
    body.appendChild(heatmapMount);

    if (window.HabitHeatmap && typeof window.HabitHeatmap.renderHabitHeatmap === 'function') {
      window.HabitHeatmap.renderHabitHeatmap(heatmapMount, habit, {
        scope: 'year',
        title: '执行热力图',
        year: state.selectedHeatmapYear || new Date().getFullYear(),
        selectedDate: state.selectedHeatmapDate || state.selectedDate,
        onYearChange: selectHeatmapYear,
        onDayClick: function (detail) {
          selectHeatmapDay(detail);
        }
      });
    }

    module.appendChild(body);
    parent.appendChild(module);
  }

  function renderRightDrawer(parent, habit) {
    var drawer = createElement(
      'aside',
      'river-detail-drawer-panel detail-side-drawer' + (state.drawerCollapsed ? ' is-collapsed' : ' is-open')
    );
    drawer.setAttribute('aria-label', '详情浮窗');

    var toggle = createElement('button', 'river-detail-drawer-toggle drawer-toggle', state.drawerCollapsed ? '›' : '‹');
    toggle.type = 'button';
    toggle.setAttribute('aria-label', state.drawerCollapsed ? '展开' : '收起');
    toggle.addEventListener('click', toggleDrawer);
    drawer.appendChild(toggle);

    if (!state.drawerCollapsed) {
      var body = createElement('div', 'river-detail-drawer-body drawer-content drawer-content-horizontal');
      renderPlanModule(body, habit);
      renderHeatmapModule(body, habit);
      drawer.appendChild(body);
    }

    parent.appendChild(drawer);
  }

  function renderWeekObjects(stage, habit) {
    if (!window.RiverStageRenderer || !window.RiverStageInteractions) return;

    window.RiverStageRenderer.renderWeekRiverOverlay(
      stage,
      habit,
      state.selectedYear,
      state.selectedMonthIndex,
      state.selectedWeekIndex,
      {
        mode: 'detail',
        selectedDate: state.selectedDate
      }
    );

    window.RiverStageInteractions.bindRiverItemHover(stage);
    window.RiverStageInteractions.bindRiverItemClick(stage, {
      onClick: function (data) {
        if (window.RiverStageInteractions && typeof window.RiverStageInteractions.hideRiverTooltip === 'function') {
          window.RiverStageInteractions.hideRiverTooltip();
        }

        if (data.date === getTodayISO()) {
          renderTodayPopover();
          if (window.TodayRecordPopover) window.TodayRecordPopover.openTodayRecordPopover();
          state.selectedDate = data.date;
          state.selectedHeatmapDate = data.date;
          state.selectedHeatmapYear = getYearFromISO(data.date);
          state.drawerCollapsed = false;
          saveDrawerState();
          renderDetailPage();
          return;
        }

        selectDay(data.date);
      }
    });
  }

  function renderDetailView(container, habit) {
    container.innerHTML = '';
    container.className = 'river-detail-mount';

    var stage = createElement('section', 'river-detail-stage');
    stage.setAttribute('aria-label', '河流详情舞台');
    container.appendChild(stage);

    if (window.RiverStageRenderer) {
      window.RiverStageRenderer.renderRiverBackground(stage, { mode: 'detail' });
    }

    var overlay = createElement('div', 'river-detail-overlay');
    stage.appendChild(overlay);

    var week = getSelectedWeek();
    renderHabitPanel(overlay, habit, week);
    renderRightDrawer(overlay, habit);
    renderWeekObjects(stage, habit);
  }

  function renderDetailPage() {
    var mount = document.getElementById('riverDetailMount');
    if (!mount) return;

    state.selectedHabitId = getSelectedHabitId();
    state.habit = getHabitById(state.selectedHabitId);
    readDetailViewState();

    if (!state.selectedHabitId || !state.habit) {
      renderEmpty(mount);
      return;
    }

    renderDetailView(mount, state.habit);
  }

  function bindNav() {
    var todayLink = document.querySelector('[data-nav="today-record"]');
    if (!todayLink) return;

    todayLink.addEventListener('click', function (event) {
      event.preventDefault();
      if (!window.TodayRecordPopover) return;

      var selectedHabitId = getSelectedHabitId();
      if (!selectedHabitId) {
        var habits = getHabits();
        if (habits.length) {
          setSelectedHabitId(habits[0].id);
          renderDetailPage();
        }
      }

      if (isTodayPopoverOpen()) {
        window.TodayRecordPopover.closeTodayRecordPopover();
        return;
      }

      renderTodayPopover();
      window.TodayRecordPopover.openTodayRecordPopover();
    });
  }

  function init() {
    bindNav();
    renderDetailPage();
    window.refreshRiverDetail = renderDetailPage;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
