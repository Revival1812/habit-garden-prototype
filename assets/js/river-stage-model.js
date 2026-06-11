/* River Stage data helpers for the static prototype. */
(function () {
  'use strict';

  var STORAGE_KEYS = {
    habits: 'habitGarden.habits'
  };

  var STATUS_META = {
    real: {
      status: 'real',
      label: '完成',
      asset: 'assets/svg/river-items/lotus.svg',
      objectType: 'lotus'
    },
    entry: {
      status: 'entry',
      label: '入场',
      asset: 'assets/svg/river-items/leaf-dark.svg',
      objectType: 'leaf-dark'
    },
    downgrade: {
      status: 'downgrade',
      label: '降级',
      asset: 'assets/svg/river-items/leaf-light.svg',
      objectType: 'leaf-light'
    },
    missed: {
      status: 'missed',
      label: '未发生',
      asset: 'assets/svg/river-items/stone.svg',
      objectType: 'stone'
    },
    unrecorded: {
      status: 'unrecorded',
      label: '未记录',
      asset: 'assets/svg/river-items/ripple.svg',
      objectType: 'ripple'
    }
  };

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function toDate(value) {
    if (value instanceof Date) return new Date(value.getTime());
    if (typeof value === 'string') {
      var parts = value.split('-').map(Number);
      if (parts.length >= 3 && parts.every(function (part) { return !Number.isNaN(part); })) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
      }
    }
    return new Date(value || Date.now());
  }

  function toISODate(date) {
    var d = toDate(date);
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function safeGetHabits() {
    if (window.AppState && typeof window.AppState.getHabits === 'function') {
      return window.AppState.getHabits();
    }

    try {
      var raw = localStorage.getItem(STORAGE_KEYS.habits);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function safeSaveHabits(habits) {
    if (window.AppState && typeof window.AppState.saveHabits === 'function') {
      return window.AppState.saveHabits(habits);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(habits));
      return true;
    } catch (error) {
      return false;
    }
  }

  function getCurrentMonthKey(date) {
    var d = toDate(date || new Date());
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1);
  }

  function getMonthDays(year, monthIndex) {
    var count = new Date(year, monthIndex + 1, 0).getDate();
    var days = [];

    for (var day = 1; day <= count; day += 1) {
      var date = new Date(year, monthIndex, day);
      days.push({
        year: year,
        monthIndex: monthIndex,
        day: day,
        date: date,
        dateISO: toISODate(date)
      });
    }

    return days;
  }

  function getMonthWeeks(year, monthIndex) {
    var days = getMonthDays(year, monthIndex);
    var weeks = [];

    for (var index = 0; index < days.length; index += 7) {
      weeks.push(days.slice(index, index + 7));
    }

    return weeks;
  }

  function getRecordForDate(habit, dateISO) {
    if (!habit || !Array.isArray(habit.records)) return null;

    for (var i = 0; i < habit.records.length; i += 1) {
      if (habit.records[i] && habit.records[i].date === dateISO) {
        return habit.records[i];
      }
    }

    return null;
  }

  function normalizeStatus(status) {
    return STATUS_META[status] ? status : 'unrecorded';
  }

  function upsertHabitRecord(habitId, dateISO, status, note) {
    var normalizedStatus = normalizeStatus(status);
    if (normalizedStatus === 'unrecorded') return null;

    var habits = safeGetHabits();
    var target = null;

    for (var i = 0; i < habits.length; i += 1) {
      if (habits[i] && habits[i].id === habitId) {
        target = habits[i];
        break;
      }
    }

    if (!target) return null;
    if (!Array.isArray(target.records)) target.records = [];

    var cleanDate = dateISO || toISODate(new Date());
    var cleanNote = typeof note === 'string' ? note.trim() : '';
    var nextRecord = {
      date: cleanDate,
      status: normalizedStatus,
      note: cleanNote,
      updatedAt: new Date().toISOString()
    };

    var existing = getRecordForDate(target, cleanDate);
    if (existing) {
      existing.status = nextRecord.status;
      existing.note = nextRecord.note;
      existing.reason = '';
      existing.updatedAt = nextRecord.updatedAt;
      nextRecord = existing;
    } else {
      target.records.push(nextRecord);
    }

    safeSaveHabits(habits);
    return nextRecord;
  }

  function getStatusLabel(status) {
    return STATUS_META[normalizeStatus(status)].label;
  }

  function getStatusAsset(status) {
    return STATUS_META[normalizeStatus(status)].asset;
  }

  function getStatusObjectType(status) {
    return STATUS_META[normalizeStatus(status)].objectType;
  }

  window.RiverStageModel = {
    STATUS_META: STATUS_META,
    getCurrentMonthKey: getCurrentMonthKey,
    getMonthDays: getMonthDays,
    getMonthWeeks: getMonthWeeks,
    getRecordForDate: getRecordForDate,
    upsertHabitRecord: upsertHabitRecord,
    getStatusLabel: getStatusLabel,
    getStatusAsset: getStatusAsset,
    getStatusObjectType: getStatusObjectType,
    normalizeStatus: normalizeStatus,
    toISODate: toISODate
  };
})();
