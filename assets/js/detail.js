(function () {
  'use strict';

  var root = null;
  var habit = null;
  var showMissedReasons = false;

  var recordOptions = [
    {
      status: 'real',
      label: '完成真实行动',
      note: '这片绿叶留下来了。'
    },
    {
      status: 'entry',
      label: '完成入场动作',
      note: '第一步也会留下来。'
    },
    {
      status: 'downgrade',
      label: '今天先降级',
      note: '小芽也算今天的痕迹。'
    },
    {
      status: 'missed',
      label: '今天没有发生',
      note: '这也会留下来。'
    }
  ];

  var missedReasons = [
    '忘记了',
    '太累了',
    '时间不合适',
    '任务太大',
    '环境不支持',
    '突发事件',
    '情绪低落',
    '不想记录原因'
  ];

  function init() {
    root = document.getElementById('detail-root');
    if (!root || !window.AppState) return;

    habit = AppState.getSelectedHabit();
    if (!habit) {
      var habits = AppState.getHabits();
      if (habits.length) {
        habit = habits[0];
        AppState.setSelectedHabitId(habit.id);
      }
    }

    if (!habit) {
      renderEmptyState();
      return;
    }

    render();
  }

  function render() {
    root.innerHTML = '';
    root.appendChild(renderHeader());

    var layout = document.createElement('section');
    layout.className = 'detail-layout';
    layout.setAttribute('aria-label', '习惯枝桠详情');
    layout.appendChild(renderSummary());
    layout.appendChild(renderTimelinePanel());
    layout.appendChild(renderRecordCard());
    root.appendChild(layout);
  }

  function renderHeader() {
    var header = document.createElement('header');
    header.className = 'detail-header';

    var titleWrap = document.createElement('div');
    var kicker = document.createElement('span');
    kicker.className = 'detail-kicker';
    kicker.textContent = '习惯枝桠';

    var title = document.createElement('h1');
    title.className = 'detail-title';
    title.textContent = habit.wish || '一个容易发生的行为';

    titleWrap.appendChild(kicker);
    titleWrap.appendChild(title);

    var back = document.createElement('a');
    back.className = 'btn btn--secondary';
    back.href = 'index.html';
    back.textContent = '返回花园';

    header.appendChild(titleWrap);
    header.appendChild(back);
    return header;
  }

  function renderSummary() {
    var card = document.createElement('aside');
    card.className = 'card detail-card summary-card';
    card.setAttribute('aria-label', '当前方案');

    var title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = '当前方案';
    card.appendChild(title);

    appendPlanRow(card, '愿望', habit.wish || '还没写下');
    appendPlanRow(card, '黄金行为', habit.goldenBehavior || '还没选择');
    appendPlanRow(card, '入场动作', habit.entryAction || '先做第一步');
    appendPlanRow(card, '真实行动', habit.realAction || '轻一点开始');
    appendPlanRow(card, '自然提示句', habit.promptSentence || '当我……之后，我就……');

    var trial = document.createElement('span');
    trial.className = 'trial-pill';
    trial.textContent = getTrialStatus();
    card.appendChild(trial);

    var health = document.createElement('div');
    health.className = 'health-card';
    health.innerHTML = '<span class="health-card__label">方案健康度</span>' + getHealthTip();
    card.appendChild(health);

    return card;
  }

  function appendPlanRow(parent, label, value) {
    var row = document.createElement('div');
    row.className = 'plan-row';

    var labelEl = document.createElement('span');
    labelEl.className = 'plan-label';
    labelEl.textContent = label;

    var valueEl = document.createElement('div');
    valueEl.className = 'plan-value';
    valueEl.textContent = value;

    row.appendChild(labelEl);
    row.appendChild(valueEl);
    parent.appendChild(row);
  }

  function renderTimelinePanel() {
    var panel = document.createElement('section');
    panel.className = 'card detail-card branch-panel';
    panel.setAttribute('aria-label', '叶子时间轴');

    panel.appendChild(renderBranchVisual());

    var head = document.createElement('div');
    head.className = 'timeline-head';

    var title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = '叶子时间轴';

    var helper = document.createElement('p');
    helper.className = 'helper-text';
    helper.textContent = getTimelineHelper();

    head.appendChild(title);
    head.appendChild(helper);
    panel.appendChild(head);

    var timeline = document.createElement('div');
    timeline.className = 'leaf-timeline';

    var records = getRecords();
    if (!records.length) {
      var empty = document.createElement('div');
      empty.className = 'timeline-empty';
      empty.textContent = '今天可以先留下第一片叶子。';
      timeline.appendChild(empty);
    } else {
      records.slice().reverse().forEach(function (record) {
        timeline.appendChild(renderTimelineItem(record));
      });
    }

    panel.appendChild(timeline);
    return panel;
  }

  function renderBranchVisual() {
    var visual = document.createElement('div');
    visual.className = 'branch-visual';
    visual.setAttribute('aria-hidden', 'true');

    var line = document.createElement('div');
    line.className = 'branch-line branch-appear';
    visual.appendChild(line);

    var bud = document.createElement('div');
    bud.className = 'branch-bud';
    visual.appendChild(bud);

    var records = getRecords().slice(-8);
    if (!records.length) {
      var seed = document.createElement('span');
      seed.className = 'visual-leaf visual-leaf--entry leaf-grow';
      seed.style.left = '58%';
      seed.style.top = '46%';
      visual.appendChild(seed);
      return visual;
    }

    records.forEach(function (record, index) {
      var leaf = document.createElement('span');
      leaf.className = 'visual-leaf visual-leaf--' + record.status + ' leaf-grow';
      leaf.style.left = (22 + index * 8.3) + '%';
      leaf.style.top = (52 - (index % 3) * 12) + '%';
      leaf.style.animationDelay = (index * 0.06) + 's';
      visual.appendChild(leaf);
    });

    return visual;
  }

  function renderTimelineItem(record) {
    var item = document.createElement('div');
    item.className = 'timeline-item';

    var leaf = document.createElement('span');
    leaf.className = 'timeline-leaf timeline-leaf--' + record.status + ' leaf-grow';

    var body = document.createElement('div');
    var date = document.createElement('div');
    date.className = 'timeline-date';
    date.textContent = formatDate(record.date);

    var copy = document.createElement('div');
    copy.className = 'timeline-copy';
    copy.textContent = getRecordCopy(record);

    body.appendChild(date);
    body.appendChild(copy);
    item.appendChild(leaf);
    item.appendChild(body);

    return item;
  }

  function renderRecordCard() {
    var card = document.createElement('aside');
    card.className = 'card detail-card record-card';
    card.setAttribute('aria-label', '今日记录');

    var title = document.createElement('h2');
    title.className = 'record-card__title';
    title.textContent = '今天从这里开始。';
    card.appendChild(title);

    var helper = document.createElement('p');
    helper.className = 'record-card__helper';
    helper.textContent = getTodayRecord() ? '今天的痕迹可以改一改。' : '选一个最贴近今天的状态。';
    card.appendChild(helper);

    var options = document.createElement('div');
    options.className = 'record-options';

    recordOptions.forEach(function (option) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'record-option';
      button.innerHTML = '<span class="record-dot record-dot--' + option.status + '"></span><span>' + option.label + '</span>';
      button.addEventListener('click', function () {
        if (option.status === 'missed') {
          showMissedReasons = true;
          render();
          return;
        }
        saveRecord(option.status);
      });
      options.appendChild(button);
    });

    card.appendChild(options);
    card.appendChild(renderMissedPanel());

    var message = document.createElement('div');
    message.className = 'record-message';
    message.textContent = getRecordMessage();
    card.appendChild(message);

    return card;
  }

  function renderMissedPanel() {
    var panel = document.createElement('div');
    panel.className = 'missed-panel' + (showMissedReasons ? ' is-open' : '');

    var title = document.createElement('h3');
    title.className = 'missed-panel__title';
    title.textContent = '今天卡在哪里？';
    panel.appendChild(title);

    var options = document.createElement('div');
    options.className = 'reason-options';

    missedReasons.forEach(function (reason) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'reason-option';
      button.innerHTML = '<span class="record-dot record-dot--missed"></span><span>' + reason + '</span>';
      button.addEventListener('click', function () {
        saveRecord('missed', reason);
      });
      options.appendChild(button);
    });

    panel.appendChild(options);
    return panel;
  }

  function saveRecord(status, reason) {
    var option = getRecordOption(status);
    var record = {
      date: AppState.getTodayISO(),
      status: status,
      note: option.note
    };

    if (reason) {
      record.reason = reason;
      record.note = '这也会留下来。';
    }

    if (!Array.isArray(habit.records)) {
      habit.records = [];
      AppState.updateHabit(habit.id, { records: habit.records });
    }

    var updated = AppState.addRecord(habit.id, record);
    if (updated) {
      habit = updated;
      AppState.setSelectedHabitId(habit.id);
    }

    showMissedReasons = false;
    render();
  }

  function renderEmptyState() {
    root.innerHTML = '';
    var wrap = document.createElement('section');
    wrap.className = 'empty-detail fade-in';

    var card = document.createElement('div');
    card.className = 'card';

    var title = document.createElement('h1');
    title.textContent = '还没有枝桠。';

    var copy = document.createElement('p');
    copy.textContent = '先放下一个容易发生的行为。';

    var link = document.createElement('a');
    link.className = 'btn btn--primary';
    link.href = 'create.html';
    link.textContent = '去设计';

    card.appendChild(title);
    card.appendChild(copy);
    card.appendChild(link);
    wrap.appendChild(card);
    root.appendChild(wrap);
  }

  function getRecords() {
    return Array.isArray(habit.records) ? habit.records : [];
  }

  function getTodayRecord() {
    var today = AppState.getTodayISO();
    var records = getRecords();
    for (var i = 0; i < records.length; i += 1) {
      if (records[i].date === today) return records[i];
    }
    return null;
  }

  function getRecordOption(status) {
    for (var i = 0; i < recordOptions.length; i += 1) {
      if (recordOptions[i].status === status) return recordOptions[i];
    }
    return recordOptions[1];
  }

  function getRecordCopy(record) {
    var labelMap = {
      real: '完成真实行动',
      entry: '完成入场动作',
      downgrade: '今天先降级',
      missed: '今天没有发生'
    };
    var parts = [labelMap[record.status] || '留下痕迹'];
    if (record.reason) parts.push(record.reason);
    if (record.note) parts.push(record.note);
    return parts.join(' · ');
  }

  function getRecordMessage() {
    var today = getTodayRecord();
    if (!today) return '记录后，首页枝桠会长出今天的叶子。';
    if (today.status === 'missed') return '黄叶留下来了，明天可以调轻一点。';
    if (today.status === 'downgrade') return '小芽留下来了，今天先这样也可以。';
    return '这片叶子留下来了。';
  }

  function getTimelineHelper() {
    var count = getRecords().length;
    if (!count) return '还没有叶子';
    return count + ' 个痕迹';
  }

  function getTrialStatus() {
    var days = habit.trialDays || 3;
    var createdAt = habit.createdAt || AppState.getTodayISO();
    var current = Math.min(days, Math.max(1, daysBetween(createdAt, AppState.getTodayISO()) + 1));
    return '试运行第 ' + current + ' / ' + days + ' 天';
  }

  function getHealthTip() {
    var latest = getRecords().slice(-1)[0];
    if (!latest) return '先留下第一片叶子，再看哪里需要调轻。';
    if (latest.status === 'real') return '真实行动已经发生，可以保留现在的提示点。';
    if (latest.status === 'entry') return '入场动作能发生，下一步可以继续轻一点。';
    if (latest.status === 'downgrade') return '降级版本可用，说明动作还有调整空间。';
    return '黄叶也有用，明天可以换个更自然的提示点。';
  }

  function daysBetween(a, b) {
    var start = new Date(a + 'T00:00:00');
    var end = new Date(b + 'T00:00:00');
    var diff = end.getTime() - start.getTime();
    if (Number.isNaN(diff)) return 0;
    return Math.floor(diff / 86400000);
  }

  function formatDate(value) {
    if (!value) return '今天';
    var parts = value.split('-');
    if (parts.length !== 3) return value;
    return Number(parts[1]) + ' 月 ' + Number(parts[2]) + ' 日';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
