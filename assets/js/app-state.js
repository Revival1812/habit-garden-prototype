/* ========================================
   app-state.js — localStorage state mgmt
   ======================================== */

(function () {
  /* ----- localStorage keys ----- */
  var KEYS = {
    habits: 'habitGarden.habits',
    selectedHabitId: 'habitGarden.selectedHabitId',
    userTone: 'habitGarden.userTone',
    lastVisit: 'habitGarden.lastVisit'
  };

  var demoHabitsFallback = [
    {
      id: 'habit_demo_01',
      wish: '减少熬夜后的疲惫感',
      reason: '最近学习效率下降',
      goldenBehavior: '晚饭后坐到书桌前',
      microHabitType: 'scene-transition',
      entryAction: '打开台灯并坐下',
      realAction: '学习 10 分钟',
      prompt: '晚饭后回到宿舍',
      promptSentence: '当我晚饭后回到宿舍之后，我就打开台灯并坐下。',
      trialDays: 3,
      createdAt: '2026-06-08',
      records: [
        { date: '2026-06-08', status: 'real', note: '完成了真实行动' },
        { date: '2026-06-09', status: 'entry', note: '完成了入场动作，今天累了' },
        { date: '2026-06-10', status: 'missed', reason: '太累了', note: '今天卡在太累了' }
      ],
      adjustments: []
    },
    {
      id: 'habit_demo_02',
      wish: '每天读一点书',
      reason: '想给自己一点秩序',
      goldenBehavior: '睡前读一页书',
      microHabitType: 'quantity-reduction',
      entryAction: '拿起书并翻开',
      realAction: '读 1 页',
      prompt: '睡前',
      promptSentence: '当我睡前躺在床上的时候，我就拿起书并翻开。',
      trialDays: 3,
      createdAt: '2026-06-09',
      records: [
        { date: '2026-06-09', status: 'real', note: '读了两页' },
        { date: '2026-06-10', status: 'entry', note: '翻开书但太困了' }
      ],
      adjustments: []
    }
  ];

  /* ----- helpers ----- */
  function safeGetJSON(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function safeSetJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ----- habits CRUD ----- */
  function getHabits() {
    return safeGetJSON(KEYS.habits) || [];
  }

  function saveHabits(habits) {
    return safeSetJSON(KEYS.habits, habits);
  }

  function addHabit(habit) {
    var habits = getHabits();
    habits.push(habit);
    saveHabits(habits);
    return habit;
  }

  function updateHabit(id, patch) {
    var habits = getHabits();
    for (var i = 0; i < habits.length; i++) {
      if (habits[i].id === id) {
        Object.assign(habits[i], patch);
        saveHabits(habits);
        return habits[i];
      }
    }
    return null;
  }

  function getHabitById(id) {
    var habits = getHabits();
    for (var i = 0; i < habits.length; i++) {
      if (habits[i].id === id) return habits[i];
    }
    return null;
  }

  /* ----- selected habit ----- */
  function getSelectedHabit() {
    var id = localStorage.getItem(KEYS.selectedHabitId);
    if (!id) return null;
    return getHabitById(id) || null;
  }

  function setSelectedHabitId(id) {
    localStorage.setItem(KEYS.selectedHabitId, id);
  }

  /* ----- records ----- */
  function getTodayISO() {
    var d = new Date();
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
  }

  function addRecord(habitId, record) {
    var habit = getHabitById(habitId);
    if (!habit) return null;

    // upsert: replace record for same date
    var found = false;
    for (var i = 0; i < habit.records.length; i++) {
      if (habit.records[i].date === record.date) {
        habit.records[i] = record;
        found = true;
        break;
      }
    }
    if (!found) {
      habit.records.push(record);
    }

    updateHabit(habitId, { records: habit.records });
    return habit;
  }

  /* ----- seed demo data ----- */
  function seedDemoDataIfEmpty() {
    if (getHabits().length > 0) return false;

    var demo;

    // try to load demo-habits.json
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'data/demo-habits.json', false); // sync
      xhr.send();
      if (xhr.status >= 200 && xhr.status < 300) {
        var json = JSON.parse(xhr.responseText);
        demo = (json && json.habits) ? json.habits : null;
      }
    } catch (e) {
      demo = null;
    }

    if (!demo || !demo.length) {
      demo = demoHabitsFallback;
    }

    saveHabits(demo);
    return demo;
  }

  /* ----- user tone ----- */
  function getUserTone() {
    return localStorage.getItem(KEYS.userTone) || '';
  }

  function setUserTone(tone) {
    localStorage.setItem(KEYS.userTone, tone);
  }

  /* ----- visit ----- */
  function markVisit() {
    localStorage.setItem(KEYS.lastVisit, getTodayISO());
  }

  function getLastVisit() {
    return localStorage.getItem(KEYS.lastVisit) || '';
  }

  /* ----- expose ----- */
  window.AppState = {
    getHabits: getHabits,
    saveHabits: saveHabits,
    addHabit: addHabit,
    updateHabit: updateHabit,
    getHabitById: getHabitById,
    getSelectedHabit: getSelectedHabit,
    setSelectedHabitId: setSelectedHabitId,
    addRecord: addRecord,
    getTodayISO: getTodayISO,
    seedDemoDataIfEmpty: seedDemoDataIfEmpty,
    getUserTone: getUserTone,
    setUserTone: setUserTone,
    markVisit: markVisit,
    getLastVisit: getLastVisit
  };
})();
