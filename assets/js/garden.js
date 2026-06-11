(function () {
  'use strict';

  var STORAGE_KEYS = {
    habits: 'habitGarden.habits',
    selectedHabitId: 'habitGarden.selectedHabitId'
  };

  var state = {
    habits: [],
    railScrollFrame: 0,
    railScrollVelocity: 0
  };

  function readJSON(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function getHabits() {
    if (window.AppState && typeof window.AppState.getHabits === 'function') {
      return window.AppState.getHabits();
    }

    var habits = readJSON(STORAGE_KEYS.habits);
    return Array.isArray(habits) ? habits : [];
  }

  function setSelectedHabitId(id) {
    if (!id) return;

    if (window.AppState && typeof window.AppState.setSelectedHabitId === 'function') {
      window.AppState.setSelectedHabitId(id);
    } else {
      localStorage.setItem(STORAGE_KEYS.selectedHabitId, id);
    }
  }

  function getHabitTitle(habit) {
    return habit.wish || habit.goldenBehavior || habit.entryAction || '一个小习惯';
  }

  function getHabitSummary(habit) {
    return habit.entryAction || habit.promptSentence || habit.realAction || '从一个小动作开始';
  }

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof text === 'string') element.textContent = text;
    return element;
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

  function refreshHomeAfterTodayRecord() {
    state.habits = getHabits();
    renderHome();
  }

  function renderTodayPopover() {
    if (!window.TodayRecordPopover) return null;

    state.habits = getHabits();
    return window.TodayRecordPopover.renderTodayRecordPopover(getTodayPopoverHost(), state.habits, {
      source: 'home',
      onSaveRecord: refreshHomeAfterTodayRecord
    });
  }

  function stopRailAutoScroll() {
    state.railScrollVelocity = 0;
    if (state.railScrollFrame) {
      cancelAnimationFrame(state.railScrollFrame);
      state.railScrollFrame = 0;
    }
  }

  function startRailAutoScroll(scroller) {
    if (state.railScrollFrame) return;

    function tick() {
      if (!state.railScrollVelocity) {
        state.railScrollFrame = 0;
        return;
      }

      scroller.scrollTop += state.railScrollVelocity;
      state.railScrollFrame = requestAnimationFrame(tick);
    }

    state.railScrollFrame = requestAnimationFrame(tick);
  }

  function bindPointerAutoScroll(scroller) {
    scroller.addEventListener('pointermove', function (event) {
      if (scroller.scrollHeight <= scroller.clientHeight) {
        stopRailAutoScroll();
        return;
      }

      var rect = scroller.getBoundingClientRect();
      var localY = event.clientY - rect.top;
      var center = rect.height / 2;
      var deadZone = rect.height * 0.18;
      var distance = localY - center;

      if (Math.abs(distance) < deadZone) {
        state.railScrollVelocity = 0;
        return;
      }

      var direction = distance > 0 ? 1 : -1;
      var strength = Math.min(Math.abs(distance) / center, 1);
      state.railScrollVelocity = direction * (1 + strength * 2.5);
      startRailAutoScroll(scroller);
    });

    scroller.addEventListener('pointerleave', stopRailAutoScroll);
    scroller.addEventListener('blur', stopRailAutoScroll, true);
  }

  function openHabitDetail(habitId) {
    setSelectedHabitId(habitId);
    window.location.href = 'detail.html';
  }

  function renderHabitRail(parent) {
    var rail = createElement('aside', 'river-home-rail river-fade-in');
    rail.setAttribute('aria-label', '我的习惯');

    var title = createElement('h2', 'river-home-rail__title', '我的习惯');
    rail.appendChild(title);

    var scroller = createElement('div', 'river-home-rail__scroller');
    scroller.tabIndex = 0;

    if (!state.habits.length) {
      var empty = createElement('p', 'river-home-rail__empty', '先设计一个小习惯。');
      scroller.appendChild(empty);
    }

    state.habits.forEach(function (habit) {
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'river-home-habit';
      item.dataset.habitId = habit.id;
      item.setAttribute('aria-label', '打开 ' + getHabitTitle(habit));

      var itemTitle = createElement('span', 'river-home-habit__title', getHabitTitle(habit));
      var itemSummary = createElement('span', 'river-home-habit__summary', getHabitSummary(habit));
      item.appendChild(itemTitle);
      item.appendChild(itemSummary);

      item.addEventListener('click', function () {
        openHabitDetail(habit.id);
      });

      scroller.appendChild(item);
    });

    rail.appendChild(scroller);

    var add = document.createElement('a');
    add.className = 'river-home-rail__add';
    add.href = 'create.html';
    add.setAttribute('aria-label', '新增习惯');
    add.textContent = '+';
    rail.appendChild(add);

    bindPointerAutoScroll(scroller);
    parent.appendChild(rail);
  }

  function renderIntroCard(parent) {
    var card = createElement('section', 'river-home-intro river-fade-in');
    card.setAttribute('aria-label', '项目介绍');

    var title = createElement('h1', 'river-home-intro__title', '让行为自然发生');
    var copy = createElement('p', 'river-home-intro__copy', '从微小的流动开始，慢慢留下自己的节奏。');
    card.appendChild(title);
    card.appendChild(copy);

    var list = createElement('ul', 'river-home-intro__list');
    [
      '想做：看见真正的愿望',
      '做得动：把动作调轻一点',
      '想得起：绑定自然提示'
    ].forEach(function (text) {
      var item = createElement('li', '', text);
      list.appendChild(item);
    });
    card.appendChild(list);

    parent.appendChild(card);
  }

  function renderHome() {
    var mount = document.getElementById('riverHomeMount');
    if (!mount) return;

    state.habits = getHabits();

    mount.replaceChildren();
    mount.className = 'river-home-mount';

    var stage = createElement('section', 'river-home-stage');
    stage.setAttribute('aria-label', '河流首页');
    mount.appendChild(stage);

    if (window.RiverStageRenderer && typeof window.RiverStageRenderer.renderRiverBackground === 'function') {
      window.RiverStageRenderer.renderRiverBackground(stage, { mode: 'home' });
    } else {
      var background = createElement('div', 'river-home-stage__background');
      var backgroundImage = document.createElement('img');
      backgroundImage.className = 'river-home-stage__image';
      backgroundImage.src = 'assets/images/river-stage-bg.png';
      backgroundImage.alt = '';
      backgroundImage.setAttribute('aria-hidden', 'true');
      background.appendChild(backgroundImage);
      stage.appendChild(background);
    }

    var overlay = createElement('div', 'river-home-stage__overlay');
    stage.appendChild(overlay);

    renderHabitRail(overlay);
    renderIntroCard(overlay);
  }

  function bindNav() {
    var todayLink = document.querySelector('[data-nav="today-record"]');
    if (!todayLink) return;

    todayLink.addEventListener('click', function (event) {
      event.preventDefault();
      if (!window.TodayRecordPopover) return;

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
    renderHome();
    window.refreshRiverHome = renderHome;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
