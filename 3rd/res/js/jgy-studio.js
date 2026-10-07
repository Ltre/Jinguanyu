/**
 * JGY Studio UI / Plugin Host
 * ---------------------------
 * 目标：只增强旧金馆鱼玩具的 UI 与扩展性，不重写 m0~m20。
 *
 * 开发者最常用的两个入口：
 *   1. 新增动作：JGYStudio.registerPlugin({...})
 *   2. 新增插件文件：放进 /plugins/，再在 404.html 底部加一个 <script>。
 */
(function () {
  'use strict';

  var VERSION = '2026.10.07';
  var studio = window.JGYStudio = window.JGYStudio || {};
  var state = studio.state = studio.state || {
    actors: [],
    selectedActorIds: [],
    plugins: []
  };

  function q(selector, root) { return (root || document).querySelector(selector); }
  function qa(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (typeof text === 'string') node.textContent = text;
    return node;
  }

  function toast(message) {
    var node = q('.jgy-toast');
    if (!node) {
      node = el('div', 'jgy-toast');
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.classList.add('is-on');
    clearTimeout(node._jgyTimer);
    node._jgyTimer = setTimeout(function () { node.classList.remove('is-on'); }, 1600);
  }

  function parseLegacyIndex(button) {
    var match = String(button.textContent || '').trim().match(/^(\d+)\s*[、.：:]/);
    return match ? parseInt(match[1], 10) : -1;
  }

  function getSelectedActors() {
    return state.actors.filter(function (actor) {
      return state.selectedActorIds.indexOf(actor.id) !== -1;
    });
  }

  function randomSelectedActorSrc() {
    var selected = getSelectedActors();
    if (!selected.length) return null;
    return selected[Math.floor(Math.random() * selected.length)].src;
  }

  /**
   * 对 Jinguanyu 做“选择演员”这一层极薄的兼容包装：
   * - 未选择任何演员：完全交给旧构造器，旧随机池行为不变。
   * - 选择了演员，且调用方没有显式传 src：从用户选中的演员里随机出演。
   * - 调用方显式传了 src / DOM：原样传给旧构造器。
   */
  function installActorHook() {
    if (studio.LegacyJinguanyu || typeof window.Jinguanyu !== 'function') return;

    var LegacyJinguanyu = window.Jinguanyu;
    studio.LegacyJinguanyu = LegacyJinguanyu;

    window.Jinguanyu = function JinguanyuWithCast(id, x, y, src) {
      var useSrc = src;
      var hasExplicitSrc = arguments.length >= 4 && src !== undefined && src !== null;
      if (!hasExplicitSrc) {
        var selected = randomSelectedActorSrc();
        if (selected) useSrc = selected;
      }
      return new LegacyJinguanyu(id, x, y, useSrc);
    };
  }

  function actorId() {
    return 'actor-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function addActor(src, name, origin) {
    if (!src) return null;
    var existing = state.actors.filter(function (a) { return a.src === src; })[0];
    if (existing) return existing;

    var actor = {
      id: actorId(),
      src: src,
      name: name || '未命名演员',
      origin: origin || 'url'
    };
    state.actors.push(actor);
    state.selectedActorIds.push(actor.id);
    renderActors();
    return actor;
  }

  function removeImportedActors() {
    state.actors.forEach(function (actor) {
      if (actor.origin === 'file' && /^blob:/.test(actor.src)) {
        try { URL.revokeObjectURL(actor.src); } catch (e) {}
      }
    });
    state.actors = [];
    state.selectedActorIds = [];
    renderActors();
    toast('演员池已清空，恢复旧版随机出演');
  }

  function toggleActor(id) {
    var at = state.selectedActorIds.indexOf(id);
    if (at === -1) state.selectedActorIds.push(id);
    else state.selectedActorIds.splice(at, 1);
    renderActors();
  }

  function renderActors() {
    var list = q('.jgy-cast-list');
    var status = q('[data-jgy-cast-status]');
    if (!list) return;

    list.innerHTML = '';
    if (!state.actors.length) {
      var empty = el('div', 'jgy-empty');
      empty.innerHTML = '还没有自定义演员。<br>导入 GIF / PNG / JPG / WEBP，或粘贴图片 URL。<br><b>不导入 = 旧版随机表情包逻辑完全不变。</b>';
      list.appendChild(empty);
    } else {
      state.actors.forEach(function (actor) {
        var card = el('button', 'jgy-actor-card');
        card.type = 'button';
        card.title = actor.name;
        card.setAttribute('aria-label', '选择演员：' + actor.name);
        if (state.selectedActorIds.indexOf(actor.id) !== -1) card.classList.add('is-selected');

        var img = document.createElement('img');
        img.src = actor.src;
        img.alt = actor.name;
        card.appendChild(img);
        card.addEventListener('click', function () { toggleActor(actor.id); });
        list.appendChild(card);
      });
    }

    if (status) {
      status.textContent = state.selectedActorIds.length
        ? ('已选 ' + state.selectedActorIds.length + ' / ' + state.actors.length)
        : '旧版随机模式';
    }
  }

  function makeSection(title, meta, className) {
    var section = el('section', 'jgy-section ' + (className || ''));
    var label = el('div', 'jgy-section-label');
    label.appendChild(el('strong', '', title));
    label.appendChild(el('span', '', meta || ''));
    section.appendChild(label);
    return section;
  }

  function buildCastSection() {
    var section = makeSection('出演 / CAST', 'IMPORT · SELECT · RANDOM', 'jgy-cast-section');

    var toolbar = el('div', 'jgy-cast-toolbar');
    var input = el('input', 'jgy-url-input');
    input.type = 'url';
    input.placeholder = '粘贴图片 / GIF URL…';
    input.setAttribute('aria-label', '演员图片 URL');

    var add = el('button', 'jgy-soft-btn', '＋ URL');
    add.type = 'button';
    add.addEventListener('click', function () {
      var value = input.value.trim();
      if (!value) return;
      addActor(value, value.split('/').pop() || 'URL 演员', 'url');
      input.value = '';
      toast('演员已加入，并默认选中');
    });
    input.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') add.click();
    });

    toolbar.appendChild(input);
    toolbar.appendChild(add);
    section.appendChild(toolbar);

    var actions = el('div', 'jgy-cast-actions');

    var uploadLabel = el('label', 'jgy-upload-label', '↑ 导入表情包');
    var file = document.createElement('input');
    file.type = 'file';
    file.accept = 'image/gif,image/png,image/jpeg,image/webp';
    file.multiple = true;
    file.hidden = true;
    uploadLabel.appendChild(file);

    file.addEventListener('change', function () {
      var files = Array.prototype.slice.call(file.files || []);
      files.forEach(function (f) {
        addActor(URL.createObjectURL(f), f.name, 'file');
      });
      file.value = '';
      if (files.length) toast('已导入 ' + files.length + ' 个演员');
    });

    var all = el('button', 'jgy-soft-btn', '全选');
    all.type = 'button';
    all.addEventListener('click', function () {
      state.selectedActorIds = state.actors.map(function (a) { return a.id; });
      renderActors();
    });

    var legacy = el('button', 'jgy-soft-btn', '恢复旧随机');
    legacy.type = 'button';
    legacy.addEventListener('click', function () {
      state.selectedActorIds = [];
      renderActors();
      toast('已恢复旧版随机出演逻辑');
    });

    var clear = el('button', 'jgy-soft-btn', '清空导入');
    clear.type = 'button';
    clear.addEventListener('click', removeImportedActors);

    actions.appendChild(uploadLabel);
    actions.appendChild(all);
    actions.appendChild(legacy);
    actions.appendChild(clear);
    section.appendChild(actions);

    var statusRow = el('div', 'jgy-section-label');
    statusRow.appendChild(el('strong', '', '演员池'));
    var castStatus = el('span', '', '旧版随机模式');
    castStatus.setAttribute('data-jgy-cast-status', '');
    statusRow.appendChild(castStatus);
    section.appendChild(statusRow);

    section.appendChild(el('div', 'jgy-cast-list'));
    return section;
  }

  function buildPluginSection() {
    var section = makeSection('插件 / PLUG-INS', 'DROP-IN EXTENSIONS', 'jgy-plugin-section');
    section.appendChild(el('div', 'jgy-plugin-list'));

    var note = el('div', 'jgy-dev-note');
    note.innerHTML = '开发入口：<code>/plugins/*.js</code> → <code>JGYStudio.registerPlugin(...)</code><br>动作插件无需修改旧 <code>m0~m20</code>。';
    note.style.marginTop = '10px';
    section.appendChild(note);
    return section;
  }

  function pluginApi(plugin) {
    return {
      version: VERSION,
      plugin: plugin,
      stage: q('#jgy-stage') || document.body,
      menu: q('#jgy-menus'),
      toast: toast,
      actors: {
        list: function () { return state.actors.slice(); },
        selected: getSelectedActors,
        addUrl: function (src, name) { return addActor(src, name, 'url'); }
      },
      legacy: {
        run: runLegacy,
        getFunction: function (index) { return window['m' + index]; },
        Jinguanyu: function () { return window.Jinguanyu; },
        OriginalJinguanyu: function () { return studio.LegacyJinguanyu; }
      }
    };
  }

  function renderPlugins() {
    var list = q('.jgy-plugin-list');
    if (!list) return;
    list.innerHTML = '';

    if (!state.plugins.length) {
      list.appendChild(el('div', 'jgy-empty', '没有加载插件。把 JS 放进 /plugins/ 并在 404.html 引入即可。'));
      return;
    }

    state.plugins.forEach(function (plugin) {
      (plugin.actions || []).forEach(function (action) {
        var btn = el('button', 'jgy-plugin-action');
        btn.type = 'button';

        var words = el('div');
        words.appendChild(el('strong', '', action.label || action.id || plugin.name));
        words.appendChild(document.createElement('br'));
        words.appendChild(el('small', '', action.description || plugin.description || '插件动作'));
        btn.appendChild(words);
        btn.appendChild(el('b', '', plugin.name || plugin.id || 'PLUGIN'));

        btn.addEventListener('click', function (evt) {
          try {
            if (typeof action.run === 'function') action.run(pluginApi(plugin), evt);
          } catch (err) {
            console.error('[JGYStudio plugin error]', plugin.id, action.id, err);
            toast('插件执行失败：' + (err && err.message ? err.message : err));
          }
        });
        list.appendChild(btn);
      });
    });
  }

  function registerPlugin(plugin) {
    if (!plugin || !plugin.id) throw new Error('JGYStudio plugin requires a unique id');
    if (state.plugins.some(function (p) { return p.id === plugin.id; })) {
      console.warn('[JGYStudio] duplicated plugin ignored:', plugin.id);
      return;
    }
    state.plugins.push(plugin);
    renderPlugins();
    if (typeof plugin.setup === 'function') plugin.setup(pluginApi(plugin));
  }

  function runLegacy(index) {
    var button = q('.jgy-legacy-command[data-index="' + index + '"]');
    if (button) {
      button.click();
      return true;
    }
    var fn = window['m' + index];
    if (typeof fn === 'function') {
      fn();
      return true;
    }
    toast('旧动作 m' + index + ' 不存在');
    return false;
  }

  studio.registerPlugin = registerPlugin;
  studio.runLegacy = runLegacy;
  studio.toast = toast;
  studio.addActor = function (src, name) { return addActor(src, name, 'url'); };
  studio.getSelectedActors = getSelectedActors;

  function setCookieOpen(value) {
    try {
      document.cookie = 'jgymn_open=' + value + ';domain=' + location.hostname + ';path=/';
    } catch (e) {}
  }

  function syncLauncher(menu, launcher) {
    var hidden = getComputedStyle(menu).display === 'none' || menu.style.display === 'none';
    launcher.style.display = hidden ? 'inline-flex' : 'none';
  }

  function enhanceMenu(menu) {
    if (!menu || menu.dataset.jgyStudioReady === '1') return;
    menu.dataset.jgyStudioReady = '1';
    menu.classList.add('jgy-studio');

    var legacyButtons = qa(':scope > button', menu);
    legacyButtons.forEach(function (button) {
      var index = parseLegacyIndex(button);
      button.classList.add('jgy-legacy-command');
      button.setAttribute('data-index', index);
      button.title = '旧版动作 m' + index + ' · 点击行为未改写';
    });
    legacyButtons.sort(function (a, b) {
      return parseInt(a.dataset.index, 10) - parseInt(b.dataset.index, 10);
    });

    var head = el('header', 'jgy-studio-head');
    var headCopy = el('div');
    headCopy.appendChild(el('div', 'jgy-kicker', 'LIVE / LEGACY CORE ONLINE'));
    headCopy.appendChild(el('div', 'jgy-title', '金馆鱼 · 异常动作实验室'));
    headCopy.appendChild(el('div', 'jgy-subtitle', '十年前的动作内核，套上 2026 的怪东西。m0~m20 原逻辑不重写。'));

    var headActions = el('div', 'jgy-head-actions');
    var close = el('button', 'jgy-icon-btn', '—');
    close.type = 'button';
    close.title = '收起控制台（仍可输入 JGYMN）';
    headActions.appendChild(close);
    head.appendChild(headCopy);
    head.appendChild(headActions);

    var commandSection = makeSection('动作 / ACTIONS', 'LEGACY m0 — m20', 'jgy-command-section');
    var grid = el('div', 'jgy-command-grid');
    legacyButtons.forEach(function (button) { grid.appendChild(button); });
    commandSection.appendChild(grid);

    menu.innerHTML = '';
    menu.appendChild(head);
    menu.appendChild(commandSection);
    menu.appendChild(buildCastSection());
    menu.appendChild(buildPluginSection());

    var launcher = el('button', '', 'JGY');
    launcher.id = 'jgy-launcher';
    launcher.type = 'button';
    launcher.title = '打开金馆鱼控制台';
    document.body.appendChild(launcher);

    close.addEventListener('click', function () {
      menu.style.display = 'none';
      setCookieOpen('no');
      syncLauncher(menu, launcher);
    });
    launcher.addEventListener('click', function () {
      menu.style.display = 'block';
      setCookieOpen('yes');
      syncLauncher(menu, launcher);
    });

    var observer = new MutationObserver(function () { syncLauncher(menu, launcher); });
    observer.observe(menu, { attributes: true, attributeFilter: ['style', 'class'] });
    syncLauncher(menu, launcher);

    renderActors();
    renderPlugins();
  }

  function init() {
    installActorHook();

    var menu = q('#jgy-menus');
    if (menu) {
      enhanceMenu(menu);
      return;
    }

    // 兼容旧脚本被延迟加载的情况。
    var count = 0;
    var timer = setInterval(function () {
      count++;
      installActorHook();
      var later = q('#jgy-menus');
      if (later) {
        clearInterval(timer);
        enhanceMenu(later);
      } else if (count > 100) {
        clearInterval(timer);
        console.warn('[JGYStudio] legacy #jgy-menus not found; UI host not mounted.');
      }
    }, 50);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
