# 金馆鱼 / Meme Motion Lab — 2026 UI 改造版

这是对旧 `res.miku.us` 金馆鱼表情包动作玩具的 **UI / 扩展层改造**。

核心原则只有一条：**不重写原来的 m0~m20 动作行为。**

## 文件结构

```text
jgy-modernized/
├── 404.html                    # 新入口界面；仍加载旧动作内核
├── res/
│   ├── css/
│   │   └── jgy-studio.css      # 怪异 / 新潮 / 深色实验室视觉
│   └── js/
│       ├── jgy-2nd.js          # 原版旧内核，逐字节保留
│       └── jgy-studio.js       # UI、演员池、插件宿主
└── plugins/
    ├── README.md               # 插件开发说明
    └── example-pulse.js        # 最小示例插件，可删
```

## 部署

你的旧站点本来由 `index.php` 引入 `404.html`，因此无需重写 PHP 路由。

把本包内容覆盖 / 合并到站点 Web Root：

- 替换 `404.html`
- 新增 `res/css/jgy-studio.css`
- 新增 `res/js/jgy-studio.js`
- 新增 `plugins/`
- 包内 `res/js/jgy-2nd.js` 与原仓库版本一致，可直接覆盖，也可以保留你线上已有的同版本文件

本地预览可以在本目录启动任意静态服务器，例如：

```bash
python3 -m http.server 8765
```

然后访问 `http://127.0.0.1:8765/404.html`。

## 哪些行为没有改

`res/js/jgy-2nd.js` 没有做现代化重写，里面的：

- `window.Jinguanyu`
- `m0 ~ m20`
- 原按钮 onclick
- URL hash 自动执行旧命令
- `JGYMN` 键盘开关
- `jgymn_open` cookie
- m14 原“选择法器”逻辑
- m20 原遥控器逻辑

都仍由旧代码负责。

现代 UI 会把原版自动生成的 `#jgy-menus` **原按钮 DOM 直接搬入新面板**，因此不是复制一套“看起来一样”的按钮再模拟旧逻辑。

## 新增：演员池

现在可以：

- 粘贴 GIF / PNG / JPG / WEBP 图片 URL
- 从本机一次导入多个图片 / GIF
- 多选出演演员
- 全选演员
- 一键恢复旧版随机演员逻辑

兼容策略：

- **没有选择自定义演员**：`Jinguanyu` 完全沿用旧随机图片池。
- **选择了自定义演员**：只有在旧动作没有显式指定 `src` 时，才从选中演员中随机选择。
- **旧动作显式传入图片或 DOM**：不覆盖它，保持旧行为。

## 新增插件：最短路径

复制：

```text
plugins/example-pulse.js
```

然后在 `404.html` 最下面加一行：

```html
<script src="plugins/my-plugin.js"></script>
```

插件代码：

```js
window.JGYStudio.registerPlugin({
  id: 'my-plugin',
  name: 'MY PLUGIN',
  actions: [{
    id: 'boom',
    label: '我的动作',
    description: '一句话说明',
    run: function (api) {
      // 可以直接复用旧动作
      api.legacy.run(12);

      // 也可以自己写新玩法
      api.toast('boom');
    }
  }]
});
```

完整接口见 `plugins/README.md`。

## 旧代码的已知时代问题

为了满足“原功能不改变行为”，这里没有擅自修这些历史逻辑：

- m6 源码本身标记有 BUG。
- m10 / m13 / m17 在原代码中本身就是未完成 / 占位状态。
- m20 仍依赖当年的第三方 CDN、`io.yooo.moe:3000` 和部分 `http://` 地址；在现代 HTTPS 浏览器中是否可用，取决于这些旧服务是否还活着及混合内容策略。

这些应该作为后续“兼容修复插件 / v2 内核”单独处理，而不是混进本次 UI 美化导致旧行为悄悄变化。

## 原版内核校验

本包 `res/js/jgy-2nd.js` 对应 GitHub `Ltre/Ltre.res` 的 `master` 版本：

```text
Git blob SHA-1: 04ec3520c5f7a48e943a0bd154d7e89a3050d191
```

用于确认本次没有偷改旧动作内核。
