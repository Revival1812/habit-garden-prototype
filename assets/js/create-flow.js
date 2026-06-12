(function () {
  'use strict';

  var STORAGE_KEY = 'habitGarden.habits';

  var PROMPT_OPTIONS = [
    '刷牙后',
    '晚饭后',
    '插上充电器后',
    '坐到书桌前后',
    '回到宿舍后',
    '打开电脑后'
  ];

  var PROMPT_STRENGTH_OPTIONS = [
    '无打扰视觉提示',
    '轻提醒',
    '强提醒'
  ];

  var DEFAULT_TEMPLATE_KEY = 'custom';

  var CATEGORY_LABELS = {
    'reduce-friction': '降低阻力',
    'change-environment': '改变环境',
    'chain-existing': '绑定已有动作',
    'preparation-action': '准备动作',
    'entry-only': '只做入场动作',
    'scene-transition': '场景切换',
    'micro-action': '微动作',
    'environment-adjustment': '环境调整',
    'task-splitting': '任务拆分',
    'light-start': '轻启动'
  };

  var FALLBACK_TEMPLATE_DATA = {
    templates: {
      sleep_early: {
        label: '早睡',
        wish: '早睡',
        hint: '先把晚上收轻一点',
        why_now: ['已经困扰一阵子了', '最近更想让作息稳一点', '白天状态有点乱', '想先从晚上收一收', '只是想先试试看'],
        how_it_happens: ['晚饭后坐到书桌前', '回到宿舍后打开台灯', '洗漱后把手机放远一点', '插上充电器后关掉大灯', '先躺到床上不刷别的内容', '只做入场动作：打开台灯', '穿上睡衣就先进入准备状态'],
        starter_versions: ['数量缩小型：先提前 10 分钟上床', '场景切换型：先回到床边坐下', '准备动作型：先把充电器插好', '环境调整型：先关掉顶灯，只留台灯', '微动作型：先放下手机 2 分钟', '入场型：先躺下，不要求立刻睡着']
      },
      study: {
        label: '学习',
        wish: '学习',
        hint: '先让学习重新靠近一点',
        why_now: ['最近被某件事提醒了', '这阵子有点松', '想把节奏重新找回来', '最近更想让自己稳一点', '先从一点点开始试试'],
        how_it_happens: ['晚饭后坐到书桌前', '打开电脑后先打开资料', '回到宿舍后先坐下', '拿出书后先翻到那一页', '只读一页', '只做入场动作：打开文档', '打开台灯后先看一眼提纲'],
        starter_versions: ['数量缩小型：先学 5 分钟', '场景切换型：先走到书桌前', '准备动作型：先把书翻开', '任务拆分型：先只看一页', '入场型：先打开文档，不要求继续太多', '轻启动型：先写一行标题']
      },
      exercise: {
        label: '运动',
        wish: '运动',
        hint: '先让身体动起来一点',
        why_now: ['想让身体动起来一点', '最近坐得太久了', '想把身体状态找回来', '生活有点闷，想松一松', '先别要求太多，先开始'],
        how_it_happens: ['回到宿舍后先换鞋', '早上起床后先站起来活动一下', '晚饭后先走到楼下', '穿上运动鞋', '先做一个拉伸动作', '只做入场动作：换上运动服', '打开运动视频后站起来'],
        starter_versions: ['数量缩小型：先动 2 分钟', '场景切换型：先走到门口', '准备动作型：先穿上运动鞋', '微动作型：先做一次拉伸', '入场型：先站起来', '轻启动型：先走几步']
      },
      read: {
        label: '阅读',
        wish: '阅读',
        hint: '先把阅读放回生活里',
        why_now: ['想让自己安静一点', '最近更想留一点自己的时间', '想把注意力收回来一点', '只是想先轻轻开始', '最近想把阅读放回生活里'],
        how_it_happens: ['晚饭后坐到书桌前', '回到宿舍后打开台灯', '把书放在枕边', '拿起书后翻开一页', '只读一页', '只做入场动作：把书放到手边', '打开台灯后坐下'],
        starter_versions: ['数量缩小型：先读 1 页', '场景切换型：先坐到阅读的位置', '准备动作型：先把书拿出来', '微动作型：先翻开今天要看的那一页', '入场型：先把书放在眼前', '轻启动型：先读一句']
      },
      diet: {
        label: '减肥',
        wish: '减肥',
        hint: '先让饮食轻一点',
        why_now: ['最近更想让身体轻一点', '想先让生活有一点秩序', '饮食状态有点乱', '最近更想先收一收', '先从能做的第一步开始'],
        how_it_happens: ['吃饭前先喝几口水', '晚饭后先不拿零食', '回到宿舍后先把零食收起来', '先把水果放到看得见的地方', '只做入场动作：把水杯放在桌上', '打开冰箱时先看健康选项', '晚饭后先坐到书桌前而不是找零食'],
        starter_versions: ['数量缩小型：今晚少加一份零食', '场景切换型：先离开容易吃零食的位置', '准备动作型：先把水杯装满', '环境调整型：先把零食收进柜子', '微动作型：先喝一口水', '入场型：先不拿零食，只做第一步']
      },
      notes: {
        label: '记录笔记',
        wish: '记录笔记',
        hint: '先接住一个想法',
        why_now: ['最近脑子里的东西有点散', '想给自己留一点痕迹', '想把一些想法接住', '最近更想让自己清楚一点', '先从一小句开始'],
        how_it_happens: ['打开电脑后翻开笔记', '晚饭后坐到书桌前', '打开笔记软件后写一行', '回到宿舍后先翻开本子', '只做入场动作：打开笔记页', '想到一件事时先记一个词', '打开台灯后坐下写一句'],
        starter_versions: ['数量缩小型：先记 1 句话', '场景切换型：先坐到书桌前', '准备动作型：先打开笔记页', '微动作型：先写下一个关键词', '入场型：先翻开今天这一页', '轻启动型：先写标题']
      },
      custom: {
        label: '自定义',
        wish: '',
        hint: '用中性模板轻轻开始',
        custom: true,
        why_now: ['最近被某件事提醒了', '已经困扰一阵子了', '想让生活轻一点', '想先给自己一点秩序', '只是想先试试看'],
        how_it_happens: ['把要做的东西放到眼前', '先坐到会发生的位置', '先做一个入场动作', '绑在一个已经会发生的动作后面', '只做最小的一步', '先把环境整理到更容易开始', '先打开那个页面 / 工具 / 物品'],
        starter_versions: ['数量缩小型：先做 2 分钟', '场景切换型：先到那个地方', '准备动作型：先把需要的东西放好', '微动作型：先做第一步', '入场型：先进入现场', '轻启动型：先留下一点痕迹']
      }
    },
    order: ['sleep_early', 'study', 'exercise', 'read', 'diet', 'notes', 'custom']
  };

  var STEP_DEFS = [
    { key: 'wish', label: '愿望', short: '愿望' },
    { key: 'reason', label: '为什么现在', short: '原因' },
    { key: 'candidates', label: '候选行为', short: '行为' },
    { key: 'focus', label: '焦点地图', short: '焦点' },
    { key: 'micro', label: '微习惯', short: '微习惯' },
    { key: 'prompt', label: '自然提示', short: '提示' }
  ];

  var CURVE_POINTS = [
    { x: 64, y: 456 },
    { x: 126, y: 392 },
    { x: 214, y: 314 },
    { x: 170, y: 224 },
    { x: 234, y: 144 },
    { x: 138, y: 76 }
  ];

  var state = {
    currentStep: 0,
    revealedSegments: 1,
    showCustomWishInput: false,
    wish: '',
    reason: '',
    whyNowSource: 'template',
    candidates: [],
    goldenBehavior: '',
    microHabitType: '',
    entryAction: '',
    realAction: '',
    prompt: '',
    promptSentence: '',
    promptSource: 'template',
    promptStrength: '无打扰视觉提示',
    templateKey: DEFAULT_TEMPLATE_KEY,
    templateData: FALLBACK_TEMPLATE_DATA,
    mapPositions: {},
    exploreSource: null,
    readyToSave: false,
    _prevRevealedSegments: 0
  };

  var refs = {};
  var dragState = null;

  function init() {
    refs.curveBoard = document.getElementById('curve-board');
    refs.stepCard = document.getElementById('step-card');
    refs.planPreview = document.getElementById('plan-preview');
    refs.previewBadge = document.getElementById('preview-badge');

    if (!refs.curveBoard || !refs.stepCard || !refs.planPreview) return;

    loadTemplateData().finally(function () {
      loadExploreDraft();
      renderAll();
    });
  }

  function loadTemplateData() {
    if (window.location.protocol === 'file:') {
      state.templateData = loadTemplateDataWithXHR() || FALLBACK_TEMPLATE_DATA;
      return Promise.resolve();
    }

    return fetch('data/templates.json')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('template data request failed');
        }
        return response.json();
      })
      .then(function (json) {
        if (isTemplateDataUsable(json)) {
          state.templateData = json;
        }
      })
      .catch(function () {
        state.templateData = FALLBACK_TEMPLATE_DATA;
      });
  }

  function loadTemplateDataWithXHR() {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'data/templates.json', false);
      xhr.send();
      if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
        var json = JSON.parse(xhr.responseText);
        return isTemplateDataUsable(json) ? json : null;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  function isTemplateDataUsable(json) {
    return !!(json && json.templates && json.templates.custom);
  }

  function renderAll() {
    renderCurve();
    renderStepCard();
    renderPreview();
  }

  function renderCurve() {
    refs.curveBoard.innerHTML = '';

    var grain = document.createElement('div');
    grain.className = 'curve-board__grain';
    refs.curveBoard.appendChild(grain);

    var startNode = document.createElement('div');
    startNode.className = 'curve-start';
    refs.curveBoard.appendChild(startNode);

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'curve-svg');
    svg.setAttribute('viewBox', '0 0 300 560');
    svg.setAttribute('aria-hidden', 'true');

    var fullPath = [
      'M 44 512',
      'C 44 488, 48 472, 64 456',
      'C 82 438, 112 426, 126 392',
      'C 144 350, 198 354, 214 314',
      'C 230 274, 166 264, 170 224',
      'C 174 184, 240 184, 234 144',
      'C 229 105, 166 96, 138 76'
    ].join(' ');

    var track = document.createElementNS(svgNS, 'path');
    track.setAttribute('class', 'curve-track');
    track.setAttribute('d', fullPath);
    track.setAttribute('pathLength', '600');
    svg.appendChild(track);

    var glow = document.createElementNS(svgNS, 'path');
    glow.setAttribute('class', 'curve-glow');
    glow.setAttribute('d', fullPath);
    glow.setAttribute('pathLength', '600');
    svg.appendChild(glow);

    var progressPath = document.createElementNS(svgNS, 'path');
    var progressRatio = Math.max(1, Math.min(state.revealedSegments, STEP_DEFS.length)) / STEP_DEFS.length;
    var targetOffset = Math.round(600 - (progressRatio * 600));
    // Start from previous position so animation goes in the correct direction
    var prevRatio = Math.max(0, Math.min(state._prevRevealedSegments || 0, STEP_DEFS.length)) / STEP_DEFS.length;
    var startOffset = prevRatio > 0 ? Math.round(600 - (prevRatio * 600)) : 600;
    state._prevRevealedSegments = state.revealedSegments;
    progressPath.setAttribute('class', 'curve-progress');
    progressPath.setAttribute('d', fullPath);
    progressPath.setAttribute('pathLength', '600');
    // Set to previous position, then transition to target on next frame
    progressPath.style.strokeDashoffset = String(startOffset);
    requestAnimationFrame(function () {
      progressPath.style.strokeDashoffset = String(targetOffset);
    });
    svg.appendChild(progressPath);

    refs.curveBoard.appendChild(svg);

    STEP_DEFS.forEach(function (step, index) {
      var point = CURVE_POINTS[index];
      var button = document.createElement('button');
      button.type = 'button';
      button.className = curveNodeClass(index);
      button.style.left = point.x + 'px';
      button.style.top = point.y + 'px';
      button.style.setProperty('--node-delay', (0.16 + index * 0.09) + 's');

      if (index <= furthestAvailableStep()) {
        button.addEventListener('click', function () {
          state.currentStep = Math.min(index, maxOpenStep());
          state.revealedSegments = state.currentStep + 1;
          state.readyToSave = false;
          renderAll();
        });
      } else {
        button.disabled = true;
      }

      var label = document.createElement('span');
      label.className = 'curve-node__label';
      label.textContent = step.label;
      button.appendChild(label);
      refs.curveBoard.appendChild(button);
    });
  }

  function curveNodeClass(index) {
    var className = 'curve-node';
    if (index === state.currentStep && !state.readyToSave) {
      className += ' is-current';
    } else if (index < state.currentStep && isStepComplete(index)) {
      className += ' is-complete';
    } else {
      className += ' is-hint';
    }
    return className;
  }

  function renderStepCard() {
    refs.stepCard.innerHTML = '';

    if (state.readyToSave) {
      renderFinalCard();
      return;
    }

    var step = STEP_DEFS[state.currentStep];
    var head = document.createElement('div');
    head.className = 'step-head';
    head.innerHTML = ''
      + '<div class="step-index">第 ' + (state.currentStep + 1) + ' 段</div>'
      + '<h2 class="step-question">' + getStepQuestion(step.key) + '</h2>'
      + '<p class="step-helper">' + getStepHelper(step.key) + '</p>';

    var body = document.createElement('div');
    body.className = 'step-body';

    if (step.key === 'wish') renderWishStep(body);
    if (step.key === 'reason') renderReasonStep(body);
    if (step.key === 'candidates') renderCandidatesStep(body);
    if (step.key === 'focus') renderFocusStep(body);
    if (step.key === 'micro') renderMicroStep(body);
    if (step.key === 'prompt') renderPromptStep(body);

    refs.stepCard.appendChild(head);

    // Show explore source banner if coming from explore page
    if (state.exploreSource) {
      var banner = document.createElement('div');
      banner.className = 'explore-source-banner';
      var bannerLabel = document.createElement('span');
      bannerLabel.className = 'explore-source-banner__label';
      bannerLabel.textContent = '来自探索页';
      var bannerText = document.createElement('span');
      bannerText.className = 'explore-source-banner__text';
      bannerText.textContent = state.exploreSource.category + ' · ' + state.exploreSource.title;
      banner.appendChild(bannerLabel);
      banner.appendChild(bannerText);
      refs.stepCard.appendChild(banner);
    }

    refs.stepCard.appendChild(body);
  }

  function renderWishStep(container) {
    var grid = document.createElement('div');
    grid.className = 'option-grid';

    var customWrap = document.createElement('div');
    var customInput = null;
    var customValue = state.wish && !matchesPresetWish(state.wish) ? state.wish : '';

    getWishOptions().forEach(function (option) {
      var button = document.createElement('button');
      button.type = 'button';
      var isSelected = option.custom
        ? state.templateKey === DEFAULT_TEMPLATE_KEY
        : state.templateKey === option.key;
      button.className = 'option-card' + (isSelected ? ' is-selected' : '');
      button.innerHTML = '<div class="option-card__title">' + option.label + '</div>';

      if (option.hint || option.custom) {
        button.innerHTML += '<div class="option-card__desc">' + (option.hint || '用你自己的说法') + '</div>';
      }

      button.addEventListener('click', function () {
        if (option.custom) {
          applyWish(DEFAULT_TEMPLATE_KEY, customValue || '', true);
          renderAll();
          return;
        }
        applyWish(option.key, option.wish || option.label, false);
        renderAll();
      });

      grid.appendChild(button);
    });

    container.appendChild(grid);

    customWrap.className = 'inline-editor';
    customWrap.hidden = !(state.showCustomWishInput || customValue);
    customInput = document.createElement('input');
    customInput.className = 'field-input';
    customInput.type = 'text';
    customInput.maxLength = 18;
    customInput.placeholder = '比如：起床别再乱一点';
    customInput.value = customValue;
    customInput.addEventListener('input', function () {
      customValue = customInput.value.trim();
      if (state.wish !== customValue) {
        state.wish = customValue;
        state.templateKey = DEFAULT_TEMPLATE_KEY;
        resetTemplateDependentState();
      }
      state.readyToSave = false;
    });
    customWrap.appendChild(customInput);
    container.appendChild(customWrap);

    container.appendChild(renderStepFooter({
      hint: '尽量选一个现在最想调轻一点的方向。',
      primaryText: '继续',
      canContinue: !!state.wish,
      onPrimary: function () {
        advanceFromStep(0);
      }
    }));
  }

  function renderReasonStep(container) {
    var row = document.createElement('div');
    row.className = 'choice-row';

    getReasonOptions().forEach(function (reason) {
      var button = document.createElement('button');
      button.type = 'button';
      var isSelected = state.reason === reason && state.whyNowSource === 'template';
      button.className = 'choice-pill' + (isSelected ? ' is-selected' : '');
      button.textContent = reason;
      button.addEventListener('click', function () {
        if (state.reason === reason && state.whyNowSource === 'template') {
          // Toggle off — clicking the same selected pill deselects it
          state.reason = '';
          state.whyNowSource = 'template';
        } else {
          state.reason = reason;
          state.whyNowSource = 'template';
        }
        state.readyToSave = false;
        renderAll();
      });
      row.appendChild(button);
    });

    container.appendChild(row);

    // Custom reason input
    var customWrap = document.createElement('div');
    customWrap.className = 'inline-editor';
    var customLabel = document.createElement('span');
    customLabel.className = 'helper-text';
    customLabel.textContent = '也可以用自己的话写一个原因';
    customWrap.appendChild(customLabel);
    var customInput = document.createElement('input');
    customInput.className = 'field-input';
    customInput.type = 'text';
    customInput.maxLength = 24;
    customInput.placeholder = '比如：最近总觉得晚上太散了';
    customInput.value = state.whyNowSource === 'custom' ? state.reason : '';
    customInput.addEventListener('input', function () {
      state.reason = customInput.value.trim();
      state.whyNowSource = 'custom';
      state.readyToSave = false;
      renderPreview();
    });
    customWrap.appendChild(customInput);
    container.appendChild(customWrap);

    container.appendChild(renderStepFooter({
      hint: '只保留一个最贴近现在的原因。',
      primaryText: '继续',
      canContinue: !!state.reason,
      onPrimary: function () {
        advanceFromStep(1);
      },
      onBack: function () {
        goBack();
      }
    }));
  }

  function renderCandidatesStep(container) {
    var grid = document.createElement('div');
    grid.className = 'option-grid';

    getBehaviorCards().forEach(function (card) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-card' + (state.candidates.indexOf(card.title) !== -1 ? ' is-selected' : '');
      button.innerHTML = ''
        + '<div class="option-card__title">' + card.title + '</div>'
        + '<div class="option-card__meta">' + getCategoryLabel(card.category) + '</div>'
        + '<div class="option-card__desc">' + card.description + '</div>';
      button.addEventListener('click', function () {
        toggleCandidate(card.title);
      });
      grid.appendChild(button);
    });

    container.appendChild(grid);

    if (state.candidates.length) {
      var selected = document.createElement('div');
      selected.className = 'selected-chips';
      state.candidates.forEach(function (candidate) {
        var chip = document.createElement('span');
        chip.className = 'selected-chip';
        chip.innerHTML = '<span>' + candidate + '</span>';
        var remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'selected-chip__remove';
        remove.textContent = '×';
        remove.setAttribute('aria-label', '移除 ' + candidate);
        remove.addEventListener('click', function () {
          toggleCandidate(candidate);
        });
        chip.appendChild(remove);
        selected.appendChild(chip);
      });
      container.appendChild(selected);
    }

    var customEditor = document.createElement('div');
    customEditor.className = 'inline-editor';
    customEditor.innerHTML = '<span class="helper-text">也可以自己补一个</span>';

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'field-input field-input--compact';
    input.placeholder = '比如：打开书就坐下';
    input.maxLength = 20;

    var addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'btn btn--secondary btn--small';
    addButton.textContent = '加入';
    addButton.addEventListener('click', function () {
      var value = input.value.trim();
      if (!value) return;
      addCandidate(value);
      input.value = '';
      renderAll();
    });

    customEditor.appendChild(input);
    customEditor.appendChild(addButton);
    container.appendChild(customEditor);

    container.appendChild(renderStepFooter({
      hint: '先保留 2 到 4 个可能会发生的版本。',
      primaryText: '继续',
      canContinue: state.candidates.length > 0,
      onPrimary: function () {
        ensureMapPositions();
        advanceFromStep(2);
      },
      onBack: function () {
        goBack();
      }
    }));
  }

  function renderFocusStep(container) {
    ensureMapPositions();

    var map = document.createElement('div');
    map.className = 'focus-map';

    var goldenArea = document.createElement('div');
    goldenArea.className = 'focus-map__golden';
    map.appendChild(goldenArea);

    var yAxis = document.createElement('span');
    yAxis.className = 'focus-map__axis focus-map__axis--y';
    yAxis.textContent = '更有帮助';
    map.appendChild(yAxis);

    var xAxis = document.createElement('span');
    xAxis.className = 'focus-map__axis focus-map__axis--x';
    xAxis.textContent = '更容易发生';
    map.appendChild(xAxis);

    state.candidates.forEach(function (candidate) {
      var pos = state.mapPositions[candidate];
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'map-token' + (state.goldenBehavior === candidate ? ' is-selected' : '');
      chip.textContent = candidate;
      chip.style.left = pos.x + '%';
      chip.style.top = pos.y + '%';
      chip.addEventListener('click', function () {
        setGoldenBehavior(candidate);
        renderAll();
      });
      attachDrag(chip, candidate, map);
      map.appendChild(chip);
    });

    container.appendChild(map);

    var tip = document.createElement('div');
    tip.className = 'focus-tip';
    tip.textContent = '它不是最宏大，但最容易在你现在的生活里发生。';
    container.appendChild(tip);

    container.appendChild(renderStepFooter({
      hint: state.goldenBehavior ? '现在先选这一个。' : '点一下，或拖到右上角再选它。',
      primaryText: '继续',
      canContinue: !!state.goldenBehavior,
      onPrimary: function () {
        advanceFromStep(3);
      },
      onBack: function () {
        goBack();
      }
    }));
  }

  function renderMicroStep(container) {
    var suggestions = buildMicroSuggestions();

    var grid = document.createElement('div');
    grid.className = 'option-grid';

    // If explore source has suggested actions, show a dedicated card first
    if (state.exploreSource && state.exploreSource.suggestedEntryAction) {
      var exploreCard = document.createElement('button');
      exploreCard.type = 'button';
      exploreCard.className = 'option-card micro-card micro-card--explore'
        + (state.microHabitType === 'explore-import' ? ' is-selected' : '');
      exploreCard.innerHTML = ''
        + '<span class="option-card__badge option-card__badge--explore">来自探索页</span>'
        + '<div class="option-card__title">' + state.exploreSource.title + '</div>'
        + '<div class="micro-card__pair">'
        + '  <span class="micro-card__label">入场动作</span>'
        + '  <div>' + (state.exploreSource.suggestedEntryAction || '') + '</div>'
        + '</div>'
        + '<div class="micro-card__pair">'
        + '  <span class="micro-card__label">真实动作</span>'
        + '  <div>' + (state.exploreSource.suggestedRealAction || '') + '</div>'
        + '</div>';
      exploreCard.addEventListener('click', function () {
        state.microHabitType = 'explore-import';
        state.entryAction = state.exploreSource.suggestedEntryAction || '';
        state.realAction = state.exploreSource.suggestedRealAction || '';
        state.prompt = '';
        state.promptSentence = '';
        state.promptSource = 'template';
        state.readyToSave = false;
        renderAll();
      });
      grid.appendChild(exploreCard);
    }

    suggestions.forEach(function (suggestion) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-card micro-card'
        + (state.microHabitType === suggestion.type ? ' is-selected' : '');
      button.innerHTML = ''
        + '<span class="option-card__badge">' + suggestion.badge + '</span>'
        + '<div class="option-card__title">' + suggestion.label + '</div>'
        + '<div class="micro-card__pair">'
        + '  <span class="micro-card__label">入场动作</span>'
        + '  <div>' + suggestion.entryAction + '</div>'
        + '</div>'
        + '<div class="micro-card__pair">'
        + '  <span class="micro-card__label">真实动作</span>'
        + '  <div>' + suggestion.realAction + '</div>'
        + '</div>';
      button.addEventListener('click', function () {
        applyMicroSuggestion(suggestion);
        renderAll();
      });
      grid.appendChild(button);
    });

    container.appendChild(grid);
    container.appendChild(renderStepFooter({
      hint: '目标不是最小，而是今天真能开始。',
      primaryText: '继续',
      canContinue: !!state.entryAction && !!state.realAction,
      onPrimary: function () {
        advanceFromStep(4);
      },
      onBack: function () {
        goBack();
      }
    }));
  }

  function renderPromptStep(container) {
    var promptChoices = document.createElement('div');
    promptChoices.className = 'choice-row';

    PROMPT_OPTIONS.forEach(function (prompt) {
      var button = document.createElement('button');
      button.type = 'button';
      var isSelected = state.prompt === prompt && state.promptSource === 'template';
      button.className = 'choice-pill' + (isSelected ? ' is-selected' : '');
      button.textContent = prompt;
      button.addEventListener('click', function () {
        if (state.prompt === prompt && state.promptSource === 'template') {
          // Toggle off — clicking the same selected pill deselects it
          state.prompt = '';
          state.promptSentence = '';
          state.promptSource = 'template';
        } else {
          state.prompt = prompt;
          state.promptSource = 'template';
          updatePromptSentence();
        }
        state.readyToSave = false;
        renderAll();
      });
      promptChoices.appendChild(button);
    });

    container.appendChild(promptChoices);

    var sentence = document.createElement('div');
    sentence.className = 'prompt-preview';
    sentence.textContent = state.promptSentence || '当我……之后，我就……';
    container.appendChild(sentence);

    // Custom prompt input — placed between prompt choices and strength
    var customWrap = document.createElement('div');
    customWrap.className = 'inline-editor';
    var customLabel = document.createElement('span');
    customLabel.className = 'helper-text';
    customLabel.textContent = '也可以写一个自己的提示点';
    customWrap.appendChild(customLabel);
    var customInput = document.createElement('input');
    customInput.className = 'field-input';
    customInput.type = 'text';
    customInput.maxLength = 24;
    customInput.placeholder = '比如：回到宿舍放下包以后';
    customInput.value = state.promptSource === 'custom' ? state.prompt : '';
    customInput.addEventListener('input', function () {
      state.prompt = customInput.value.trim();
      state.promptSource = 'custom';
      updatePromptSentence();
      state.readyToSave = false;
      renderPreview();
    });
    customWrap.appendChild(customInput);
    container.appendChild(customWrap);

    var strengthTitle = document.createElement('div');
    strengthTitle.className = 'status-inline';
    strengthTitle.textContent = '提示强度';
    container.appendChild(strengthTitle);

    var strengthRow = document.createElement('div');
    strengthRow.className = 'choice-row';
    PROMPT_STRENGTH_OPTIONS.forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice-pill' + (state.promptStrength === item ? ' is-selected' : '');
      button.textContent = item;
      button.addEventListener('click', function () {
        state.promptStrength = item;
        state.readyToSave = false;
        renderAll();
      });
      strengthRow.appendChild(button);
    });
    container.appendChild(strengthRow);

    container.appendChild(renderStepFooter({
      hint: '默认先用无打扰视觉提示。',
      primaryText: '先试运行 3 天',
      canContinue: !!state.promptSentence,
      onPrimary: function () {
        state.readyToSave = true;
        state.currentStep = STEP_DEFS.length - 1;
        state.revealedSegments = STEP_DEFS.length;
        renderAll();
      },
      onBack: function () {
        goBack();
      }
    }));
  }

  function renderFinalCard() {
    refs.stepCard.innerHTML = '';

    var wrap = document.createElement('div');
    wrap.className = 'final-card';

    var title = document.createElement('h2');
    title.className = 'final-card__title';
    title.textContent = '先试运行 3 天。';
    wrap.appendChild(title);

    var plan = document.createElement('div');
    plan.className = 'final-card__plan';

    appendFinalRow(plan, '愿望', state.wish);
    appendFinalRow(plan, '黄金行为', state.goldenBehavior);
    appendFinalRow(plan, '入场动作', state.entryAction);
    appendFinalRow(plan, '真实动作', state.realAction);
    appendFinalRow(plan, '自然提示', state.promptSentence);
    appendFinalRow(plan, '提示强度', state.promptStrength);
    wrap.appendChild(plan);

    var trial = document.createElement('div');
    trial.className = 'final-card__trial';
    trial.textContent = '先让它在这 3 天里轻一点、稳一点。';
    wrap.appendChild(trial);

    var actions = document.createElement('div');
    actions.className = 'final-card__actions';

    var editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'btn btn--secondary';
    editButton.textContent = '回去改一改';
    editButton.addEventListener('click', function () {
      state.readyToSave = false;
      state.currentStep = STEP_DEFS.length - 1;
      renderAll();
    });

    var saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'btn btn--primary btn--large';
    saveButton.textContent = '让它开始流动';
    saveButton.addEventListener('click', saveHabit);

    actions.appendChild(editButton);
    actions.appendChild(saveButton);
    wrap.appendChild(actions);

    var note = document.createElement('p');
    note.className = 'save-note';
    note.textContent = '会保存在本地，并回到花园首页。';
    wrap.appendChild(note);

    refs.stepCard.appendChild(wrap);
  }

  function appendFinalRow(container, key, value) {
    var row = document.createElement('div');
    row.className = 'final-card__row';
    row.innerHTML = '<div class="final-card__key">' + key + '</div><div class="final-card__value">' + value + '</div>';
    container.appendChild(row);
  }

  function renderPreview() {
    refs.planPreview.innerHTML = '';

    var badgeText = state.readyToSave
      ? '可以开始流动了'
      : '正在设计第 ' + (state.currentStep + 1) + ' 段';
    refs.previewBadge.textContent = badgeText;

    var blocks = [
      { label: '愿望', value: state.wish || '还没放下' },
      { label: '为什么现在', value: state.reason || '还没选' },
      { label: '候选行为', chips: state.candidates },
      { label: '黄金行为', value: state.goldenBehavior || '还没挑出来' },
      { label: '入场动作', value: state.entryAction || '还没生成' },
      { label: '真实动作', value: state.realAction || '还没生成' },
      { label: '自然提示', value: state.promptSentence || '当我……之后，我就……' },
      { label: '提示强度', value: state.promptStrength || '无打扰视觉提示' }
    ];

    blocks.forEach(function (block) {
      var card = document.createElement('div');
      var isEmpty = !block.chips && isPreviewEmpty(block.label, block.value);
      card.className = 'preview-block' + (isEmpty ? ' is-empty' : '');

      var label = document.createElement('span');
      label.className = 'preview-block__label';
      label.textContent = block.label;
      card.appendChild(label);

      if (block.chips) {
        var chipWrap = document.createElement('div');
        chipWrap.className = 'preview-chip-list';
        if (block.chips.length) {
          block.chips.forEach(function (chipText) {
            var chip = document.createElement('span');
            chip.className = 'preview-chip';
            chip.textContent = chipText;
            chipWrap.appendChild(chip);
          });
        } else {
          var empty = document.createElement('div');
          empty.className = 'preview-block__value';
          empty.textContent = '还没挑';
          card.classList.add('is-empty');
          card.appendChild(empty);
        }
        if (block.chips.length) {
          card.appendChild(chipWrap);
        }
      } else {
        var value = document.createElement('div');
        value.className = 'preview-block__value';
        value.textContent = block.value;
        card.appendChild(value);
      }

      refs.planPreview.appendChild(card);
    });
  }

  function renderStepFooter(options) {
    var footer = document.createElement('div');
    footer.className = 'step-footer';

    var hint = document.createElement('span');
    hint.className = 'step-footer__hint';
    hint.textContent = options.hint || '';
    footer.appendChild(hint);

    var actions = document.createElement('div');
    actions.className = 'step-actions';

    if (options.onBack) {
      var backButton = document.createElement('button');
      backButton.type = 'button';
      backButton.className = 'btn btn--ghost';
      backButton.textContent = '返回';
      backButton.addEventListener('click', options.onBack);
      actions.appendChild(backButton);
    }

    var primaryButton = document.createElement('button');
    primaryButton.type = 'button';
    primaryButton.className = 'btn btn--primary';
    primaryButton.textContent = options.primaryText || '继续';
    primaryButton.disabled = !options.canContinue;
    if (!options.canContinue) {
      primaryButton.style.opacity = '0.45';
      primaryButton.style.cursor = 'not-allowed';
    } else {
      primaryButton.addEventListener('click', options.onPrimary);
    }
    actions.appendChild(primaryButton);

    footer.appendChild(actions);
    return footer;
  }

  function advanceFromStep(stepIndex) {
    state.currentStep = Math.min(stepIndex + 1, STEP_DEFS.length - 1);
    state.revealedSegments = Math.max(state.revealedSegments, stepIndex + 2);
    renderAll();
  }

  function goBack() {
    state.currentStep = Math.max(0, state.currentStep - 1);
    state.revealedSegments = state.currentStep + 1;
    state.readyToSave = false;
    renderAll();
  }

  function furthestAvailableStep() {
    if (state.readyToSave) return STEP_DEFS.length - 1;
    return maxOpenStep();
  }

  function maxOpenStep() {
    if (isStepComplete(4) && isStepComplete(5)) return 5;
    if (isStepComplete(4)) return 5;
    if (isStepComplete(3)) return 4;
    if (isStepComplete(2)) return 3;
    if (isStepComplete(1)) return 2;
    if (isStepComplete(0)) return 1;
    return 0;
  }

  function isStepComplete(index) {
    if (index === 0) return !!state.wish;
    if (index === 1) return !!state.reason;
    if (index === 2) return state.candidates.length > 0;
    if (index === 3) return !!state.goldenBehavior;
    if (index === 4) return !!state.microHabitType && !!state.entryAction && !!state.realAction;
    if (index === 5) return !!state.prompt && !!state.promptSentence;
    return false;
  }

  function getStepQuestion(key) {
    if (key === 'wish') return '你想让什么变得容易一点？';
    if (key === 'reason') return '为什么是现在？';
    if (key === 'candidates') return '它可能怎么发生？';
    if (key === 'focus') return '哪个最值得先开始？';
    if (key === 'micro') return '把它变成今天能开始的版本。';
    if (key === 'prompt') return '什么时候最容易发生？';
    return '';
  }

  function getStepHelper(key) {
    if (key === 'wish') return '先选一个方向，不用说得很完整。';
    if (key === 'reason') return '只保留眼前最真实的那个原因。';
    if (key === 'candidates') return '挑几个你真能想象它会发生的版本。';
    if (key === 'focus') return '先找那个最容易落在现在生活里的动作。';
    if (key === 'micro') return '不是做很多，而是更容易启动。';
    if (key === 'prompt') return '把它挂在已经会发生的时刻后面。';
    return '';
  }

  function matchesPresetWish(value) {
    return getWishOptions().some(function (item) {
      return item.label === value && !item.custom;
    });
  }

  function getTemplateKeys() {
    if (Array.isArray(state.templateData.order) && state.templateData.order.length) {
      return state.templateData.order;
    }
    return Object.keys(state.templateData.templates || {});
  }

  function getTemplateByKey(key) {
    var templates = state.templateData.templates || FALLBACK_TEMPLATE_DATA.templates;
    return templates[key] || templates[DEFAULT_TEMPLATE_KEY] || FALLBACK_TEMPLATE_DATA.templates.custom;
  }

  function getCurrentTemplate() {
    return getTemplateByKey(state.templateKey || DEFAULT_TEMPLATE_KEY);
  }

  function getWishOptions() {
    return getTemplateKeys().map(function (key) {
      var template = getTemplateByKey(key);
      return {
        key: key,
        label: template.label || key,
        wish: template.wish || template.label || '',
        hint: template.hint || '',
        custom: !!template.custom
      };
    });
  }

  function getReasonOptions() {
    var template = getCurrentTemplate();
    return Array.isArray(template.why_now) && template.why_now.length
      ? template.why_now
      : FALLBACK_TEMPLATE_DATA.templates.custom.why_now;
  }

  function getBehaviorCards() {
    var template = getCurrentTemplate();
    var cards = Array.isArray(template.how_it_happens)
      ? template.how_it_happens
      : FALLBACK_TEMPLATE_DATA.templates.custom.how_it_happens;
    return cards.map(normalizeBehaviorCard).slice(0, 8);
  }

  function getCategoryLabel(key) {
    return CATEGORY_LABELS[key] || '灵感';
  }

  function normalizeBehaviorCard(card, index) {
    if (typeof card === 'string') {
      return {
        id: state.templateKey + '_behavior_' + index,
        category: inferCategoryFromText(card),
        title: card,
        description: '先让它更容易发生。',
        microType: inferMicroTypeFromText(card)
      };
    }
    return {
      id: card.id || state.templateKey + '_behavior_' + index,
      category: card.category || inferCategoryFromText(card.title || ''),
      title: card.title || '',
      description: card.description || '先让它更容易发生。',
      microType: card.microType || inferMicroTypeFromText(card.title || '')
    };
  }

  function inferCategoryFromText(text) {
    if (text.indexOf('只做入场动作') !== -1 || text.indexOf('先躺到') !== -1) return 'entry-only';
    if (text.indexOf('放到') !== -1 || text.indexOf('收起来') !== -1 || text.indexOf('关掉') !== -1) return 'change-environment';
    if (text.indexOf('后') !== -1 || text.indexOf('时') !== -1) return 'chain-existing';
    if (text.indexOf('先') !== -1 || text.indexOf('打开') !== -1 || text.indexOf('穿上') !== -1) return 'preparation-action';
    return 'reduce-friction';
  }

  function inferMicroTypeFromText(text) {
    if (text.indexOf('只做入场动作') !== -1 || text.indexOf('不要求') !== -1) return 'entry-only';
    if (text.indexOf('先坐') !== -1 || text.indexOf('走到') !== -1 || text.indexOf('回到') !== -1) return 'scene-transition';
    if (text.indexOf('一页') !== -1 || text.indexOf('一行') !== -1 || text.indexOf('2 分钟') !== -1) return 'quantity-reduction';
    return 'preparation-action';
  }

  function toggleCandidate(value) {
    var index = state.candidates.indexOf(value);
    if (index === -1) {
      state.candidates.push(value);
    } else {
      state.candidates.splice(index, 1);
      if (state.goldenBehavior === value) {
        resetAfter('focus');
      }
    }
    state.readyToSave = false;
    ensureMapPositions();
    renderAll();
  }

  function addCandidate(value) {
    if (state.candidates.indexOf(value) === -1) {
      state.candidates.push(value);
      ensureMapPositions();
    }
  }

  function resetAfter(stepKey) {
    if (stepKey === 'focus') {
      state.goldenBehavior = '';
      state.microHabitType = '';
      state.entryAction = '';
      state.realAction = '';
      state.prompt = '';
      state.promptSentence = '';
      state.promptSource = 'template';
      state.promptStrength = '无打扰视觉提示';
      state.readyToSave = false;
      return;
    }
    if (stepKey === 'micro') {
      state.microHabitType = '';
      state.entryAction = '';
      state.realAction = '';
      state.prompt = '';
      state.promptSentence = '';
      state.promptSource = 'template';
      state.promptStrength = '无打扰视觉提示';
      state.readyToSave = false;
      return;
    }
  }

  function resetTemplateDependentState() {
    state.reason = '';
    state.whyNowSource = 'template';
    state.candidates = [];
    state.goldenBehavior = '';
    state.microHabitType = '';
    state.entryAction = '';
    state.realAction = '';
    state.prompt = '';
    state.promptSentence = '';
    state.promptSource = 'template';
    state.promptStrength = '无打扰视觉提示';
    state.mapPositions = {};
    state.readyToSave = false;
  }

  function applyWish(templateKey, value, isCustom) {
    var changed = state.wish !== value
      || state.templateKey !== templateKey
      || state.showCustomWishInput !== !!isCustom;
    state.templateKey = templateKey || DEFAULT_TEMPLATE_KEY;
    state.wish = value;
    state.showCustomWishInput = !!isCustom;
    if (changed) {
      resetTemplateDependentState();
    }
    state.readyToSave = false;
  }

  function setGoldenBehavior(value) {
    if (state.goldenBehavior !== value) {
      state.goldenBehavior = value;
      resetAfter('micro');
    } else {
      state.goldenBehavior = value;
      state.readyToSave = false;
    }
  }

  function applyMicroSuggestion(suggestion) {
    var changed = state.microHabitType !== suggestion.type
      || state.entryAction !== suggestion.entryAction
      || state.realAction !== suggestion.realAction;
    state.microHabitType = suggestion.type;
    state.entryAction = suggestion.entryAction;
    state.realAction = suggestion.realAction;
    if (changed) {
      state.prompt = '';
      state.promptSentence = '';
      state.promptSource = 'template';
    }
    state.readyToSave = false;
  }

  function ensureMapPositions() {
    var next = {};
    state.candidates.forEach(function (candidate, index) {
      var old = state.mapPositions[candidate];
      if (old) {
        next[candidate] = old;
        return;
      }
      var seed = candidate.length * 17 + index * 29;
      next[candidate] = {
        x: clamp(26 + (seed % 48), 16, 86),
        y: clamp(66 - (seed % 34), 14, 82)
      };
    });
    state.mapPositions = next;
  }

  function attachDrag(element, candidate, container) {
    element.addEventListener('pointerdown', function (event) {
      dragState = {
        candidate: candidate,
        container: container,
        element: element,
        pointerId: event.pointerId
      };
      element.classList.add('is-dragging');
      if (element.setPointerCapture) {
        element.setPointerCapture(event.pointerId);
      }
    });

    element.addEventListener('pointermove', function (event) {
      if (!dragState || dragState.candidate !== candidate) return;
      var rect = container.getBoundingClientRect();
      var x = clamp(((event.clientX - rect.left) / rect.width) * 100, 12, 88);
      var y = clamp(((event.clientY - rect.top) / rect.height) * 100, 12, 88);
      state.mapPositions[candidate] = { x: x, y: y };
      element.style.left = x + '%';
      element.style.top = y + '%';
      if (x > 62 && y < 40) {
        setGoldenBehavior(candidate);
        renderPreview();
      }
    });

    element.addEventListener('pointerup', function (event) {
      if (!dragState || dragState.candidate !== candidate) return;
      element.classList.remove('is-dragging');
      if (element.releasePointerCapture) {
        try {
          element.releasePointerCapture(event.pointerId);
        } catch (error) {
          // ignore pointer capture mismatch
        }
      }
      if (!state.goldenBehavior) {
        setGoldenBehavior(candidate);
      }
      dragState = null;
      renderAll();
    });
  }

  function buildMicroSuggestions() {
    var template = getCurrentTemplate();
    var suggestions = Array.isArray(template.starter_versions)
      ? template.starter_versions
      : FALLBACK_TEMPLATE_DATA.templates.custom.starter_versions;
    return suggestions.map(normalizeStarterVersion);
  }

  function normalizeStarterVersion(item, index) {
    if (typeof item === 'string') {
      var parts = item.split('：');
      var label = parts[0] || '轻启动型';
      var action = parts.slice(1).join('：') || item;
      return {
        type: starterTypeFromLabel(label, index),
        label: label,
        badge: starterBadgeFromLabel(label),
        entryAction: action,
        realAction: action
      };
    }
    return {
      type: item.type || starterTypeFromLabel(item.label || '', index),
      label: item.label || '轻启动型',
      badge: item.badge || starterBadgeFromLabel(item.label || ''),
      entryAction: item.entryAction || item.entry || '',
      realAction: item.realAction || item.real || item.entryAction || ''
    };
  }

  function starterTypeFromLabel(label, index) {
    if (label.indexOf('数量') !== -1) return 'quantity-reduction';
    if (label.indexOf('场景') !== -1) return 'scene-transition';
    if (label.indexOf('准备') !== -1) return 'preparation-action';
    if (label.indexOf('环境') !== -1) return 'environment-adjustment';
    if (label.indexOf('微动作') !== -1) return 'micro-action';
    if (label.indexOf('入场') !== -1) return 'entry-only';
    if (label.indexOf('拆分') !== -1) return 'task-splitting';
    if (label.indexOf('轻启动') !== -1) return 'light-start';
    return 'starter-' + index;
  }

  function starterBadgeFromLabel(label) {
    if (label.indexOf('数量') !== -1) return '更轻一点';
    if (label.indexOf('场景') !== -1) return '先到现场';
    if (label.indexOf('准备') !== -1) return '先准备好';
    if (label.indexOf('环境') !== -1) return '调轻环境';
    if (label.indexOf('微动作') !== -1) return '小一步';
    if (label.indexOf('入场') !== -1) return '先入场';
    if (label.indexOf('拆分') !== -1) return '拆小一点';
    return '轻一点';
  }

  function updatePromptSentence() {
    if (!state.prompt || !state.entryAction) {
      state.promptSentence = '';
      return;
    }
    state.promptSentence = buildPromptSentence(state.prompt, state.entryAction);
  }

  function buildPromptSentence(prompt, action) {
    if (/[后前里内外旁边]$/.test(prompt)) {
      return '当我' + prompt + '，我就' + action + '。';
    }
    return '当我' + prompt + '之后，我就' + action + '。';
  }

  function saveHabit() {
    updatePromptSentence();

    var habit = {
      id: 'habit_' + Date.now(),
      templateKey: state.templateKey || DEFAULT_TEMPLATE_KEY,
      wish: state.wish,
      reason: state.reason,
      whyNowSource: state.whyNowSource || 'template',
      candidates: state.candidates.slice(),
      goldenBehavior: state.goldenBehavior,
      microHabitType: state.microHabitType,
      entryAction: state.entryAction,
      realAction: state.realAction,
      prompt: state.prompt,
      promptSentence: state.promptSentence,
      promptSource: state.promptSource || 'template',
      promptStrength: state.promptStrength || '无打扰视觉提示',
      trialDays: 3,
      createdAt: getTodayISO(),
      records: [],
      adjustments: [],
      exploreDraftSource: state.exploreSource ? {
        category: state.exploreSource.category,
        title: state.exploreSource.title
      } : null
    };

    if (window.AppState && typeof window.AppState.addHabit === 'function') {
      window.AppState.addHabit(habit);
      if (typeof window.AppState.setSelectedHabitId === 'function') {
        window.AppState.setSelectedHabitId(habit.id);
      }
    } else {
      var habits = safeGetHabits();
      habits.push(habit);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
      localStorage.setItem('habitGarden.selectedHabitId', habit.id);
    }

    window.location.href = 'index.html';
  }

  function safeGetHabits() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function getTodayISO() {
    if (window.AppState && typeof window.AppState.getTodayISO === 'function') {
      return window.AppState.getTodayISO();
    }
    var date = new Date();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
  }

  function loadExploreDraft() {
    try {
      var raw = localStorage.getItem('habitGarden.exploreIdea');
      if (!raw) return;
      var draft = JSON.parse(raw);
      // Clear draft after reading so it doesn't persist on refresh
      localStorage.removeItem('habitGarden.exploreIdea');

      // Only process drafts with the correct source marker
      if (draft.source !== 'explore') return;
      if (!draft.title) return;

      // Store explore source for display and later use — never as wish
      state.exploreSource = {
        category: draft.category || '',
        title: draft.title || '',
        designHint: draft.designHint || '',
        starterType: draft.starterType || '',
        suggestedEntryAction: draft.suggestedEntryAction || '',
        suggestedRealAction: draft.suggestedRealAction || '',
        suggestedPrompt: draft.suggestedPrompt || ''
      };

      // Pre-fill micro-habit fields as suggestions only
      if (draft.suggestedEntryAction) {
        state.entryAction = draft.suggestedEntryAction;
      }
      if (draft.suggestedRealAction) {
        state.realAction = draft.suggestedRealAction;
      }
      if (draft.suggestedPrompt) {
        state.prompt = draft.suggestedPrompt;
        state.promptSource = 'custom';
        updatePromptSentence();
      }

      // Mark as explore-import so the micro step can highlight the source card
      state.microHabitType = 'explore-import';

      state.readyToSave = false;
    } catch (e) {
      // Ignore malformed draft
    }
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isPreviewEmpty(label, value) {
    if (label === '愿望') return value === '还没放下';
    if (label === '为什么现在') return value === '还没选';
    if (label === '黄金行为') return value === '还没挑出来';
    if (label === '入场动作' || label === '真实动作') return value === '还没生成';
    if (label === '自然提示') return value === '当我……之后，我就……';
    return false;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
