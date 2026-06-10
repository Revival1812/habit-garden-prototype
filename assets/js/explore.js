(function () {
  'use strict';

  var root = null;

  var fallbackData = {
    categories: [
      {
        key: 'reduce-friction',
        label: '降低阻力',
        hint: '让下一步更轻一点。'
      },
      {
        key: 'change-environment',
        label: '改变环境',
        hint: '让周围先帮你一点。'
      },
      {
        key: 'chain-existing',
        label: '绑定已有动作',
        hint: '挂在自然会发生的事后面。'
      },
      {
        key: 'entry-only',
        label: '只做入场动作',
        hint: '先让第一步出现。'
      }
    ],
    cards: [
      {
        id: 'b01',
        category: 'reduce-friction',
        title: '把书放在枕边',
        description: '伸手就能拿到。'
      },
      {
        id: 'b02',
        category: 'reduce-friction',
        title: '只读一页',
        description: '先翻开就好。'
      },
      {
        id: 'b03',
        category: 'change-environment',
        title: '把零食收远一点',
        description: '看不见时更轻松。'
      },
      {
        id: 'b04',
        category: 'change-environment',
        title: '提前放好运动鞋',
        description: '让出门近一点。'
      },
      {
        id: 'b05',
        category: 'chain-existing',
        title: '刷牙后喝一杯水',
        description: '接在已经稳定的动作后。'
      },
      {
        id: 'b06',
        category: 'chain-existing',
        title: '晚饭后坐到书桌前',
        description: '先坐过去。'
      },
      {
        id: 'b07',
        category: 'entry-only',
        title: '打开台灯',
        description: '只做这一小步。'
      },
      {
        id: 'b08',
        category: 'entry-only',
        title: '穿上运动鞋',
        description: '先让身体到场。'
      }
    ]
  };

  var glowMessages = [
    '有人今天也只是完成了第一步。',
    '有人把计划调轻了一点。',
    '有人中断后又回来了。'
  ];

  function init() {
    root = document.getElementById('explore-root');
    if (!root) return;

    loadBehaviorData().then(function (data) {
      render(data);
    });
  }

  function loadBehaviorData() {
    if (window.location.protocol === 'file:') {
      return Promise.resolve(fallbackData);
    }

    return fetch('data/behavior-cards.json')
      .then(function (response) {
        if (!response.ok) throw new Error('behavior cards unavailable');
        return response.json();
      })
      .then(function (json) {
        if (!json || !Array.isArray(json.cards) || !Array.isArray(json.categories)) {
          return fallbackData;
        }
        return normalizeData(json);
      })
      .catch(function () {
        return fallbackData;
      });
  }

  function normalizeData(data) {
    var labelMap = {
      'reduce-friction': '降低阻力',
      'change-environment': '改变环境',
      'chain-existing': '绑定已有动作',
      'entry-only': '只做入场动作'
    };

    var hintMap = {
      'reduce-friction': '让下一步更轻一点。',
      'change-environment': '让周围先帮你一点。',
      'chain-existing': '挂在自然会发生的事后面。',
      'entry-only': '先让第一步出现。'
    };

    var fallbackById = {};
    fallbackData.cards.forEach(function (card) {
      fallbackById[card.id] = card;
    });

    return {
      categories: fallbackData.categories.map(function (category) {
        return {
          key: category.key,
          label: labelMap[category.key] || category.label,
          hint: hintMap[category.key] || category.hint
        };
      }),
      cards: data.cards.map(function (card) {
        var fallback = fallbackById[card.id] || {};
        return {
          id: card.id,
          category: card.category,
          title: fallback.title || card.title,
          description: fallback.description || card.description
        };
      })
    };
  }

  function render(data) {
    root.innerHTML = '';
    root.appendChild(renderHeader());

    var layout = document.createElement('section');
    layout.className = 'explore-layout';
    layout.setAttribute('aria-label', '自由探索');

    layout.appendChild(renderLibrary(data));
    layout.appendChild(renderGlowWall());
    root.appendChild(layout);
  }

  function renderHeader() {
    var header = document.createElement('header');
    header.className = 'explore-head';

    var titleWrap = document.createElement('div');
    var kicker = document.createElement('span');
    kicker.className = 'explore-kicker';
    kicker.textContent = '自由探索';

    var title = document.createElement('h1');
    title.className = 'explore-title';
    title.textContent = '找一个更容易开始的方式。';

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

  function renderLibrary(data) {
    var section = document.createElement('section');
    section.className = 'explore-library';

    data.categories.forEach(function (category) {
      var group = document.createElement('article');
      group.className = 'inspiration-group';

      var head = document.createElement('div');
      head.className = 'inspiration-group__head';

      var title = document.createElement('h2');
      title.textContent = category.label;

      var hint = document.createElement('p');
      hint.textContent = category.hint;

      head.appendChild(title);
      head.appendChild(hint);
      group.appendChild(head);

      var list = document.createElement('div');
      list.className = 'inspiration-list';

      data.cards
        .filter(function (card) {
          return card.category === category.key;
        })
        .forEach(function (card) {
          list.appendChild(renderInspirationCard(card, category));
        });

      group.appendChild(list);
      section.appendChild(group);
    });

    return section;
  }

  function renderInspirationCard(card, category) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'inspiration-card';
    button.setAttribute('aria-label', '带着灵感去创建：' + card.title);

    var title = document.createElement('span');
    title.className = 'inspiration-card__title';
    title.textContent = card.title;

    var copy = document.createElement('span');
    copy.className = 'inspiration-card__copy';
    copy.textContent = card.description;

    var action = document.createElement('span');
    action.className = 'inspiration-card__action';
    action.textContent = '带着它去设计';

    button.appendChild(title);
    button.appendChild(copy);
    button.appendChild(action);

    button.addEventListener('click', function () {
      saveExploreIdea(card, category);
      window.location.href = 'create.html';
    });

    return button;
  }

  function renderGlowWall() {
    var aside = document.createElement('aside');
    aside.className = 'glow-wall';
    aside.setAttribute('aria-label', '匿名微光墙');

    var title = document.createElement('h2');
    title.textContent = '匿名微光墙';

    var list = document.createElement('div');
    list.className = 'glow-list';

    glowMessages.forEach(function (message, index) {
      var item = document.createElement('p');
      item.className = 'glow-message';
      item.style.animationDelay = (index * 0.12) + 's';
      item.textContent = message;
      list.appendChild(item);
    });

    aside.appendChild(title);
    aside.appendChild(list);
    return aside;
  }

  function saveExploreIdea(card, category) {
    var idea = {
      id: card.id,
      title: card.title,
      description: card.description,
      category: category.key,
      categoryLabel: category.label,
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('habitGarden.exploreIdea', JSON.stringify(idea));
    } catch (error) {
      // Navigation still works when localStorage is unavailable.
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
