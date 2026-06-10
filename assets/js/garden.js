/* ========================================
   garden.js — home page rendering
   ======================================== */
(function () {
  'use strict';

  /* ----- branch anchor positions (% of tree area) ----- */
  var BRANCH_ANCHORS = [
    { id: 'b0', left: 20, top: 56, labelSide: 'left' },
    { id: 'b1', left: 78, top: 51, labelSide: 'right' },
    { id: 'b2', left: 24, top: 40, labelSide: 'left' },
    { id: 'b3', left: 75, top: 37, labelSide: 'right' },
    { id: 'b4', left: 49, top: 42, labelSide: 'center' },
    { id: 'b5', left: 38, top: 32, labelSide: 'left' }
  ];

  /* ----- helpers ----- */
  function leafClass(status) {
    switch (status) {
      case 'real':      return 'leaf--green';
      case 'entry':     return 'leaf--pale';
      case 'downgrade': return 'leaf--bud';
      case 'missed':    return 'leaf--yellow';
      default:          return 'leaf--pale';
    }
  }

  function statusLabel(status) {
    switch (status) {
      case 'real':      return '完成真实行动';
      case 'entry':     return '完成入场动作';
      case 'downgrade': return '今天降级';
      case 'missed':    return '今天没有发生';
      default:          return '';
    }
  }

  function daysBetween(a, b) {
    var da = new Date(a);
    var db = new Date(b);
    return Math.floor((db - da) / (1000 * 60 * 60 * 24));
  }

  /* ----- tooltip ----- */
  var tooltipEl = null;

  function ensureTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'leaf-tooltip';
      document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
  }

  function showTooltip(evt, record, habitName) {
    var tip = ensureTooltip();
    var reasonText = record.reason ? ' — ' + record.reason : '';
    tip.textContent = record.date + ' · ' + statusLabel(record.status)
      + (record.note ? ' · ' + record.note : '')
      + reasonText;
    tip.classList.add('is-visible');
    positionTooltip(evt);
  }

  function moveTooltip(evt) {
    positionTooltip(evt);
  }

  function hideTooltip() {
    if (tooltipEl) {
      tooltipEl.classList.remove('is-visible');
    }
  }

  function bindLeafTooltip(leaf, record, habitName) {
    leaf.addEventListener('mouseenter', function (e) {
      showTooltip(e, record, habitName);
    });
    leaf.addEventListener('mousemove', function (e) {
      moveTooltip(e);
    });
    leaf.addEventListener('mouseleave', function () {
      hideTooltip();
    });
  }

  function positionTooltip(evt) {
    if (!tooltipEl) return;
    var x = evt.clientX + 14;
    var y = evt.clientY - 36;
    // keep in viewport
    var tw = tooltipEl.offsetWidth;
    var th = tooltipEl.offsetHeight;
    if (x + tw > window.innerWidth - 8)  x = evt.clientX - tw - 14;
    if (y < 8)                           y = evt.clientY + 18;
    if (y + th > window.innerHeight - 8) y = window.innerHeight - th - 8;
    tooltipEl.style.left = x + 'px';
    tooltipEl.style.top  = y + 'px';
  }

  /* ----- navigation ----- */
  function renderNav() {
    var nav = document.createElement('nav');
    nav.className = 'top-nav';
    var links = [
      { href: 'index.html',  label: '花园', active: true },
      { href: 'create.html', label: '设计' },
      { href: 'review.html', label: '复盘' },
      { href: 'explore.html',label: '探索' }
    ];
    links.forEach(function (l) {
      var a = document.createElement('a');
      a.href = l.href;
      a.textContent = l.label;
      if (l.active) a.classList.add('active');
      nav.appendChild(a);
    });
    return nav;
  }

  /* ----- empty state ----- */
  function renderEmptyState(container) {
    container.innerHTML = '';

    var wrap = document.createElement('div');
    wrap.className = 'garden-empty fade-in';

    // visual: seed in soil
    var visual = document.createElement('div');
    visual.className = 'garden-empty__visual';
    var seedImg = document.createElement('img');
    seedImg.src = 'assets/svg/seed.svg';
    seedImg.alt = '种子';
    visual.appendChild(seedImg);

    // headline
    var h1 = document.createElement('h1');
    h1.className = 'garden-empty__headline';
    h1.textContent = '先种下一个容易发生的行为。';

    // state chips
    var chipsWrap = document.createElement('div');
    chipsWrap.className = 'garden-empty__chips';
    var tones = [
      { value: 'motivated', label: '我很有动力' },
      { value: 'low-energy', label: '我有点累，但想开始' },
      { value: 'exploring', label: '我只是看看' }
    ];
    var currentTone = AppState.getUserTone();
    tones.forEach(function (t) {
      var chip = document.createElement('span');
      chip.className = 'chip' + (t.value === currentTone ? ' chip--active' : '');
      chip.textContent = t.label;
      chip.setAttribute('data-tone', t.value);
      chip.addEventListener('click', function () {
        AppState.setUserTone(t.value);
        var all = chipsWrap.querySelectorAll('.chip');
        all.forEach(function (c) { c.classList.remove('chip--active'); });
        chip.classList.add('chip--active');
      });
      chipsWrap.appendChild(chip);
    });

    // primary button
    var btn = document.createElement('button');
    btn.className = 'btn btn--primary btn--large';
    btn.textContent = '生成一个微习惯方案';
    btn.addEventListener('click', function () {
      window.location.href = 'create.html';
    });

    // theory link
    var theory = document.createElement('span');
    theory.className = 'garden-empty__theory';
    theory.textContent = '为什么不是打卡？';
    theory.addEventListener('click', function () {
      var existing = document.querySelector('.theory-brief');
      if (existing) { existing.remove(); return; }
      var brief = document.createElement('p');
      brief.className = 'helper-text theory-brief fade-in';
      brief.style.maxWidth = '320px';
      brief.style.marginTop = 'var(--space-sm)';
      brief.textContent = '行为发生，不只靠坚持。它需要想做、做得动、想得起来。这里会帮你把行为设计得更容易发生。';
      theory.after(brief);
    });

    wrap.appendChild(visual);
    wrap.appendChild(h1);
    wrap.appendChild(chipsWrap);
    wrap.appendChild(btn);
    wrap.appendChild(theory);
    container.appendChild(wrap);
  }

  /* ----- habit tree state ----- */
  function renderHabitTree(container, habits) {
    container.innerHTML = '';

    var scene = document.createElement('div');
    scene.className = 'garden-scene fade-in';

    // tree area
    var treeArea = document.createElement('div');
    treeArea.className = 'garden-tree-area';

    // base tree SVG
    var treeImg = document.createElement('img');
    treeImg.src = 'assets/svg/tree.svg';
    treeImg.alt = '习惯树';
    treeImg.className = 'tree-base';
    treeArea.appendChild(treeImg);

    // branches and leaves
    habits.forEach(function (habit, idx) {
      var anchor = BRANCH_ANCHORS[idx % BRANCH_ANCHORS.length];

      // --- branch ---
      var branch = document.createElement('div');
      branch.className = 'branch branch-appear';
      branch.style.left = anchor.left + '%';
      branch.style.top = anchor.top + '%';
      branch.style.animationDelay = (idx * 0.12) + 's';
      branch.setAttribute('data-habit-id', habit.id);
      branch.title = habit.wish;

      branch.addEventListener('click', function () {
        AppState.setSelectedHabitId(habit.id);
        window.location.href = 'detail.html';
      });

      // branch label
      var label = document.createElement('span');
      label.className = 'branch__label';
      var habitLabel = habit.wish || '容易发生的行为';
      label.textContent = habitLabel.length > 8
        ? habitLabel.slice(0, 8) + '…'
        : habitLabel;

      if (anchor.labelSide === 'left') {
        label.style.position = 'absolute';
        label.style.right = '100%';
        label.style.marginRight = '8px';
        label.style.top = '50%';
        label.style.transform = 'translateY(-50%)';
      } else if (anchor.labelSide === 'right') {
        label.style.position = 'absolute';
        label.style.left = '100%';
        label.style.marginLeft = '8px';
        label.style.top = '50%';
        label.style.transform = 'translateY(-50%)';
      } else {
        // center — place below
        label.style.position = 'absolute';
        label.style.top = '100%';
        label.style.marginTop = '6px';
        label.style.left = '50%';
        label.style.transform = 'translateX(-50%)';
      }

      branch.appendChild(label);

      // --- leaves ---
      var records = habit.records || [];
      var leafCount = Math.min(records.length, 8); // cap visible leaves

      for (var ri = 0; ri < leafCount; ri++) {
        var rec = records[records.length - leafCount + ri];
        var leaf = document.createElement('span');
        leaf.className = 'leaf ' + leafClass(rec.status) + ' leaf-grow';
        leaf.style.animationDelay = (idx * 0.12 + ri * 0.08) + 's';

        // position leaf offset from branch anchor
        var offsetX = (ri - leafCount / 2) * 22 + (anchor.labelSide === 'left' ? 30 : anchor.labelSide === 'right' ? -30 : 0);
        var offsetY = -20 - ri * 4 + (anchor.labelSide === 'center' ? -10 : 0);

        leaf.style.position = 'absolute';
        leaf.style.left = '50%';
        leaf.style.top = '50%';
        leaf.style.marginLeft = offsetX + 'px';
        leaf.style.marginTop = offsetY + 'px';

        bindLeafTooltip(leaf, rec, habitLabel);

        branch.appendChild(leaf);
      }

      treeArea.appendChild(branch);
    });

    scene.appendChild(treeArea);

    // today card
    var todayCard = document.createElement('div');
    todayCard.className = 'card today-card';
    var todayText = document.createElement('p');
    todayText.className = 'today-card__text';
    todayText.textContent = '今天只做第一步也可以。';
    var todayActions = document.createElement('div');
    todayActions.className = 'today-card__actions';
    var goDetailBtn = document.createElement('button');
    goDetailBtn.className = 'btn btn--secondary btn--small';
    goDetailBtn.textContent = '去记录今天';
    goDetailBtn.addEventListener('click', function () {
      if (habits.length > 0) {
        AppState.setSelectedHabitId(habits[0].id);
      }
      window.location.href = 'detail.html';
    });
    todayActions.appendChild(goDetailBtn);
    todayCard.appendChild(todayText);
    todayCard.appendChild(todayActions);
    scene.appendChild(todayCard);

    container.appendChild(scene);
  }

  /* ----- return banner ----- */
  function renderReturnBanner(container) {
    var banner = document.createElement('div');
    banner.className = 'return-banner fade-in';
    var text = document.createElement('span');
    text.textContent = '欢迎回来。今天可以从一个很小的动作重新开始。';
    var btn = document.createElement('button');
    btn.className = 'btn btn--primary btn--small';
    btn.textContent = '我回来了';
    btn.addEventListener('click', function () {
      AppState.markVisit();
      banner.remove();
    });
    banner.appendChild(text);
    banner.appendChild(btn);
    container.insertBefore(banner, container.firstChild);
  }

  /* ----- glow card (anonymous, non-comparative) ----- */
  function renderGlowCard() {
    var card = document.createElement('div');
    card.className = 'glow-card fade-in';
    card.style.animationDelay = '0.6s';

    var icon = document.createElement('img');
    icon.src = 'assets/svg/glow.svg';
    icon.alt = '';
    icon.className = 'glow-card__icon glow-pulse';

    var text = document.createElement('p');
    text.className = 'glow-card__text';
    // pick a gentle anonymous message
    var messages = [
      '有人今天也只是完成了第一步。',
      '有人把计划调轻了一点。',
      '有人中断后又回来了。'
    ];
    text.textContent = messages[Math.floor(Math.random() * messages.length)];

    card.appendChild(icon);
    card.appendChild(text);
    document.body.appendChild(card);
  }

  /* ----- main ----- */
  function init() {
    var root = document.getElementById('garden-root');
    if (!root) return;

    // build layout
    var wrap = document.createElement('div');
    wrap.className = 'page-wrap';

    // navigation
    wrap.appendChild(renderNav());

    // main content
    var main = document.createElement('main');
    main.className = 'main-content';
    main.id = 'garden-main';
    wrap.appendChild(main);

    root.appendChild(wrap);

    var habits = AppState.getHabits();

    // check return state (> 3 days since last visit)
    var lastVisit = AppState.getLastVisit();
    var today = AppState.getTodayISO();
    var showReturn = lastVisit && daysBetween(lastVisit, today) > 3 && habits.length > 0;

    if (habits.length === 0) {
      renderEmptyState(main);
    } else {
      if (showReturn) {
        renderReturnBanner(main);
      }
      renderHabitTree(main, habits);
    }

    // glow card
    renderGlowCard();

    // mark today's visit
    AppState.markVisit();
  }

  /* ----- boot ----- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
