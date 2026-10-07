/**
 * 示例插件：仪式脉冲
 * ==================
 * 复制本文件改 id / name / actions 即可新增插件。
 * 不需要修改 jgy-studio.js，也不需要修改旧版 m0~m20。
 */
(function () {
  'use strict';

  window.JGYStudio.registerPlugin({
    id: 'example-pulse',
    name: 'EXAMPLE',
    description: '最小插件样例，可直接复制改造或删除。',

    actions: [
      {
        id: 'ritual-pulse',
        label: '仪式脉冲',
        description: '只做一层舞台视觉脉冲，不碰旧动作内核。',
        run: function (api) {
          var pulse = document.createElement('div');
          pulse.className = 'jgy-stage-pulse';
          document.body.appendChild(pulse);
          setTimeout(function () { pulse.remove(); }, 650);
          api.toast('PLUGIN / 仪式脉冲');
        }
      }
    ]
  });
})();
