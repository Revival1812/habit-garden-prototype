/* ========================================
   tree-growth-model.js — data transform layer
   ========================================

   Turns raw habit arrays (from localStorage) into
   a structured Year→Month→Week→Day tree model
   that tree-renderer.js can consume directly.

   Does NOT touch the DOM.
   Does NOT depend on any external library.
   ======================================== */

(function () {
  'use strict';

  /* ---- status visual mapping ----
     No "失败" / "清零" / "惩罚" / "战胜自己" anywhere. ---- */
  var STATUS_MAP = {
    real:      { className: 'leaf-real',      label: '完成真实行动' },
    entry:     { className: 'leaf-entry',     label: '完成入场动作' },
    downgrade: { className: 'leaf-downgrade', label: '今天调轻了' },
    missed:    { className: 'leaf-missed',    label: '今天卡住了' }
  };

  var VALID_STATUSES = Object.keys(STATUS_MAP);

  /* ==============================================
     Helpers — date keys
     ============================================== */

  /**
   * getYearKey('2026-06-11') → 2026
   */
  function getYearKey(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;
    var parts = dateStr.split('-');
    var y = parseInt(parts[0], 10);
    return isNaN(y) ? null : y;
  }

  /**
   * getMonthKey('2026-06-11') → '2026-06'
   */
  function getMonthKey(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;
    var parts = dateStr.split('-');
    if (parts.length < 2) return null;
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    if (isNaN(y) || isNaN(m)) return null;
    return y + '-' + (m < 10 ? '0' : '') + m;
  }

  /**
   * getWeekKey('2026-06-11') → '2026-W24'
   * Uses ISO 8601 week numbering (Monday = first day of week).
   */
  function getWeekKey(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;
    var d = parseDateUTC(dateStr);
    if (!d) return null;

    // ISO: move to Thursday in the same week
    var dayNum = d.getUTCDay() || 7; // Sunday = 7, Monday = 1
    var thursday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 4 - dayNum));

    var year = thursday.getUTCFullYear();
    var jan1 = new Date(Date.UTC(year, 0, 1));
    var weekNo = Math.ceil((((thursday - jan1) / 86400000) + 1) / 7);

    return year + '-W' + (weekNo < 10 ? '0' : '') + weekNo;
  }

  /** Parse 'YYYY-MM-DD' to a UTC Date at noon (avoids TZ edge shifts). */
  function parseDateUTC(dateStr) {
    var parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  }

  /* ==============================================
     Record helpers
     ============================================== */

  /**
   * normalizeRecord(record) → clean record object
   *
   * Handles missing / legacy fields so downstream
   * code never sees undefined values.
   */
  function normalizeRecord(record) {
    if (!record || typeof record !== 'object') {
      return { date: '', status: 'missed', reason: null, note: '' };
    }

    var status = record.status;
    if (!status || VALID_STATUSES.indexOf(status) === -1) {
      // fallback for unknown / legacy status values
      status = 'missed';
    }

    return {
      date:   typeof record.date   === 'string' ? record.date   : '',
      status: status,
      reason: record.reason != null ? String(record.reason) : null,
      note:   typeof record.note   === 'string' ? record.note   : ''
    };
  }

  /**
   * getRecordVisualStatus(record) → { className, label }
   *
   * Record can be raw (from localStorage) or already normalized.
   */
  function getRecordVisualStatus(record) {
    var status = (record && record.status) ? record.status : 'missed';
    if (!STATUS_MAP[status]) {
      status = 'missed';
    }
    return {
      className: STATUS_MAP[status].className,
      label:     STATUS_MAP[status].label
    };
  }

  /* ==============================================
     Core grouping — records → year/month/week/day
     ============================================== */

  /**
   * groupRecordsByYearMonthWeek(records)
   *
   * @param  {Array} records  raw records array [{date, status, reason, note}, …]
   * @return {Array}          [ { year, months: [ { month, weeks: [ { weekKey, days } ] } ] } ]
   *
   * Days are always normalised.  Records without a valid date are silently skipped.
   */
  function groupRecordsByYearMonthWeek(records) {
    if (!Array.isArray(records) || records.length === 0) return [];

    // ---- step 1: normalise + bucket by year → month → week ----
    var buckets = {}; // { year: { monthKey: { weekKey: [day] } } }

    for (var i = 0; i < records.length; i++) {
      var rec = normalizeRecord(records[i]);
      if (!rec.date) continue; // skip records with no date

      var year  = getYearKey(rec.date);
      var month = getMonthKey(rec.date);
      var week  = getWeekKey(rec.date);
      if (year == null || !month || !week) continue;

      if (!buckets[year])                buckets[year] = {};
      if (!buckets[year][month])         buckets[year][month] = {};
      if (!buckets[year][month][week])   buckets[year][month][week] = [];

      buckets[year][month][week].push({
        date:   rec.date,
        status: rec.status,
        label:  getRecordVisualStatus(rec).label,
        reason: rec.reason,
        note:   rec.note
      });
    }

    // ---- step 2: sort & nest into output structure ----
    var years = [];

    var yearKeys = Object.keys(buckets).sort(function (a, b) { return +a - +b; });
    for (var yi = 0; yi < yearKeys.length; yi++) {
      var yearKey  = yearKeys[yi];
      var yearNum  = parseInt(yearKey, 10);
      var monthMap = buckets[yearKey];

      var months = [];
      var monthKeys = Object.keys(monthMap).sort(); // '2026-01', '2026-02', … — lexicographic = chronological
      for (var mi = 0; mi < monthKeys.length; mi++) {
        var monthKey = monthKeys[mi];
        var weekMap  = monthMap[monthKey];

        // month number from '2026-06' → 6
        var monthNum = parseInt(monthKey.split('-')[1], 10);

        var weeks = [];
        var weekKeys = Object.keys(weekMap).sort(); // '2026-W22', '2026-W23', …
        for (var wi = 0; wi < weekKeys.length; wi++) {
          var weekKey = weekKeys[wi];
          var days    = weekMap[weekKey];

          // sort days within a week chronologically
          days.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });

          weeks.push({
            weekKey: weekKey,
            days:    days
          });
        }

        months.push({
          month: monthNum,
          weeks: weeks
        });
      }

      years.push({
        year:   yearNum,
        months: months
      });
    }

    return years;
  }

  /* ==============================================
     High-level models — for renderer consumption
     ============================================== */

  /**
   * buildSingleHabitTreeModel(habit)
   *
   * @param  {Object} habit  single habit from localStorage
   * @return {Object}        { habitId, title, wish, years: […] }
   *
   * Title priority: goldenBehavior → entryAction → wish → '未命名习惯'
   */
  function buildSingleHabitTreeModel(habit) {
    if (!habit || typeof habit !== 'object') return null;

    var title = habit.goldenBehavior
             || habit.entryAction
             || habit.wish
             || '未命名习惯';

    var years = groupRecordsByYearMonthWeek(habit.records || []);

    return {
      habitId: habit.id || '',
      title:   title,
      wish:    habit.wish || '',
      years:   years
    };
  }

  /**
   * buildHabitTreeModel(habits)
   *
   * @param  {Array}  habits  raw habits array from localStorage
   * @return {Object}         { habits: […] }
   *
   * Each entry is the output of buildSingleHabitTreeModel().
   * Habits with no records still appear (with years: []).
   */
  function buildHabitTreeModel(habits) {
    if (!Array.isArray(habits)) return { habits: [] };

    var forest = [];
    for (var i = 0; i < habits.length; i++) {
      var node = buildSingleHabitTreeModel(habits[i]);
      if (node) forest.push(node);
    }

    return { habits: forest };
  }

  /* ==============================================
     Expose on window
     ============================================== */
  window.TreeGrowthModel = {
    // high-level
    buildHabitTreeModel:       buildHabitTreeModel,
    buildSingleHabitTreeModel: buildSingleHabitTreeModel,

    // grouping
    groupRecordsByYearMonthWeek: groupRecordsByYearMonthWeek,

    // date keys
    getYearKey:  getYearKey,
    getMonthKey: getMonthKey,
    getWeekKey:  getWeekKey,

    // record helpers
    getRecordVisualStatus: getRecordVisualStatus,
    normalizeRecord:       normalizeRecord,

    // constants (read-only)
    STATUS_MAP:      STATUS_MAP,
    VALID_STATUSES:  VALID_STATUSES
  };

})();
