# 我爱学习 · 个人空间 v2

一个点击进入、自由切换独立界面的个人网站。深空底色、薄荷青与冷蓝点缀、旋转线框星球、细网格与终端风格细节。纯 HTML / CSS / JavaScript，无构建步骤，无第三方请求，无后端。

线上地址：https://zkwxd.github.io/

## 页面与交互

入口提供「进入我的世界」按钮及四张页面入口卡片。进入后，通过顶部 / 侧边导航、目录弹窗自由切换页面，不设置章节阅读、序号进度或上一章 / 下一章。切换先轻微上移淡出，再从下方平滑淡入；连续点击会取消旧转场，避免重复显示。

| 地址片段 | 内容 |
| --- | --- |
| `#welcome` | 入口、线框星球、页面卡片 |
| `#about` | 学校 / 学院 / 专业、个人介绍、游戏与偷懒爱好、爱和周哥贴贴 |
| `#algorithm` | 算法学习介绍、可编辑障碍的 BFS 最短路径演示 |
| `#life` | 运动与游戏、快乐摸鱼、和周哥贴贴、可切换的生活节奏 |
| `#lab` | 本站介绍与源码、可点击游玩的开源贪吃蛇与推箱子 |
| `#contact` | GitHub、QQ 邮箱、一键复制、头像预览 |

例如直接打开 `https://zkwxd.github.io/#algorithm` 可以进入算法页面。支持刷新、浏览器前进 / 后退；旧版 `#home`、`#algo`、`#skills`、`#projects`、`#updates` 链接仍可使用。

「伪动态」来自浏览器本地的页面切换、入场动画、Canvas 星球、寻路动画和状态反馈，没有后台管理、数据库或访客信息采集。时钟显示 Asia/Shanghai 的实际时间，不使用虚构的访问量或在线人数。

## 文件

```text
index.html                     所有个人介绍、页面结构、联系方式
css/style.css                  配色、布局、响应式和 CSS 动画
css/arcade.css                 游戏卡片、游戏弹窗与手机布局
js/main.js                     路由、Canvas、BFS、时钟、主题、弹窗
games/                         本地小游戏源码、触屏适配、许可证
assets/avatar.jpg              当前头像
assets/favicon.svg             网页图标
assets/avatar-placeholder.svg  备用头像
```

## 本地预览

直接双击 `index.html` 即可使用，也可在本目录运行：

```sh
python -m http.server 8000 --bind 127.0.0.1
```

然后访问 `http://127.0.0.1:8000/`。邮箱剪贴板功能受浏览器权限限制时，会选中邮箱并提示手动复制。

## 修改内容

- 在 `index.html` 中按页面 ID 定位介绍文字。个人资料使用已提供的事实，没有填入未确认的技术熟练度、刷题成绩或项目经历。
- 替换 `assets/avatar.jpg` 即可更换全部头像；图片完整显示，点击可以放大。
- 联系方式已填为 `https://github.com/zkwxd` 和 `2059913911@qq.com`。
- 新项目可放在 `#lab` 中；现在已放入两款开源游戏，个人题解和更多生活片段仍等待补充。
- 主色在 `css/style.css` 顶部的 `--accent`、`--blue` 等变量中修改。浅色主题使用另一套变量。
- 如需增减页面，同时更新 HTML 导航及 `js/main.js` 中的 `chapters`、`labels`。

## 动效与可访问性

- 右上角可切换深浅主题或暂停视觉动效，选择保存在当前浏览器中。
- 遵循 `prefers-reduced-motion`；减少动态效果时直接显示算法结果，页面内容保持可见。
- 星球限制像素比与绘制频率，切换到其他页面或隐藏标签页后停止绘制。
- 目录与头像采用原生 dialog，支持键盘导航、焦点限制和 Escape 关闭。
- 禁用 JavaScript 时展开全部页面，个人介绍和联系方式仍可阅读。
- 手机使用可横向浏览的页面导航和独立目录，内容按屏幕宽度重排。

## 开源小游戏

实验室中的游戏在本地按需加载，无 CDN、外部字体或远程游戏服务。可以弹窗游玩，也可以单独打开。

| 游戏 | 作者与来源 | 许可 | 操作 |
| --- | --- | --- | --- |
| 贪吃蛇 | [wasay-khanzada/Snake-Game](https://github.com/wasay-khanzada/Snake-Game) | MIT | 方向键 / WASD / 手机滑动 / 触屏按钮 |
| 推箱子 | [straker 的 Basic Sokoban](https://gist.github.com/straker/2fddb507d4bb6bec54ea2fdb022d020c) | CC0 | 方向键 / WASD / 触屏按钮；原版单关卡 |

游戏规则采用下载的固定版本源码；本站增加中文、配色、响应式及输入适配，不宣称游戏为原创。原作者源码入口和署名保留在卡片中，完整来源与改动见 [games/THIRD-PARTY.md](games/THIRD-PARTY.md)。

关闭弹窗会卸载游戏，停止循环，本局进度不保留；推箱子提供重新开始，不提供撤销或关卡选择。隔离嵌入模式下贪吃蛇最高分只在本次游戏会话保留；单独打开且浏览器允许存储时可保存在本地。

## 更新已有 GitHub Pages

仓库：`zkwxd/zkwxd.github.io`，已有发布源为 `main` 分支根目录。

本地检查后，将改动提交并推送：

```sh
git add index.html css js/main.js games assets/favicon.svg README.md
git commit -m "更新个人空间"
git push origin main
```

推送后查看仓库的 Pages 构建结果，完成后访问线上页面确认。
