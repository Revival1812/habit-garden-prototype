(function () {
  'use strict';

  var root = null;

  function init() {
    root = document.getElementById('review-root');
    if (!root || !window.AppState) return;

    var habits = AppState.getHabits();
    var analysis = analyzeHabits(habits);

    if (!analysis.records.length) {
      renderEmptyState();
      return;
    }

    renderReview(analysis);
  }

  function analyzeHabits(habits) {
    var records = [];
    var statusCount = {};
    var reasonCount = {};
    var promptCount = {};
    var helpfulPromptCount = {};
    var reasonHabits = 0;
    var microTypes = {};

    habits.forEach(function (habit) {
      if (habit.reason) reasonHabits += 1;
      if (habit.microHabitType) {
        microTypes[habit.microHabitType] = (microTypes[habit.microHabitType] || 0) + 1;
      }

      var habitRecords = Array.isArray(habit.records) ? habit.records : [];
      habitRecords.forEach(function (record) {
        var item = {
          habit: habit,
          status: record.status || 'entry',
          date: record.date || '',
          reason: record.reason || ''
        };
        records.push(item);

        statusCount[item.status] = (statusCount[item.status] || 0) + 1;

        if (item.reason) {
          reasonCount[item.reason] = (reasonCount[item.reason] || 0) + 1;
        }

        if (habit.prompt) {
          promptCount[habit.prompt] = (promptCount[habit.prompt] || 0) + 1;
          if (item.status !== 'missed') {
            helpfulPromptCount[habit.prompt] = (helpfulPromptCount[habit.prompt] || 0) + 1;
          }
        }
      });
    });

    return {
      habits: habits,
      records: records,
      statusCount: statusCount,
      reasonCount: reasonCount,
      promptCount: promptCount,
      helpfulPromptCount: helpfulPromptCount,
      reasonHabits: reasonHabits,
      microTypes: microTypes
    };
  }

  function renderReview(analysis) {
    root.innerHTML = '';
    root.appendChild(renderHeader());

    var mapGrid = document.createElement('section');
    mapGrid.className = 'review-grid';
    mapGrid.setAttribute('aria-label', 'MAP 观察');
    mapGrid.appendChild(renderMapCard('动机', getMotivationCopy(analysis)));
    mapGrid.appendChild(renderMapCard('能力', getAbilityCopy(analysis)));
    mapGrid.appendChild(renderMapCard('提示', getPromptCopy(analysis)));
    root.appendChild(mapGrid);

    var lower = document.createElement('section');
    lower.className = 'review-lower';
    lower.appendChild(renderPatternCard(analysis));
    lower.appendChild(renderSuggestionCard(analysis));
    root.appendChild(lower);
  }

  function renderHeader() {
    var header = document.createElement('header');
    header.className = 'review-head';

    var titleWrap = document.createElement('div');
    var kicker = document.createElement('span');
    kicker.className = 'review-kicker';
    kicker.textContent = '成长复盘';

    var title = document.createElement('h1');
    title.className = 'review-title';
    title.textContent = '看看它是怎么发生的。';

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

  function renderMapCard(title, copy) {
    var card = document.createElement('article');
    card.className = 'card review-card map-card';

    var label = document.createElement('span');
    label.className = 'map-card__label';
    label.textContent = 'MAP';

    var heading = document.createElement('h2');
    heading.className = 'map-card__title';
    heading.textContent = title;

    var text = document.createElement('p');
    text.className = 'map-card__copy';
    text.textContent = copy;

    card.appendChild(label);
    card.appendChild(heading);
    card.appendChild(text);
    return card;
  }

  function renderPatternCard(analysis) {
    var card = document.createElement('article');
    card.className = 'card review-card pattern-card';

    var label = document.createElement('span');
    label.className = 'pattern-card__label';
    label.textContent = '模式观察';

    var title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = '最近的发生方式';

    var list = document.createElement('div');
    list.className = 'pattern-list';
    appendPatternRow(list, '最容易发生的时间', getEasiestTime(analysis));
    appendPatternRow(list, '常见阻力', getCommonFriction(analysis));
    appendPatternRow(list, '最有效提示', getBestPrompt(analysis));

    card.appendChild(label);
    card.appendChild(title);
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
    valueEl.className = 'pattern-value';
    valueEl.textContent = value;

    row.appendChild(keyEl);
    row.appendChild(valueEl);
    parent.appendChild(row);
  }

  function renderSuggestionCard(analysis) {
    var active = getSuggestionKey(analysis);
    var card = document.createElement('article');
    card.className = 'card review-card';

    var label = document.createElement('span');
    label.className = 'pattern-card__label';
    label.textContent = '下一步建议';

    var title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = '先调一处';

    var list = document.createElement('div');
    list.className = 'suggestions';

    [
      {
        key: 'lower',
        title: '降低动作门槛',
        copy: '把真实行动再调轻一点。'
      },
      {
        key: 'prompt',
        title: '换提示点',
        copy: '放到更自然的时刻后面。'
      },
      {
        key: 'keep',
        title: '保留当前方案',
        copy: '提示和动作已经能发生。'
      }
    ].forEach(function (item) {
      list.appendChild(renderSuggestion(item, item.key === active));
    });

    card.appendChild(label);
    card.appendChild(title);
    card.appendChild(list);
    return card;
  }

  function renderSuggestion(item, active) {
    var row = document.createElement('div');
    row.className = 'suggestion' + (active ? ' is-active' : '');

    var title = document.createElement('div');
    title.className = 'suggestion__title';
    title.textContent = item.title;

    var copy = document.createElement('div');
    copy.className = 'suggestion__copy';
    copy.textContent = item.copy;

    row.appendChild(title);
    row.appendChild(copy);
    return row;
  }

  function renderEmptyState() {
    root.innerHTML = '';

    var wrap = document.createElement('section');
    wrap.className = 'empty-review fade-in';

    var card = document.createElement('div');
    card.className = 'card';

    var title = document.createElement('h1');
    title.textContent = '看看它是怎么发生的。';

    var copy = document.createElement('p');
    copy.textContent = '先留下几片叶子，再回来看看。';

    var link = document.createElement('a');
    link.className = 'btn btn--primary';
    link.href = 'index.html';
    link.textContent = '返回花园';

    card.appendChild(title);
    card.appendChild(copy);
    card.appendChild(link);
    wrap.appendChild(card);
    root.appendChild(wrap);
  }

  function getMotivationCopy(analysis) {
    if (analysis.reasonHabits > 0) {
      return '有明确原因时，更容易开始。';
    }
    return '愿望已经放下，原因还可以再轻轻补上。';
  }

  function getAbilityCopy(analysis) {
    var entryLike = (analysis.statusCount.entry || 0) + (analysis.statusCount.downgrade || 0);
    var real = analysis.statusCount.real || 0;
    var missed = analysis.statusCount.missed || 0;

    if (missed > real + entryLike) {
      return '动作门槛可能偏高。';
    }
    if (entryLike > real) {
      return '入场动作正在帮你开始。';
    }
    return '动作轻一点时，它更容易发生。';
  }

  function getPromptCopy(analysis) {
    var prompt = getBestPrompt(analysis);
    if (prompt !== '还在观察') {
      return prompt + ' 比较稳定。';
    }
    return '提示点还可以继续观察。';
  }

  function getEasiestTime(analysis) {
    return topKey(analysis.helpfulPromptCount) || topKey(analysis.promptCount) || '还在观察';
  }

  function getCommonFriction(analysis) {
    return topKey(analysis.reasonCount) || '还不明显';
  }

  function getBestPrompt(analysis) {
    return topKey(analysis.helpfulPromptCount) || '还在观察';
  }

  function getSuggestionKey(analysis) {
    var commonFriction = getCommonFriction(analysis);
    var missed = analysis.statusCount.missed || 0;
    var real = analysis.statusCount.real || 0;
    var entry = analysis.statusCount.entry || 0;
    var downgrade = analysis.statusCount.downgrade || 0;

    if (commonFriction === '任务太大' || missed > real + entry + downgrade) {
      return 'lower';
    }
    if (commonFriction === '忘记了' || commonFriction === '时间不合适') {
      return 'prompt';
    }
    return 'keep';
  }

  function topKey(map) {
    var bestKey = '';
    var bestValue = 0;
    Object.keys(map).forEach(function (key) {
      if (map[key] > bestValue) {
        bestKey = key;
        bestValue = map[key];
      }
    });
    return bestKey;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
