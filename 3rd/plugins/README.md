# JGY 插件开发入口

最简单的新增功能方式：

1. 复制 `example-pulse.js`，例如改名为 `my-action.js`。
2. 修改插件的 `id`、`name` 和 `actions`。
3. 在根目录 `404.html` 的插件区增加：

```html
<script src="/plugins/my-action.js"></script>
```

最小插件：

```js
window.JGYStudio.registerPlugin({
  id: 'my-plugin',
  name: 'MY PLUGIN',
  actions: [{
    id: 'hello',
    label: 'Hello',
    description: '我的新动作',
    run: function (api) {
      api.toast('hello');
    }
  }]
});
```

`run(api)` 中常用接口：

- `api.legacy.run(12)`：触发原版 `m12`，行为仍由旧代码负责。
- `api.legacy.getFunction(12)`：取得原版 `m12` 函数。
- `api.legacy.Jinguanyu()`：取得当前 Jinguanyu 构造器。
- `api.legacy.OriginalJinguanyu()`：取得未包装的旧构造器。
- `api.actors.selected()`：读取当前选择出演的演员。
- `api.actors.addUrl(url, name)`：把一个图片 URL 加入演员池。
- `api.stage`：舞台 DOM。
- `api.menu`：现代控制台 DOM（仍然是原来的 `#jgy-menus`）。
- `api.toast(text)`：显示短提示。

## 设计原则

旧版 `res/js/jgy-2nd.js` 是动作内核。除非你明确要修旧行为，否则不要在里面加 UI 或插件逻辑。新能力优先作为独立插件注册，这样几十个动作以后仍然容易维护。
