# 小游戏来源与适配记录

本站采用作者公开的游戏逻辑，仅做本地接入，不将第三方作品标为个人原创项目。

## Snake Game

- 作者：Abdul Wasay Khan / wasay-khanzada
- 仓库：https://github.com/wasay-khanzada/Snake-Game
- 固定提交：`516a9c20c641ebe2cbe028fe1fbe73e073329dc1`
- 许可证：MIT，完整文本保留于 `snake/LICENSE`
- 来源文件：`index.html`、`script.js`、`style.css`、`README.md`、`LICENSE`
- 本站改动：移除外部字体请求，中文提示，引入共用嵌入样式 / 方向按钮；最高分增加存储不可用时的回退；棋盘填满时结束游戏，避免食物生成陷入死循环。
- 游戏逻辑、棋盘绘制、碰撞检测、计分与触屏滑动来自原作者。
- 嵌入模式中最高分只保存在当前游戏会话；单独打开且浏览器允许存储时保存在本地。

## Basic Sokoban HTML and JavaScript Game

- 作者：Steven Lambert / straker
- 源码：https://gist.github.com/straker/2fddb507d4bb6bec54ea2fdb022d020c
- 固定修订：`1096a4ce0175f9eaf47d1141a467889e82f39b06`
- 许可证：CC0 1.0 Universal，保留作者许可声明于 `sokoban/LICENSE` 和 `sokoban/UPSTREAM-README.md`
- 未修改的原始页面：`sokoban/original.html`
- 本站改动：本地 `index.html` 增加视口设置、中文提示、配色、共用嵌入样式 / 方向按钮 / 重置按钮。
- 关卡、移动、推箱子、绘制、通关判断均来自原作者。这是原版的单关卡演示，不宣称包含关卡选择、撤销或更多关卡。

## 共用适配

`embed.css` 和 `controls.js` 是本站的布局 / 输入适配，不包含重新编写的游戏规则。
两款游戏在带 `allow-scripts` 的 sandbox iframe 中按需加载，不访问主站存储；关闭弹窗会卸载 iframe，停止计时与绘制。
