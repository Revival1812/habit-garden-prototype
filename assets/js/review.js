/* ========================================
   review.js — behavior diagnosis page
   ======================================== */

(function () {
  'use strict';

  /* ----- constants ----- */
  var STATUS_META = {
    real:       { status: 'real',       label: '完成',   cssClass: 'rhythm-day-cell--real' },
    entry:      { status: 'entry',      label: '入场',   cssClass: 'rhythm-day-cell--entry' },
    downgrade:  { status: 'downgrade',  label: '降级',   cssClass: 'rhythm-day-cell--downgrade' },
    missed:     { status: 'missed',     label: '未发生', cssClass: 'rhythm-day-cell--missed' },
    unrecorded: { status: 'unrecorded', label: '未记录', cssClass: 'rhythm-day-cell--unrecorded' }
  };

  var RANGE_OPTIONS = [
    { key: '7d',    label: '近 7 天' },
    { key: '30d',   label: '近 30 天' },
    { key: 'month', label: '本月' },
    { key: 'all',   label: '全部' }
  ];

  var WEEKDAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

  /* emotional / friction keywords for diagnosis */
  var MOTIVATION_LOW_WORDS = ['没心情', '不想', '烦', '情绪低落', '没动力', '不想动', '没状态'];
  var PROMPT_FAIL_WORDS = ['忘了', '忘记了', '没想起来', '没记住', '忘了时间'];

  /* ----- state ----- */
  var root = null;
  var currentHabitId = null;
  var currentRangeKey = '7d';
  var currentSelectedDate = null;

  /* ----- date helpers ----- */
  function pad2(v) { return String(v).padStart(2, '0'); }

  function toISODate(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function parseISODate(str) {
    var parts = String(str || '').split('-').map(Number);
    if (parts.length < 3 || parts.some(function (p) { return Number.isNaN(p); })) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function addDays(date, n) {
    var d = new Date(date.getTime());
    d.setDate(d.getDate() + n);
    return d;
  }

  function dateFromISO(str) {
    return parseISODate(str) || new Date();
  }

  /* ----- data access ----- */
  function getHabits() {
    if (window.AppState && typeof window.AppState.getHabits === 'function') {
      return window.AppState.getHabits();
    }
    return [];
  }

  function getTodayISO() {
    if (window.AppState && typeof window.AppState.getTodayISO === 'function') {
      return window.AppState.getTodayISO();
    }
    return toISODate(new Date());
  }

  function getSelectedHabitId() {
    try { return localStorage.getItem('habitGarden.selectedHabitId'); } catch (e) { return null; }
  }

  function setSelectedHabitId(id) {
    try { localStorage.setItem('habitGarden.selectedHabitId', id || ''); } catch (e) { /* noop */ }
  }

  function getHabitById(id) {
    var habits = getHabits();
    for (var i = 0; i < habits.length; i++) {
      if (habits[i].id === id) return habits[i];
    }
    return null;
  }

  function getRecordForDate(habit, dateISO) {
    if (window.RiverStageModel && typeof window.RiverStageModel.getRecordForDate === 'function') {
      return window.RiverStageModel.getRecordForDate(habit, dateISO);
    }
    if (!habit || !Array.isArray(habit.records)) return null;
    for (var i = 0; i < habit.records.length; i++) {
      if (habit.records[i] && habit.records[i].date === dateISO) return habit.records[i];
    }
    return null;
  }

  /* ===========================================
     1. getSelectedReviewHabit
     =========================================== */
  function getSelectedReviewHabit() {
    var habits = getHabits();
    if (!habits.length) return null;

    var id = getSelectedHabitId();
    if (id) {
      var h = getHabitById(id);
      if (h) return h;
    }
    return habits[0];
  }

  /* ===========================================
     2. getReviewRange
     =========================================== */
  function getReviewRange(rangeKey) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var dateTo = toISODate(today);
    var dateFrom;

    switch (rangeKey) {
      case '7d':
        dateFrom = toISODate(addDays(today, -6));
        break;
      case '30d':
        dateFrom = toISODate(addDays(today, -29));
        break;
      case 'month':
        dateFrom = today.getFullYear() + '-' + pad2(today.getMonth() + 1) + '-01';
        break;
      case 'all':
        dateFrom = null;  /* will be capped by earliest record or habit.createdAt */
        break;
      default:
        dateFrom = toISODate(addDays(today, -6));
        break;
    }

    return { dateFrom: dateFrom, dateTo: dateTo, rangeKey: rangeKey };
  }

  /* ===========================================
     3. getRecordsInRange
     =========================================== */
  function getRecordsInRange(habit, dateFrom, dateTo) {
    if (!habit || !Array.isArray(habit.records)) return [];
    return habit.records.filter(function (r) {
      if (!r || !r.date) return false;
      if (dateFrom && r.date < dateFrom) return false;
      if (dateTo && r.date > dateTo) return false;
      return true;
    });
  }

  /* ===========================================
     4. buildDailyReviewSeries
     =========================================== */
  function buildDailyReviewSeries(habit, range) {
    var rangeInfo = getReviewRange(range);
    var todayISO = getTodayISO();

    /* determine actual from date */
    var fromDate;
    if (rangeInfo.dateFrom) {
      fromDate = dateFromISO(rangeInfo.dateFrom);
    } else {
      /* "all" — use earliest of habit.createdAt or first record */
      var earliest = null;
      if (habit.createdAt) {
        var ca = parseISODate(habit.createdAt);
        if (ca) earliest = ca;
      }
      if (Array.isArray(habit.records)) {
        for (var i = 0; i < habit.records.length; i++) {
          var rd = parseISODate(habit.records[i] && habit.records[i].date);
          if (rd && (!earliest || rd < earliest)) earliest = rd;
        }
      }
      fromDate = earliest || new Date();
    }

    var toDate = dateFromISO(rangeInfo.dateTo);
    if (toDate < fromDate) {
      /* swap if needed */
      var tmp = fromDate;
      fromDate = toDate;
      toDate = tmp;
    }

    var series = [];
    var cursor = new Date(fromDate.getTime());
    while (cursor <= toDate) {
      var dateISO = toISODate(cursor);
      var dayOfWeek = cursor.getDay(); /* 0=Sun, 1=Mon ... */
      var record = getRecordForDate(habit, dateISO);
      var isToday = dateISO === todayISO;
      var isFuture = dateISO > todayISO;

      var dayData = {
        dateISO: dateISO,
        year: cursor.getFullYear(),
        month: cursor.getMonth() + 1,
        day: cursor.getDate(),
        dayOfWeek: dayOfWeek,
        status: record ? (record.status || 'entry') : (isFuture ? 'future' : 'unrecorded'),
        note: record && typeof record.note === 'string' ? record.note.trim() : '',
        reason: record && typeof record.reason === 'string' ? record.reason.trim() : '',
        isToday: isToday,
        isFuture: isFuture,
        record: record
      };

      /* merge reason into note if note is empty */
      if (!dayData.note && dayData.reason) {
        dayData.note = dayData.reason;
      }

      series.push(dayData);
      cursor.setDate(cursor.getDate() + 1);
    }

    return series;
  }

  /* ===========================================
     5. calculateReviewStats
     =========================================== */
  function calculateReviewStats(dailySeries) {
    var stats = {
      total: dailySeries.length,
      real: 0,
      entry: 0,
      downgrade: 0,
      missed: 0,
      unrecorded: 0,
      future: 0,
      traceDays: 0   /* real + entry + downgrade + missed = any record */
    };

    dailySeries.forEach(function (d) {
      if (d.isFuture) { stats.future += 1; return; }
      switch (d.status) {
        case 'real':       stats.real += 1;       stats.traceDays += 1; break;
        case 'entry':      stats.entry += 1;      stats.traceDays += 1; break;
        case 'downgrade':  stats.downgrade += 1;  stats.traceDays += 1; break;
        case 'missed':     stats.missed += 1;     stats.traceDays += 1; break;
        default:           stats.unrecorded += 1; break;
      }
    });

    return stats;
  }

  /* ===========================================
     6. diagnoseMAP
     =========================================== */
  function diagnoseMAP(habit, dailySeries, stats) {
    var recordedDays = stats.traceDays;
    var totalDays = stats.total - stats.future;
    var hasData = recordedDays > 0;

    /* collect notes/reasons from records */
    var allNotes = [];
    var missedNotes = [];
    dailySeries.forEach(function (d) {
      if (d.note) {
        allNotes.push(d.note);
        if (d.status === 'missed' || d.status === 'downgrade') {
          missedNotes.push(d.note);
        }
      }
    });

    /* ----- motivation ----- */
    var motivationDiagnosis = { observation: '', judgment: '', suggestion: '' };

    /* check for low-motivation keywords in notes */
    var lowMotivationHits = [];
    MOTIVATION_LOW_WORDS.forEach(function (word) {
      allNotes.forEach(function (note) {
        if (note.indexOf(word) !== -1) lowMotivationHits.push(word);
      });
    });

    if (!hasData && totalDays > 0) {
      motivationDiagnosis.observation = '这段时间内还没有留下任何记录。';
      motivationDiagnosis.judgment = '这件事可能还没有进入当前的生活节奏。';
      motivationDiagnosis.suggestion = '重新试运行 3 天，用一个更小的动作开始。';
    } else if (stats.missed > stats.real + stats.entry + stats.downgrade && lowMotivationHits.length > 0) {
      motivationDiagnosis.observation = '暂未发生的天数较多，并且记录中出现了一些和心情、状态有关的词。';
      motivationDiagnosis.judgment = '动机可能不太稳定——有些日子不太想做这件事。';
      motivationDiagnosis.suggestion = '把目标暂时调小，只保留最想要的原因。想想"为什么是现在"。';
    } else if (stats.real + stats.entry > stats.missed && hasData) {
      motivationDiagnosis.observation = '留下痕迹的天数多于暂未发生的天数。';
      motivationDiagnosis.judgment = '动机看起来还在，这件事对你仍然有意义。';
      motivationDiagnosis.suggestion = '先不要大改动机层面，重点放在动作大小和提示上。';
    } else if (hasData) {
      motivationDiagnosis.observation = '一些天发生了，一些天没有。';
      motivationDiagnosis.judgment = '动机可能在波动，但这是正常的。';
      motivationDiagnosis.suggestion = '可以先观察，不急着调整动机端。';
    } else {
      motivationDiagnosis.observation = '这段时间还没有记录。';
      motivationDiagnosis.judgment = '还没有足够的信息来判断动机状态。';
      motivationDiagnosis.suggestion = '先留下几天的记录，再回来看看。';
    }

    /* ----- ability ----- */
    var abilityDiagnosis = { observation: '', judgment: '', suggestion: '' };

    if (!hasData) {
      abilityDiagnosis.observation = '还没有记录可以观察。';
      abilityDiagnosis.judgment = '还看不出动作大小是否合适。';
      abilityDiagnosis.suggestion = '先试运行几天，再回头看看。';
    } else if (stats.downgrade > stats.real && stats.downgrade > 0) {
      abilityDiagnosis.observation = '降级完成的天数多于真实完成的天数。';
      abilityDiagnosis.judgment = '真实动作可能仍然偏重，降级版本更容易发生。';
      abilityDiagnosis.suggestion = '降低动作门槛——把真实动作再缩小一点，或者暂时把降级版本当作"今天的目标"。';
    } else if (stats.entry > stats.real && stats.real > 0) {
      abilityDiagnosis.observation = '入场动作经常完成，但走到真实动作的次数偏少。';
      abilityDiagnosis.judgment = '入场动作可以发生，但真实动作可能太大了。';
      abilityDiagnosis.suggestion = '把真实动作缩小，让它和入场动作的难度更接近。';
    } else if (stats.real >= stats.entry + stats.downgrade && stats.real >= 3) {
      abilityDiagnosis.observation = '真实完成的天数占了多数（' + stats.real + ' 天）。';
      abilityDiagnosis.judgment = '当前动作大小看起来基本合适。';
      abilityDiagnosis.suggestion = '先保留当前动作大小，继续观察。';
    } else if (stats.real >= stats.entry + stats.downgrade && stats.real > 0) {
      abilityDiagnosis.observation = '有 ' + stats.real + ' 天真实完成了，但记录还不多。';
      abilityDiagnosis.judgment = '动作大小可能合适，但还需要更多数据。';
      abilityDiagnosis.suggestion = '先保持当前动作大小，再观察一段时间。';
    } else if (stats.entry > 0 && stats.real === 0 && stats.downgrade === 0) {
      abilityDiagnosis.observation = '每次都只能完成入场动作，还没有走到真实动作。';
      abilityDiagnosis.judgment = '入场动作可以发生，但真实动作可能太大了。';
      abilityDiagnosis.suggestion = '把真实动作缩小，让它和入场动作的难度更接近。';
    } else if (stats.missed > stats.real + stats.entry + stats.downgrade) {
      abilityDiagnosis.observation = '暂未发生的天数多于留下的痕迹。';
      abilityDiagnosis.judgment = '动作门槛可能偏高，或者和当前生活节奏不匹配。';
      abilityDiagnosis.suggestion = '建议把动作调轻一点，或者换一个更自然的入场方式。';
    } else {
      abilityDiagnosis.observation = '各种状态比较分散。';
      abilityDiagnosis.judgment = '动作大小可能需要微调。';
      abilityDiagnosis.suggestion = '可以先观察，留意哪些天容易完成、哪些天卡住。';
    }

    /* ----- prompt ----- */
    var promptDiagnosis = { observation: '', judgment: '', suggestion: '' };

    /* check for prompt-failure words */
    var promptFailHits = [];
    PROMPT_FAIL_WORDS.forEach(function (word) {
      allNotes.forEach(function (note) {
        if (note.indexOf(word) !== -1) promptFailHits.push(word);
      });
    });

    if (!hasData && totalDays > 0) {
      promptDiagnosis.observation = '这段时间还没有记录。';
      promptDiagnosis.judgment = '提示可能没有被生活自动带出来。';
      promptDiagnosis.suggestion = '换一个更自然的提示点——放在一个你每天都会做的事情后面。';
    } else if (stats.unrecorded > stats.traceDays && totalDays > 7) {
      promptDiagnosis.observation = '未记录的天数较多。';
      promptDiagnosis.judgment = '提示可能没有被生活自动带出来，或者提示点不够明显。';
      promptDiagnosis.suggestion = '换一个更自然的提示点——放在一个你每天都会做的事情后面。';
    } else if (promptFailHits.length > 0) {
      promptDiagnosis.observation = '记录中出现"忘了"相关的词。';
      promptDiagnosis.judgment = '提示强度可能不够——在现有的提示点下，不容易想起来。';
      promptDiagnosis.suggestion = '增强提示或换提示点——选一个更容易被自动触发的时刻。';
    } else if (stats.real + stats.entry + stats.downgrade > 0 && stats.missed <= stats.real + stats.entry + stats.downgrade) {
      promptDiagnosis.observation = '多数有记录的天都发生了（完成、入场或降级）。';
      promptDiagnosis.judgment = '提示点可能比较稳定，能自然地触发行为。';
      promptDiagnosis.suggestion = '先保留当前提示点，继续观察。';
    } else if (hasData) {
      promptDiagnosis.observation = '有记录的天和没有记录的天都有。';
      promptDiagnosis.judgment = '提示点可能在某些日子有效，某些日子不太有效。';
      promptDiagnosis.suggestion = '留意哪些日子容易想起来，哪些日子容易忘记，再决定要不要换提示。';
    } else {
      promptDiagnosis.observation = '还没有记录可以观察。';
      promptDiagnosis.judgment = '还看不出提示是否有效。';
      promptDiagnosis.suggestion = '先记录几天，再回来看看提示是否稳定。';
    }

    return {
      motivation: motivationDiagnosis,
      ability: abilityDiagnosis,
      prompt: promptDiagnosis
    };
  }

  /* ===========================================
     7. extractPatternInsights
     =========================================== */
  function extractPatternInsights(habit, dailySeries, stats) {
    var hasData = stats.traceDays > 0;

    /* easiest status (most frequent non-unrecorded, non-missed) */
    var easiestStatus = '';
    var easiestLabel = '';
    if (stats.real >= stats.entry && stats.real >= stats.downgrade && stats.real > 0) {
      easiestStatus = 'real';
      easiestLabel = '真实完成';
    } else if (stats.entry >= stats.real && stats.entry >= stats.downgrade && stats.entry > 0) {
      easiestStatus = 'entry';
      easiestLabel = '入场动作';
    } else if (stats.downgrade > 0) {
      easiestStatus = 'downgrade';
      easiestLabel = '降级版本';
    }
    /* if only missed records exist, don't call it "easiest" — leave empty */

    /* common friction from missed/downgrade notes */
    var frictionWords = {};
    dailySeries.forEach(function (d) {
      if ((d.status === 'missed' || d.status === 'downgrade') && d.note) {
        /* simple word frequency — collect short phrases */
        var words = d.note.split(/[，。、,.\s]+/).filter(function (w) { return w.length >= 2; });
        words.forEach(function (w) {
          frictionWords[w] = (frictionWords[w] || 0) + 1;
        });
      }
    });
    var commonFriction = '';
    var maxFreq = 0;
    Object.keys(frictionWords).forEach(function (w) {
      if (frictionWords[w] > maxFreq) {
        maxFreq = frictionWords[w];
        commonFriction = w;
      }
    });

    /* effective prompt */
    var effectivePrompt = '';
    if (habit.promptSentence) {
      effectivePrompt = habit.promptSentence;
    } else if (habit.prompt) {
      effectivePrompt = habit.prompt;
    } else {
      effectivePrompt = '';
    }

    /* last record */
    var lastRecord = null;
    for (var i = dailySeries.length - 1; i >= 0; i--) {
      if (dailySeries[i].record) {
        lastRecord = dailySeries[i];
        break;
      }
    }
    var lastRecordText = '';
    if (lastRecord) {
      var meta = STATUS_META[lastRecord.status] || STATUS_META.entry;
      lastRecordText = lastRecord.dateISO + ' · ' + meta.label;
      if (lastRecord.note) {
        lastRecordText += ' — ' + (lastRecord.note.length > 40 ? lastRecord.note.slice(0, 40) + '…' : lastRecord.note);
      }
    }

    return {
      hasData: hasData,
      easiestStatus: easiestStatus,
      easiestLabel: easiestLabel,
      commonFriction: commonFriction || '',
      effectivePrompt: effectivePrompt,
      lastRecordText: lastRecordText
    };
  }

  /* ===========================================
     8. buildNextStepSuggestions
     =========================================== */
  function buildNextStepSuggestions(habit, dailySeries, stats, diagnosis) {
    var suggestions = [];
    var hasData = stats.traceDays > 0;
    var totalDays = stats.total - stats.future;

    /* collect all notes from dailySeries */
    var allNotes = [];
    dailySeries.forEach(function (d) {
      if (d.note) allNotes.push(d.note);
    });

    /* suggestion: keep */
    if (hasData && stats.real >= stats.missed && stats.real + stats.entry > stats.downgrade) {
      suggestions.push({
        key: 'keep',
        title: '保留当前方案',
        reason: '提示和动作看起来能发生，可以先继续观察。',
        primary: true
      });
    }

    /* suggestion: lower */
    if (stats.downgrade > stats.real || stats.entry > stats.real + 2 || stats.missed > stats.real + stats.entry + stats.downgrade) {
      suggestions.push({
        key: 'lower',
        title: '降低动作门槛',
        reason: stats.downgrade > stats.real
          ? '降级版本更常发生，把真实动作调轻一点会更自然。'
          : '动作门槛可能偏高，先调轻一步试试看。',
        primary: !suggestions.length
      });
    }

    /* suggestion: change prompt */
    var promptFail = false;
    PROMPT_FAIL_WORDS.forEach(function (word) {
      allNotes.forEach(function (note) {
        if (note.indexOf(word) !== -1) promptFail = true;
      });
    });

    if (stats.unrecorded > stats.traceDays && totalDays > 7) {
      suggestions.push({
        key: 'prompt',
        title: '换提示点',
        reason: '未记录的天数较多，现在的提示可能没有被生活带出来。放到一个更自然的时刻后面试试。',
        primary: !suggestions.length
      });
    } else if (promptFail) {
      suggestions.push({
        key: 'prompt',
        title: '换提示点',
        reason: '记录中提到"忘了"，提示强度可能不够。换一个更容易自动触发的时刻。',
        primary: !suggestions.length
      });
    }

    /* suggestion: retrial */
    if (!hasData || (stats.traceDays <= 2 && totalDays >= 7)) {
      suggestions.push({
        key: 'retrial',
        title: '重新试运行 3 天',
        reason: !hasData
          ? '还没有足够的数据来判断。用一个小动作先试 3 天看看。'
          : '记录还不多，再试运行 3 天观察一下。',
        primary: !suggestions.length
      });
    }

    /* ensure at least one suggestion */
    if (!suggestions.length) {
      suggestions.push({
        key: 'keep',
        title: '保留当前方案',
        reason: '数据显示当前方案基本合适，先保持观察。',
        primary: true
      });
    }

    /* limit to 3 */
    return suggestions.slice(0, 3);
  }

  /* ===========================================
     9. RENDER — main entry
     =========================================== */
  function init() {
    root = document.getElementById('review-root');
    if (!root) return;

    /* seed demo data if needed */
    if (window.AppState && typeof window.AppState.seedDemoDataIfEmpty === 'function') {
      window.AppState.seedDemoDataIfEmpty();
    }

    var habits = getHabits();
    if (!habits.length) {
      renderEmptyState('no-habits');
      return;
    }

    var habit = getSelectedReviewHabit();
    if (!habit) {
      renderEmptyState('no-habits');
      return;
    }

    currentHabitId = habit.id;
    setSelectedHabitId(habit.id);

    renderPage();
  }

  function renderPage() {
    var habit = getHabitById(currentHabitId);
    if (!habit) {
      renderEmptyState('no-habits');
      return;
    }

    var habits = getHabits();
    var dailySeries = buildDailyReviewSeries(habit, currentRangeKey);
    var stats = calculateReviewStats(dailySeries);
    var diagnosis = diagnoseMAP(habit, dailySeries, stats);
    var patterns = extractPatternInsights(habit, dailySeries, stats);
    var suggestions = buildNextStepSuggestions(habit, dailySeries, stats, diagnosis);

    root.innerHTML = '';

    root.appendChild(renderHeader(habit, habits));
    root.appendChild(renderControls(habit, habits));
    root.appendChild(renderOverviewCards(stats));
    root.appendChild(renderBehaviorRhythm(dailySeries));
    root.appendChild(renderMAPDiagnosis(habit, dailySeries, stats, diagnosis));
    root.appendChild(renderLowerSection(habit, dailySeries, stats, patterns, suggestions));
  }

  /* ===========================================
     RENDER: Header
     =========================================== */
  function renderHeader(habit, habits) {
    var header = document.createElement('header');
    header.className = 'review-head';

    var left = document.createElement('div');
    left.className = 'review-head__left';

    var kicker = document.createElement('span');
    kicker.className = 'review-kicker';
    kicker.textContent = '行为诊断';

    var title = document.createElement('h1');
    title.className = 'review-title';
    title.textContent = '这段时间，它是怎么流动的？';

    var sub = document.createElement('p');
    sub.className = 'review-subtitle';
    sub.textContent = '先看见发生的痕迹，再决定要不要调轻一点。';

    left.appendChild(kicker);
    left.appendChild(title);
    left.appendChild(sub);

    var back = document.createElement('a');
    back.className = 'btn btn--secondary';
    back.href = 'index.html';
    back.textContent = '返回花园';

    header.appendChild(left);
    header.appendChild(back);
    return header;
  }

  /* ===========================================
     RENDER: Controls (habit select + range chips)
     =========================================== */
  function renderControls(habit, habits) {
    var bar = document.createElement('div');
    bar.className = 'review-controls';

    /* habit select */
    var groupLeft = document.createElement('div');
    groupLeft.className = 'review-controls__group';

    var habitLabel = document.createElement('span');
    habitLabel.className = 'review-controls__label';
    habitLabel.textContent = '复盘习惯：';

    var select = document.createElement('select');
    select.className = 'review-habit-select';
    select.setAttribute('aria-label', '选择要复盘的习惯');

    habits.forEach(function (h) {
      var opt = document.createElement('option');
      opt.value = h.id;
      opt.textContent = h.wish || h.goldenBehavior || h.id;
      if (h.id === currentHabitId) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener('change', function () {
      currentHabitId = select.value;
      setSelectedHabitId(currentHabitId);
      currentSelectedDate = null;
      renderPage();
    });

    groupLeft.appendChild(habitLabel);
    groupLeft.appendChild(select);

    /* range chips */
    var groupRight = document.createElement('div');
    groupRight.className = 'review-controls__group';

    var rangeLabel = document.createElement('span');
    rangeLabel.className = 'review-controls__label';
    rangeLabel.textContent = '时间范围：';

    var chipRow = document.createElement('div');
    chipRow.className = 'review-range-chips';

    RANGE_OPTIONS.forEach(function (opt) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'review-range-chip' + (opt.key === currentRangeKey ? ' is-active' : '');
      chip.textContent = opt.label;
      chip.addEventListener('click', function () {
        currentRangeKey = opt.key;
        currentSelectedDate = null;
        renderPage();
      });
      chipRow.appendChild(chip);
    });

    groupRight.appendChild(rangeLabel);
    groupRight.appendChild(chipRow);

    bar.appendChild(groupLeft);
    bar.appendChild(groupRight);
    return bar;
  }

  /* ===========================================
     RENDER: Overview Cards (5)
     =========================================== */
  function renderOverviewCards(stats) {
    var section = document.createElement('section');
    section.className = 'review-overview';
    section.setAttribute('aria-label', '概览统计');

    var cards = [
      {
        key: 'trace',
        count: stats.traceDays,
        label: '留下痕迹',
        hint: '这段时间它有被看见。',
        cssMod: 'overview-card__count--trace'
      },
      {
        key: 'real',
        count: stats.real,
        label: '真实完成',
        hint: '走到了真实动作的日子。',
        cssMod: 'overview-card__count--real'
      },
      {
        key: 'entry',
        count: stats.entry + stats.downgrade,
        label: '进入现场',
        hint: '有些日子只是完成了第一步。',
        cssMod: 'overview-card__count--entry'
      },
      {
        key: 'missed',
        count: stats.missed,
        label: '暂未发生',
        hint: '它没有发生，也会留下来。',
        cssMod: 'overview-card__count--missed'
      },
      {
        key: 'unrecorded',
        count: stats.unrecorded,
        label: '未记录',
        hint: '还没有留下痕迹的日子。',
        cssMod: 'overview-card__count--unrecorded'
      }
    ];

    cards.forEach(function (c) {
      var card = document.createElement('div');
      card.className = 'overview-card';

      var count = document.createElement('div');
      count.className = 'overview-card__count ' + c.cssMod;
      count.textContent = String(c.count);

      var label = document.createElement('div');
      label.className = 'overview-card__label';
      label.textContent = c.label;

      var hint = document.createElement('div');
      hint.className = 'overview-card__hint';
      hint.textContent = c.hint;

      card.appendChild(count);
      card.appendChild(label);
      card.appendChild(hint);
      section.appendChild(card);
    });

    return section;
  }

  /* ===========================================
     RENDER: Behavior Rhythm
     =========================================== */
  function renderBehaviorRhythm(dailySeries) {
    var section = document.createElement('section');
    section.className = 'review-rhythm';
    section.setAttribute('aria-label', '发生节奏');

    var card = document.createElement('div');
    card.className = 'card rhythm-card';

    /* header */
    var header = document.createElement('div');
    header.className = 'rhythm-card__header';

    var titleWrap = document.createElement('div');
    var title = document.createElement('h2');
    title.className = 'rhythm-card__title';
    title.textContent = '发生节奏';
    var sub = document.createElement('span');
    sub.className = 'rhythm-card__sub';
    sub.textContent = '不是看连续，而是看它通常在哪里出现。';

    titleWrap.appendChild(title);
    titleWrap.appendChild(sub);

    /* legend */
    var legend = document.createElement('div');
    legend.className = 'rhythm-card__legend';

    var legendItems = [
      { cls: 'rhythm-day-cell--real',      label: '完成' },
      { cls: 'rhythm-day-cell--entry',     label: '入场' },
      { cls: 'rhythm-day-cell--downgrade', label: '降级' },
      { cls: 'rhythm-day-cell--missed',    label: '未发生' },
      { cls: 'rhythm-day-cell--unrecorded', label: '未记录' }
    ];

    legendItems.forEach(function (li) {
      var item = document.createElement('span');
      item.className = 'rhythm-card__legend-item';
      var swatch = document.createElement('span');
      swatch.className = 'rhythm-card__legend-swatch ' + li.cls;
      item.appendChild(swatch);
      item.appendChild(document.createTextNode(li.label));
      legend.appendChild(item);
    });

    header.appendChild(titleWrap);
    header.appendChild(legend);

    /* grid */
    var grid = document.createElement('div');
    grid.className = 'rhythm-grid';

    /* weekday headers */
    WEEKDAY_LABELS.forEach(function (label) {
      var hdr = document.createElement('div');
      hdr.className = 'rhythm-day-header';
      hdr.textContent = label;
      grid.appendChild(hdr);
    });

    /* fill leading empty cells so first day aligns with its weekday */
    var firstDayOfWeek = dailySeries.length > 0 ? dailySeries[0].dayOfWeek : 1;
    /* dayOfWeek: 0=Sun ... 6=Sat. We want Mon=0, Tue=1 ... Sun=6 */
    var monBasedDow = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    for (var pad = 0; pad < monBasedDow; pad++) {
      var spacer = document.createElement('div');
      spacer.className = 'rhythm-day-cell';
      spacer.style.visibility = 'hidden';
      grid.appendChild(spacer);
    }

    var todayISO = getTodayISO();

    dailySeries.forEach(function (d) {
      if (d.isFuture) {
        var futureCell = document.createElement('div');
        futureCell.className = 'rhythm-day-cell rhythm-day-cell--future';
        futureCell.textContent = String(d.day);
        futureCell.title = d.dateISO + ' · 未到';
        grid.appendChild(futureCell);
        return;
      }

      var cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'rhythm-day-cell ' + (STATUS_META[d.status] ? STATUS_META[d.status].cssClass : 'rhythm-day-cell--unrecorded');
      if (d.isToday) cell.classList.add('is-today');
      if (currentSelectedDate === d.dateISO) cell.classList.add('is-selected');
      cell.textContent = String(d.day);
      cell.setAttribute('aria-label', d.dateISO + '，' + (STATUS_META[d.status] ? STATUS_META[d.status].label : '未记录'));

      var tooltipText = d.dateISO + ' · ' + (STATUS_META[d.status] ? STATUS_META[d.status].label : '未记录');
      if (d.note) tooltipText += ' — ' + d.note;
      cell.title = tooltipText;

      cell.addEventListener('click', function () {
        currentSelectedDate = d.dateISO;
        renderDayDetail(d);
        /* update selected state */
        grid.querySelectorAll('.rhythm-day-cell.is-selected').forEach(function (c) {
          c.classList.remove('is-selected');
        });
        cell.classList.add('is-selected');
      });

      grid.appendChild(cell);
    });

    card.appendChild(header);
    card.appendChild(grid);

    /* day detail area */
    var detailArea = document.createElement('div');
    detailArea.className = 'rhythm-day-detail';
    detailArea.id = 'rhythm-day-detail';
    detailArea.setAttribute('aria-live', 'polite');

    /* show placeholder */
    var placeholder = document.createElement('span');
    placeholder.className = 'rhythm-day-detail__placeholder';
    placeholder.textContent = '点选上面的一天，看看它留下了什么。';
    detailArea.appendChild(placeholder);

    card.appendChild(detailArea);
    section.appendChild(card);

    /* if a day was previously selected, restore it */
    if (currentSelectedDate) {
      var selDay = null;
      for (var i = 0; i < dailySeries.length; i++) {
        if (dailySeries[i].dateISO === currentSelectedDate) { selDay = dailySeries[i]; break; }
      }
      if (selDay) {
        renderDayDetail(selDay);
      }
    }

    return section;
  }

  function renderDayDetail(dayData) {
    var container = document.getElementById('rhythm-day-detail');
    if (!container) return;

    container.innerHTML = '';

    var dateEl = document.createElement('span');
    dateEl.className = 'rhythm-day-detail__date';
    dateEl.textContent = dayData.dateISO;

    var meta = STATUS_META[dayData.status] || STATUS_META.unrecorded;
    var statusEl = document.createElement('span');
    statusEl.className = 'rhythm-day-detail__status rhythm-day-detail__status--' + (dayData.status || 'unrecorded');
    statusEl.textContent = meta.label;

    container.appendChild(dateEl);
    container.appendChild(statusEl);

    if (dayData.note) {
      var noteEl = document.createElement('span');
      noteEl.className = 'rhythm-day-detail__note';
      noteEl.textContent = dayData.note;
      container.appendChild(noteEl);
    }
    /* note 为空时不显示 note 区块 —— 符合要求 */
  }

  /* ===========================================
     RENDER: MAP Diagnosis
     =========================================== */
  function renderMAPDiagnosis(habit, dailySeries, stats, diagnosis) {
    var section = document.createElement('section');
    section.className = 'review-map';
    section.setAttribute('aria-label', 'MAP 诊断');

    var mapCards = [
      {
        key: 'motivation',
        title: '动机',
        icon: '想',
        iconClass: 'map-card__icon--motivation',
        diag: diagnosis.motivation
      },
      {
        key: 'ability',
        title: '能力',
        icon: '做',
        iconClass: 'map-card__icon--ability',
        diag: diagnosis.ability
      },
      {
        key: 'prompt',
        title: '提示',
        icon: '记',
        iconClass: 'map-card__icon--prompt',
        diag: diagnosis.prompt
      }
    ];

    mapCards.forEach(function (mc) {
      section.appendChild(renderOneMAPCard(mc));
    });

    return section;
  }

  function renderOneMAPCard(mc) {
    var card = document.createElement('article');
    card.className = 'card map-card';

    /* header row */
    var header = document.createElement('div');
    header.className = 'map-card__header';

    var icon = document.createElement('span');
    icon.className = 'map-card__icon ' + mc.iconClass;
    icon.textContent = mc.icon;
    icon.setAttribute('aria-hidden', 'true');

    var label = document.createElement('span');
    label.className = 'map-card__label';
    label.textContent = 'MAP';

    var title = document.createElement('h3');
    title.className = 'map-card__title';
    title.textContent = mc.title;

    header.appendChild(icon);
    header.appendChild(label);

    var titleRow = document.createElement('div');
    titleRow.appendChild(title);

    card.appendChild(header);
    card.appendChild(titleRow);

    /* observation */
    var obsLabel = document.createElement('div');
    obsLabel.className = 'map-card__section-label map-card__section-label--first';
    obsLabel.textContent = '观察';
    card.appendChild(obsLabel);

    var obsText = document.createElement('p');
    obsText.className = 'map-card__text';
    obsText.textContent = mc.diag.observation;
    card.appendChild(obsText);

    /* judgment */
    var judLabel = document.createElement('div');
    judLabel.className = 'map-card__section-label';
    judLabel.textContent = '判断';
    card.appendChild(judLabel);

    var judText = document.createElement('p');
    judText.className = 'map-card__text map-card__text--strong';
    judText.textContent = mc.diag.judgment;
    card.appendChild(judText);

    /* suggestion */
    var sugLabel = document.createElement('div');
    sugLabel.className = 'map-card__section-label';
    sugLabel.textContent = '可以怎么调';
    card.appendChild(sugLabel);

    var sugText = document.createElement('p');
    sugText.className = 'map-card__text';
    sugText.textContent = mc.diag.suggestion;
    card.appendChild(sugText);

    return card;
  }

  /* ===========================================
     RENDER: Lower Section (Patterns + Suggestions)
     =========================================== */
  function renderLowerSection(habit, dailySeries, stats, patterns, suggestions) {
    var section = document.createElement('section');
    section.className = 'review-lower';

    section.appendChild(renderPatternCard(patterns, stats));
    section.appendChild(renderSuggestionCard(suggestions, habit));

    return section;
  }

  /* pattern observation */
  function renderPatternCard(patterns, stats) {
    var card = document.createElement('article');
    card.className = 'card pattern-card';

    var label = document.createElement('span');
    label.className = 'pattern-card__label';
    label.textContent = '发生模式观察';

    var title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = '最近的发生方式';

    card.appendChild(label);
    card.appendChild(title);

    if (!patterns.hasData) {
      var noData = document.createElement('p');
      noData.className = 'module-no-data';
      noData.textContent = '记录还不多，先让它多流动几天。';
      card.appendChild(noData);
      return card;
    }

    var list = document.createElement('div');
    list.className = 'pattern-list';

    /* easiest status */
    appendPatternRow(list, '最容易发生的状态',
      patterns.easiestLabel || '还不明显');

    /* common friction */
    appendPatternRow(list, '常见卡点',
      patterns.commonFriction || '还不明显');

    /* effective prompt */
    appendPatternRow(list, '最有效提示',
      patterns.effectivePrompt || '还在观察');

    /* last record */
    appendPatternRow(list, '最近一次留下记录',
      patterns.lastRecordText || '还没有记录');

    card.appendChild(list);
    return card;
  }

  function appendPatternRow(parent, key, value) {
    var row = document.createElement('div');
    row.className = 'pattern-row';

    var keyEl = document.createElement('div');
    keyEl.className = 'pattern-key';
    keyEl.textContent = key;

    var valueEl = document.createElement('div');
    valueEl.className = 'pattern-value' + (!value || value === '还不明显' || value === '还在观察' || value === '还没有记录' ? ' pattern-value--muted' : '');
    valueEl.textContent = value || '还不明显';

    row.appendChild(keyEl);
    row.appendChild(valueEl);
    parent.appendChild(row);
  }

  /* next-step suggestions */
  function renderSuggestionCard(suggestions, habit) {
    var card = document.createElement('article');
    card.className = 'card suggestions-card';

    var label = document.createElement('span');
    label.className = 'suggestions-card__label';
    label.textContent = '下一步建议';

    var title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = '先调一处';

    card.appendChild(label);
    card.appendChild(title);

    var list = document.createElement('div');
    list.className = 'suggestions-list';

    suggestions.forEach(function (s) {
      var item = document.createElement('div');
      item.className = 'suggestion-item' + (s.primary ? ' is-primary' : '');

      var itemTitle = document.createElement('div');
      itemTitle.className = 'suggestion-item__title';
      itemTitle.textContent = s.title;

      var itemReason = document.createElement('div');
      itemReason.className = 'suggestion-item__reason';
      itemReason.textContent = s.reason;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn--primary';

      if (s.key === 'keep') {
        btn.textContent = '保留这个节奏';
        btn.addEventListener('click', function () {
          showGentleToast('好的，先保持观察。');
        });
      } else if (s.key === 'lower') {
        btn.textContent = '把动作调轻一点';
        btn.addEventListener('click', function () {
          /* save current habitId and navigate to create.html */
          setSelectedHabitId(currentHabitId);
          window.location.href = 'create.html';
        });
      } else if (s.key === 'prompt') {
        btn.textContent = '换一个提示点';
        btn.addEventListener('click', function () {
          setSelectedHabitId(currentHabitId);
          window.location.href = 'create.html';
        });
      } else if (s.key === 'retrial') {
        btn.textContent = '重新试运行 3 天';
        btn.addEventListener('click', function () {
          setSelectedHabitId(currentHabitId);
          window.location.href = 'create.html';
        });
      }

      item.appendChild(itemTitle);
      item.appendChild(itemReason);
      item.appendChild(btn);
      list.appendChild(item);
    });

    card.appendChild(list);
    return card;
  }

  /* gentle toast */
  function showGentleToast(message) {
    var existing = document.querySelector('.review-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'review-toast';
    toast.textContent = message;
    toast.style.cssText = [
      'position: fixed',
      'bottom: 32px',
      'left: 50%',
      'transform: translateX(-50%)',
      'padding: 10px 24px',
      'border-radius: 999px',
      'background: var(--color-primary-light)',
      'color: var(--color-primary-dark)',
      'font-size: 14px',
      'box-shadow: var(--shadow-soft)',
      'z-index: 1000',
      'animation: fadeIn 0.28s ease both',
      'pointer-events: none'
    ].join(';');

    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(function () { toast.remove(); }, 400);
    }, 2200);
  }

  /* ===========================================
     RENDER: Empty State
     =========================================== */
  function renderEmptyState(type) {
    root.innerHTML = '';

    var wrap = document.createElement('section');
    wrap.className = 'review-empty fade-in';

    var card = document.createElement('div');
    card.className = 'card';

    if (type === 'no-habits') {
      var title = document.createElement('h1');
      title.textContent = '还没有习惯可以复盘。';

      var copy = document.createElement('p');
      copy.textContent = '先设计一个小习惯，把它放到河流里，再回来看看它是怎么流动的。';

      var link = document.createElement('a');
      link.className = 'btn btn--primary';
      link.href = 'create.html';
      link.textContent = '设计一个小习惯';

      card.appendChild(title);
      card.appendChild(copy);
      card.appendChild(link);
    } else {
      var t = document.createElement('h1');
      t.textContent = '记录还不多，先让它多流动几天。';

      var c = document.createElement('p');
      c.textContent = '先留下几天的痕迹，再回来看看发生方式。';

      var l = document.createElement('a');
      l.className = 'btn btn--primary';
      l.href = 'index.html';
      l.textContent = '返回花园';

      card.appendChild(t);
      card.appendChild(c);
      card.appendChild(l);
    }

    wrap.appendChild(card);
    root.appendChild(wrap);
  }

  /* ----- boot ----- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
