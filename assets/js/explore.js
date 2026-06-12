(function () {
  'use strict';

  /* ==============================================
     explore.js — category carousel + anonymous glow wall
     ============================================== */

  var STORAGE_KEY = 'habitGarden.exploreIdea';
  var CATEGORY_INTERVAL = 2400;
  var GLOW_WALL_INTERVAL = 3200;
  var TRANSITION_MS = 650;

  /* ----- fallback data ----- */
  var FALLBACK_CATEGORIES = [
    { key: 'reduce-friction', label: '降低阻力', hint: '让下一步更轻一点。' },
    { key: 'change-environment', label: '改变环境', hint: '让周围先帮你一点。' },
    { key: 'chain-existing', label: '绑定已有动作', hint: '挂在自然会发生的事后面。' },
    { key: 'entry-only', label: '只做入场动作', hint: '先让第一步出现。' }
  ];

  var FALLBACK_CARDS = {
    'reduce-friction': [
      { id: 'rf01', title: '把书放在枕边', description: '伸手就能拿到。', entryAction: '把书放到枕边', realAction: '读一页', naturalPrompt: '上床后' },
      { id: 'rf02', title: '只读一页', description: '先翻开就好。', entryAction: '把书翻开', realAction: '读一页', naturalPrompt: '晚饭后坐到书桌前' },
      { id: 'rf03', title: '先写一句', description: '不要求完整。', entryAction: '打开笔记页', realAction: '写一句话', naturalPrompt: '打开电脑后' },
      { id: 'rf04', title: '先学 5 分钟', description: '把开始变短一点。', entryAction: '打开学习资料', realAction: '学 5 分钟', naturalPrompt: '回到宿舍后' },
      { id: 'rf05', title: '先提前 10 分钟上床', description: '不要求立刻睡着。', entryAction: '躺到床上', realAction: '提前 10 分钟躺下', naturalPrompt: '洗漱后' },
      { id: 'rf06', title: '先做一次拉伸', description: '让身体先动一下。', entryAction: '站起来', realAction: '做一次拉伸', naturalPrompt: '起床后' },
      { id: 'rf07', title: '只打开文档', description: '先进入现场。', entryAction: '打开文档', realAction: '写一行标题', naturalPrompt: '打开电脑后' },
      { id: 'rf08', title: '先喝一口水', description: '从一个小动作开始。', entryAction: '拿起水杯', realAction: '喝一口水', naturalPrompt: '坐到书桌前后' },
      { id: 'rf09', title: '先记一个关键词', description: '把想法接住一点。', entryAction: '打开笔记软件', realAction: '写一个词', naturalPrompt: '想到一件事时' },
      { id: 'rf10', title: '先走到门口', description: '不急着完成全部。', entryAction: '站起来走到门口', realAction: '走到门口', naturalPrompt: '晚饭后' }
    ],
    'change-environment': [
      { id: 'ce01', title: '把零食收远一点', description: '看不见时更轻松。', entryAction: '把零食收进柜子', realAction: '不吃多余零食', naturalPrompt: '回到宿舍后' },
      { id: 'ce02', title: '提前放好运动鞋', description: '让出门近一点。', entryAction: '把鞋放到门口', realAction: '出门运动', naturalPrompt: '回家后' },
      { id: 'ce03', title: '把水杯放到桌上', description: '一抬眼就看到。', entryAction: '把水杯放在桌面上', realAction: '喝几口水', naturalPrompt: '坐到书桌前后' },
      { id: 'ce04', title: '把书放到书桌正中间', description: '让开始更容易。', entryAction: '把书放在桌前', realAction: '翻开书', naturalPrompt: '晚饭后' },
      { id: 'ce05', title: '睡前把手机放远一点', description: '少一点被带走。', entryAction: '把手机放到远处', realAction: '不看手机入睡', naturalPrompt: '上床前' },
      { id: 'ce06', title: '把笔记本摊开', description: '给自己留一个入口。', entryAction: '把本子摊开', realAction: '写一点东西', naturalPrompt: '坐到书桌前后' },
      { id: 'ce07', title: '只留一盏台灯', description: '让环境慢下来。', entryAction: '关掉大灯开台灯', realAction: '安静待一会儿', naturalPrompt: '晚饭后' },
      { id: 'ce08', title: '把要用的资料提前打开', description: '减少临场阻力。', entryAction: '提前打开资料页', realAction: '开始学习', naturalPrompt: '打开电脑后' },
      { id: 'ce09', title: '清出一小块桌面', description: '给行动留位置。', entryAction: '收拾桌面一角', realAction: '开始做一件事', naturalPrompt: '回到宿舍后' },
      { id: 'ce10', title: '把运动服放在椅背上', description: '让下一步更近。', entryAction: '把运动服摆好', realAction: '换上运动服', naturalPrompt: '起床后' }
    ],
    'chain-existing': [
      { id: 'ch01', title: '刷牙后喝一杯水', description: '接在已经稳定的动作后。', entryAction: '喝一杯水', realAction: '喝完水后开始今天的第一件事', naturalPrompt: '刷牙后' },
      { id: 'ch02', title: '晚饭后坐到书桌前', description: '先坐过去。', entryAction: '走到书桌前坐下', realAction: '学一会儿', naturalPrompt: '晚饭后' },
      { id: 'ch03', title: '回到宿舍后打开台灯', description: '让提示自然出现。', entryAction: '打开台灯', realAction: '坐下来开始学习', naturalPrompt: '回到宿舍后' },
      { id: 'ch04', title: '插上充电器后放下手机', description: '接在固定动作后。', entryAction: '把手机放下', realAction: '做别的', naturalPrompt: '插上充电器后' },
      { id: 'ch05', title: '打开电脑后先看提纲', description: '先看到任务。', entryAction: '打开提纲', realAction: '开始学习', naturalPrompt: '打开电脑后' },
      { id: 'ch06', title: '洗漱后把书翻开', description: '让阅读接上日常。', entryAction: '翻开书', realAction: '读一页', naturalPrompt: '洗漱后' },
      { id: 'ch07', title: '上床前记录一句', description: '给一天留下收尾。', entryAction: '打开笔记', realAction: '写一句', naturalPrompt: '上床前' },
      { id: 'ch08', title: '拿起水杯后站起来活动', description: '借一个动作带出另一个。', entryAction: '站起来', realAction: '活动一下', naturalPrompt: '拿起水杯后' },
      { id: 'ch09', title: '关灯前整理明天要用的', description: '让下一天轻一点。', entryAction: '整理桌面', realAction: '准备好明天物品', naturalPrompt: '关灯前' },
      { id: 'ch10', title: '吃饭前先停一下', description: '给选择留一点空间。', entryAction: '停下来深呼吸', realAction: '认真选择食物', naturalPrompt: '吃饭前' }
    ],
    'entry-only': [
      { id: 'eo01', title: '打开台灯', description: '只做这一步。', entryAction: '打开台灯', realAction: '坐下并开始第一步', naturalPrompt: '回到宿舍后' },
      { id: 'eo02', title: '穿上运动鞋', description: '先让身体到场。', entryAction: '穿上运动鞋', realAction: '走到门口', naturalPrompt: '想出门运动时' },
      { id: 'eo03', title: '打开笔记页', description: '不要求马上写很多。', entryAction: '打开笔记页', realAction: '写下第一行', naturalPrompt: '打开电脑后' },
      { id: 'eo04', title: '把书放到眼前', description: '先进入阅读现场。', entryAction: '把书放到眼前', realAction: '翻开读第一段', naturalPrompt: '晚饭后' },
      { id: 'eo05', title: '打开学习文档', description: '只让入口出现。', entryAction: '打开学习文档', realAction: '看一眼今天要学的内容', naturalPrompt: '打开电脑后' },
      { id: 'eo06', title: '坐到书桌前', description: '先到那个位置。', entryAction: '走到书桌前坐下', realAction: '打开今天要用的东西', naturalPrompt: '晚饭后' },
      { id: 'eo07', title: '把水杯装满', description: '先准备好。', entryAction: '把水杯装满水', realAction: '喝几口', naturalPrompt: '起床后' },
      { id: 'eo08', title: '站起来', description: '先从姿势开始。', entryAction: '从椅子上站起来', realAction: '活动一下身体', naturalPrompt: '感觉久坐时' },
      { id: 'eo09', title: '翻开今天这一页', description: '不要求立刻读完。', entryAction: '翻开今天该读的那一页', realAction: '读第一段', naturalPrompt: '坐到书桌前后' },
      { id: 'eo10', title: '写下标题', description: '先给任务开个头。', entryAction: '写下标题', realAction: '写第一段内容', naturalPrompt: '打开文档后' }
    ]
  };

  /* ----- glow messages (30 entries) ----- */
  var GLOW_MESSAGES = [
    '有人今天只是坐到了书桌前。',
    '有人把计划调轻了一点。',
    '有人中断后又回来了。',
    '有人只翻开了一页。',
    '有人把运动鞋放到了门口。',
    '有人把手机放远了一点。',
    '有人只是打开了台灯。',
    '有人今天只做了入场动作。',
    '有人把零食收进了柜子。',
    '有人写下了一个关键词。',
    '有人没有做很多，但留下了一点痕迹。',
    '有人把书放到了枕边。',
    '有人晚饭后坐到了书桌前。',
    '有人先喝了一口水。',
    '有人今天选择调轻一点。',
    '有人把下一步放近了一点。',
    '有人只是打开了文档。',
    '有人给自己留了一个入口。',
    '有人换了一个更自然的提示点。',
    '有人让开始变短了一点。',
    '有人把动作放到了已经会发生的时刻后面。',
    '有人今天只是回来看了一眼。',
    '有人把明天要用的东西放好了。',
    '有人先试了 2 分钟。',
    '有人把任务拆到只剩第一步。',
    '有人保留了当前节奏。',
    '有人没有责备自己，只是重新开始。',
    '有人把提醒变轻了一点。',
    '有人发现自己更适合晚上开始。',
    '有人只是让这件事重新出现。'
  ];

  /* ----- state ----- */
  var root = null;
  var categories = FALLBACK_CATEGORIES;
  var allCards = FALLBACK_CARDS;
  var glowMessages = GLOW_MESSAGES.slice();

  // Per-category carousel state
  var catState = {};       // key -> { index, timer, track, viewport }
  var glowState = {
    visible: [0, 1, 2],   // indices of currently visible messages
    replaceSlot: 0,       // next slot to replace (0, 1, 2 cycle)
    messageIndex: 3,      // next message to pull from pool
    timer: null,
    paused: false
  };

  /* ----- helpers ----- */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function getCardStep(categoryKey) {
    // Return the step size (card width + gap) for the given category viewport
    var cs = catState[categoryKey];
    if (!cs || !cs.viewport) return 250; // fallback
    var cardEl = cs.track ? cs.track.querySelector('.explore-card') : null;
    if (cardEl) {
      return cardEl.offsetWidth + 14; // gap
    }
    // Estimate: 2 cards visible, viewport width minus padding and gap
    var vw = cs.viewport.clientWidth;
    return (vw - 14) / 2 + 14;
  }

  /* ==============================================
     Init
     ============================================== */
  function init() {
    root = document.getElementById('explore-root');
    if (!root) return;

    loadData().then(function () {
      shuffleGlowMessages();
      render();
      startAllLoops();
    });
  }

  function loadData() {
    if (window.location.protocol === 'file:') {
      return Promise.resolve();
    }

    return fetch('data/behavior-cards.json')
      .then(function (resp) {
        if (!resp.ok) throw new Error('unavailable');
        return resp.json();
      })
      .then(function (json) {
        if (json && Array.isArray(json.categories) && json.cards) {
          categories = json.categories;
          // Merge with fallback to fill any gaps
          for (var i = 0; i < categories.length; i++) {
            var key = categories[i].key;
            if (json.cards[key] && json.cards[key].length) {
              allCards[key] = json.cards[key];
            } else if (!allCards[key]) {
              allCards[key] = [];
            }
          }
        }
      })
      .catch(function () {
        // use fallback
      });
  }

  function shuffleGlowMessages() {
    glowMessages = shuffle(GLOW_MESSAGES);
  }

  /* ==============================================
     Render
     ============================================== */
  function render() {
    root.innerHTML = '';
    root.appendChild(renderHeader());

    var layout = document.createElement('section');
    layout.className = 'explore-layout';
    layout.setAttribute('aria-label', '自由探索');

    layout.appendChild(renderCategories());
    layout.appendChild(renderGlowWall());
    root.appendChild(layout);
  }

  function renderHeader() {
    var header = document.createElement('header');
    header.className = 'explore-head';

    var left = document.createElement('div');
    left.className = 'explore-head__left';

    var kicker = document.createElement('span');
    kicker.className = 'explore-kicker';
    kicker.textContent = '自由探索';

    var title = document.createElement('h1');
    title.className = 'explore-title';
    title.textContent = '找一个更容易开始的方式。';

    left.appendChild(kicker);
    left.appendChild(title);

    var back = document.createElement('a');
    back.className = 'btn btn--secondary';
    back.href = 'index.html';
    back.textContent = '返回花园';

    header.appendChild(left);
    header.appendChild(back);
    return header;
  }

  function renderCategories() {
    var section = document.createElement('section');
    section.className = 'explore-categories';

    categories.forEach(function (cat) {
      var cards = allCards[cat.key] || [];
      if (!cards.length) return;
      section.appendChild(renderCategoryModule(cat, cards));
    });

    return section;
  }

  function renderCategoryModule(cat, cards) {
    var module = document.createElement('article');
    module.className = 'category-module';
    module.setAttribute('aria-label', cat.label);

    // Header
    var head = document.createElement('div');
    head.className = 'category-module__header';

    var title = document.createElement('h2');
    title.className = 'category-module__title';
    title.textContent = cat.label;

    var hint = document.createElement('p');
    hint.className = 'category-module__hint';
    hint.textContent = cat.hint;

    head.appendChild(title);
    head.appendChild(hint);
    module.appendChild(head);

    // Viewport + Track
    var viewport = document.createElement('div');
    viewport.className = 'category-module__viewport';

    var track = document.createElement('div');
    track.className = 'category-track';

    // Render cards + clone first 2 for seamless loop
    var displayCards = cards.concat(cards.slice(0, 2));
    displayCards.forEach(function (card) {
      track.appendChild(renderCard(card, cat));
    });

    viewport.appendChild(track);
    module.appendChild(viewport);

    // Initialize state
    catState[cat.key] = {
      index: 0,
      timer: null,
      track: track,
      viewport: viewport
    };

    // Pause on hover
    module.addEventListener('mouseenter', function () {
      pauseCategory(cat.key);
    });
    module.addEventListener('mouseleave', function () {
      resumeCategory(cat.key);
    });

    return module;
  }

  function renderCard(card, cat) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'explore-card';
    button.setAttribute('aria-label', '带着「' + card.title + '」去设计');

    var cardTitle = document.createElement('span');
    cardTitle.className = 'explore-card__title';
    cardTitle.textContent = card.title;

    var desc = document.createElement('span');
    desc.className = 'explore-card__desc';
    desc.textContent = card.description;

    var action = document.createElement('span');
    action.className = 'explore-card__action';
    action.textContent = '带着它去设计 →';

    button.appendChild(cardTitle);
    button.appendChild(desc);
    button.appendChild(action);

    button.addEventListener('click', function () {
      saveExploreDraft(card, cat);
      window.location.href = 'create.html';
    });

    return button;
  }

  function renderGlowWall() {
    var aside = document.createElement('aside');
    aside.className = 'glow-wall';
    aside.setAttribute('aria-label', '匿名微光墙');

    var glowDot = document.createElement('div');
    glowDot.className = 'glow-wall__glow';

    var head = document.createElement('div');
    head.className = 'glow-wall__head';

    var title = document.createElement('h2');
    title.className = 'glow-wall__title';
    title.textContent = '匿名微光墙';

    head.appendChild(title);

    var sub = document.createElement('p');
    sub.className = 'glow-wall__sub';
    sub.textContent = '有人也在用很小的方式开始。';

    var msgContainer = document.createElement('div');
    msgContainer.className = 'glow-wall__messages';

    glowState.visible.forEach(function (msgIdx) {
      var el = document.createElement('p');
      el.className = 'glow-message';
      el.textContent = glowMessages[msgIdx] || '';
      msgContainer.appendChild(el);
    });

    aside.appendChild(glowDot);
    aside.appendChild(head);
    aside.appendChild(sub);
    aside.appendChild(msgContainer);

    // Pause on hover
    aside.addEventListener('mouseenter', function () {
      pauseGlowWall();
    });
    aside.addEventListener('mouseleave', function () {
      resumeGlowWall();
    });

    return aside;
  }

  /* ==============================================
     Category Carousel
     ============================================== */
  function startAllLoops() {
    categories.forEach(function (cat, i) {
      if (!allCards[cat.key] || !allCards[cat.key].length) return;
      // Stagger start times so modules don't move in sync
      var stagger = i * 380;
      setTimeout(function () {
        startCategoryLoop(cat.key);
      }, stagger);
    });
    startGlowWallLoop();
  }

  function startCategoryLoop(categoryKey) {
    var cs = catState[categoryKey];
    if (!cs) return;
    stopCategoryLoop(categoryKey);
    cs.timer = setInterval(function () {
      advanceCategory(categoryKey);
    }, CATEGORY_INTERVAL);
  }

  function stopCategoryLoop(categoryKey) {
    var cs = catState[categoryKey];
    if (cs && cs.timer) {
      clearInterval(cs.timer);
      cs.timer = null;
    }
  }

  function pauseCategory(categoryKey) {
    stopCategoryLoop(categoryKey);
  }

  function resumeCategory(categoryKey) {
    startCategoryLoop(categoryKey);
  }

  function advanceCategory(categoryKey) {
    var cs = catState[categoryKey];
    if (!cs || !cs.track) return;

    var cards = allCards[categoryKey] || [];
    if (cards.length === 0) return;

    var nextIndex = cs.index + 1;
    var step = getCardStep(categoryKey);

    cs.index = nextIndex;
    cs.track.style.transition = 'transform ' + TRANSITION_MS + 'ms cubic-bezier(0.34, 0.76, 0.22, 1)';
    cs.track.style.transform = 'translateX(' + (-nextIndex * step) + 'px)';

    // When we reach the cloned area, reset after transition
    if (nextIndex >= cards.length) {
      cs.track.addEventListener('transitionend', function resetPos() {
        cs.track.removeEventListener('transitionend', resetPos);
        cs.track.style.transition = 'none';
        cs.track.style.transform = 'translateX(0px)';
        cs.index = 0;
        // Force reflow so the no-transition state is painted
        cs.track.offsetHeight;
        cs.track.style.transition = 'transform ' + TRANSITION_MS + 'ms cubic-bezier(0.34, 0.76, 0.22, 1)';
      });
    }
  }

  /* ==============================================
     Glow Wall Rotation
     ============================================== */
  function startGlowWallLoop() {
    stopGlowWallLoop();
    glowState.timer = setInterval(function () {
      rotateGlowMessage();
    }, GLOW_WALL_INTERVAL);
  }

  function stopGlowWallLoop() {
    if (glowState.timer) {
      clearInterval(glowState.timer);
      glowState.timer = null;
    }
  }

  function pauseGlowWall() {
    glowState.paused = true;
    stopGlowWallLoop();
  }

  function resumeGlowWall() {
    glowState.paused = false;
    startGlowWallLoop();
  }

  function rotateGlowMessage() {
    var container = document.querySelector('.glow-wall__messages');
    if (!container) return;

    var slot = glowState.replaceSlot;
    var msgEls = container.querySelectorAll('.glow-message');

    if (!msgEls[slot]) return;

    // Get next message index
    var newIdx = glowState.messageIndex % glowMessages.length;
    glowState.messageIndex = (glowState.messageIndex + 1) % glowMessages.length;

    // Exit animation
    var oldEl = msgEls[slot];
    oldEl.classList.add('is-exiting');

    oldEl.addEventListener('animationend', function onExit() {
      oldEl.removeEventListener('animationend', onExit);
      oldEl.textContent = glowMessages[newIdx];
      oldEl.classList.remove('is-exiting');
      // Force a frame so the browser drops the exit animation state
      oldEl.offsetHeight;
      oldEl.classList.add('is-entering');

      oldEl.addEventListener('animationend', function onEnter() {
        oldEl.removeEventListener('animationend', onEnter);
        oldEl.classList.remove('is-entering');
      });
    });

    // Advance replace slot (0 → 1 → 2 → 0)
    glowState.replaceSlot = (glowState.replaceSlot + 1) % 3;
    glowState.visible[slot] = newIdx;
  }

  /* ==============================================
     Save draft & navigate
     ============================================== */
  function saveExploreDraft(card, cat) {
    var starterTypeMap = {
      'reduce-friction': 'reduce_friction',
      'change-environment': 'environment',
      'chain-existing': 'anchor',
      'entry-only': 'entry_only'
    };
    var designHintMap = {
      'reduce-friction': '把动作缩小到更容易开始',
      'change-environment': '先改变环境，让下一步更容易',
      'chain-existing': '把新动作接到已经会发生的动作后面',
      'entry-only': '先只让动作出现，不要求做很多'
    };
    var draft = {
      source: 'explore',
      cardId: card.id,
      title: card.title,
      description: card.description,
      category: cat.label,
      categoryKey: cat.key,
      starterType: starterTypeMap[cat.key] || '',
      designHint: designHintMap[cat.key] || '',
      suggestedEntryAction: card.entryAction || '',
      suggestedRealAction: card.realAction || '',
      suggestedPrompt: card.naturalPrompt || '',
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      // navigation still works
    }
  }

  /* ==============================================
     Start
     ============================================== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
