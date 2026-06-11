/* Today record popover for the River Stage system. */
(function () {
  'use strict';

  var activePopover = null;
  var activeOptions = {};

  var STATUS_OPTIONS = [
    { status: 'real', label: '完成' },
    { status: 'entry', label: '入场' },
    { status: 'downgrade', label: '降级' },
    { status: 'missed', label: '未发生' }
  ];

  function getTodayISO() {
    if (window.AppState && typeof window.AppState.getTodayISO === 'function') {
      return window.AppState.getTodayISO();
    }
    if (window.RiverStageModel && typeof window.RiverStageModel.toISODate === 'function') {
      return window.RiverStageModel.toISODate(new Date());
    }
    return new Date().toISOString().slice(0, 10);
  }

  function habitTitle(habit) {
    return habit.wish || habit.goldenBehavior || habit.entryAction || '一个小习惯';
  }

  function habitHint(habit) {
    return habit.entryAction || habit.realAction || habit.promptSentence || '';
  }

  function getStatusLabel(status) {
    if (window.RiverStageModel && typeof window.RiverStageModel.getStatusLabel === 'function') {
      return window.RiverStageModel.getStatusLabel(status);
    }

    for (var i = 0; i < STATUS_OPTIONS.length; i += 1) {
      if (STATUS_OPTIONS[i].status === status) return STATUS_OPTIONS[i].label;
    }

    return '未记录';
  }

  function getExistingRecord(habit, today) {
    if (window.RiverStageModel && typeof window.RiverStageModel.getRecordForDate === 'function') {
      return window.RiverStageModel.getRecordForDate(habit, today);
    }

    if (!habit || !Array.isArray(habit.records)) return null;
    for (var i = 0; i < habit.records.length; i += 1) {
      if (habit.records[i] && habit.records[i].date === today) return habit.records[i];
    }
    return null;
  }

  function getRecordNote(record) {
    if (!record) return '';
    if (typeof record.note === 'string' && record.note) return record.note;
    if (typeof record.reason === 'string' && record.reason) return record.reason;
    return '';
  }

  function updateCurrentStatus(row, status, saved) {
    var current = row.querySelector('.today-record-current');
    if (!current) return;
    current.textContent = (saved ? '已记录：' : '今日：') + getStatusLabel(status);
  }

  function setRowStatus(row, status, options) {
    var opts = options || {};
    row.dataset.selectedStatus = status;
    row.querySelectorAll('.today-record-status').forEach(function (button) {
      var isSelected = button.dataset.status === status;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    var noteWrap = row.querySelector('.today-record-note');
    if (noteWrap) noteWrap.hidden = false;

    var saveButton = row.querySelector('.today-record-save');
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent = opts.saved ? '已留下' : '留下今天';
    }

    row.classList.toggle('is-saved', !!opts.saved);
    updateCurrentStatus(row, status, !!opts.saved);
  }

  function saveRow(row, today, options) {
    var status = row.dataset.selectedStatus;
    if (!status || !window.RiverStageModel) return null;

    var habitId = row.dataset.habitId;
    var noteField = row.querySelector('.today-record-note-input');
    var note = noteField ? noteField.value : '';
    var record = window.RiverStageModel.upsertHabitRecord(habitId, today, status, note);

    row.classList.add('is-saved');
    updateCurrentStatus(row, status, true);
    var saveButton = row.querySelector('.today-record-save');
    if (saveButton) saveButton.textContent = '已留下';
    if (typeof options.onSaveRecord === 'function') {
      options.onSaveRecord(habitId, record);
    }

    return record;
  }

  function renderHabitRow(habit, today, options) {
    var record = getExistingRecord(habit, today);

    var row = document.createElement('article');
    row.className = 'today-record-row';
    row.dataset.habitId = habit.id;

    var header = document.createElement('div');
    header.className = 'today-record-row__header';

    var title = document.createElement('h3');
    title.className = 'today-record-row__title';
    title.textContent = habitTitle(habit);
    header.appendChild(title);

    var current = document.createElement('span');
    current.className = 'today-record-current';
    current.textContent = record ? '已记录：' + getStatusLabel(record.status) : '今日：未记录';
    header.appendChild(current);
    row.appendChild(header);

    var hint = document.createElement('p');
    hint.className = 'today-record-row__hint';
    hint.textContent = habitHint(habit);
    row.appendChild(hint);

    var picker = document.createElement('div');
    picker.className = 'today-record-statuses';
    picker.setAttribute('aria-label', '今日状态');

    STATUS_OPTIONS.forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'today-record-status today-record-status--' + item.status;
      button.dataset.status = item.status;
      button.setAttribute('aria-pressed', 'false');
      button.textContent = item.label;
      button.addEventListener('click', function () {
        setRowStatus(row, item.status);
      });
      picker.appendChild(button);
    });
    row.appendChild(picker);

    var noteWrap = document.createElement('div');
    noteWrap.className = 'today-record-note';
    noteWrap.hidden = true;

    var noteLabel = document.createElement('label');
    noteLabel.className = 'today-record-note__label';
    noteLabel.textContent = '想法 / 原因，可不填';

    var noteInput = document.createElement('textarea');
    noteInput.className = 'today-record-note-input';
    noteInput.rows = 2;
    noteInput.maxLength = 160;
    noteInput.placeholder = '想法 / 原因，可不填';
    noteLabel.appendChild(noteInput);
    noteWrap.appendChild(noteLabel);
    row.appendChild(noteWrap);

    var footer = document.createElement('div');
    footer.className = 'today-record-row__footer';

    var saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'today-record-save';
    saveButton.disabled = true;
    saveButton.textContent = '留下今天';
    saveButton.addEventListener('click', function () {
      saveRow(row, today, options);
    });
    footer.appendChild(saveButton);
    row.appendChild(footer);

    if (record && record.status) {
      noteInput.value = getRecordNote(record);
      setRowStatus(row, record.status, { saved: true });
    }

    return row;
  }

  function renderTodayRecordPopover(container, habits, options) {
    var opts = options || {};
    var today = opts.today || getTodayISO();
    var list = Array.isArray(habits) ? habits.slice() : [];

    if (opts.focusHabitId) {
      list = list.filter(function (habit) { return habit.id === opts.focusHabitId; });
    }

    var popover = document.createElement('section');
    popover.className = 'today-record-popover';
    popover.setAttribute('aria-label', '今日记录');
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-modal', 'false');
    popover.hidden = true;

    var header = document.createElement('div');
    header.className = 'today-record-popover__header';

    var title = document.createElement('h2');
    title.textContent = '今日记录';
    header.appendChild(title);

    var closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'today-record-popover__close';
    closeButton.setAttribute('aria-label', '关闭');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', closeTodayRecordPopover);
    header.appendChild(closeButton);
    popover.appendChild(header);

    var helper = document.createElement('p');
    helper.className = 'today-record-popover__helper';
    helper.textContent = '选择今天最接近的状态就好。';
    popover.appendChild(helper);

    var body = document.createElement('div');
    body.className = 'today-record-popover__body';
    list.forEach(function (habit) {
      body.appendChild(renderHabitRow(habit, today, opts));
    });

    if (!list.length) {
      var empty = document.createElement('p');
      empty.className = 'today-record-popover__empty';
      empty.textContent = '先设计一个小习惯。';
      body.appendChild(empty);
    }

    popover.appendChild(body);
    container.replaceChildren(popover);

    activePopover = popover;
    activeOptions = opts;
    return popover;
  }

  function openTodayRecordPopover() {
    if (!activePopover) return;
    activePopover.hidden = false;
    activePopover.classList.add('is-open');
    if (typeof activeOptions.onOpen === 'function') activeOptions.onOpen(activePopover);
  }

  function closeTodayRecordPopover() {
    if (!activePopover) return;
    activePopover.classList.remove('is-open');
    activePopover.hidden = true;
    if (typeof activeOptions.onClose === 'function') activeOptions.onClose(activePopover);
  }

  function toggleTodayRecordPopover() {
    if (!activePopover) return;
    if (activePopover.hidden) {
      openTodayRecordPopover();
    } else {
      closeTodayRecordPopover();
    }
  }

  window.TodayRecordPopover = {
    renderTodayRecordPopover: renderTodayRecordPopover,
    openTodayRecordPopover: openTodayRecordPopover,
    closeTodayRecordPopover: closeTodayRecordPopover,
    toggleTodayRecordPopover: toggleTodayRecordPopover
  };
})();
