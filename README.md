# 我爱学习 · 个人主页

纯静态个人主页（HTML / CSS / JS），**无需构建、无外部依赖**，双击 `index.html` 即可预览。

风格：深空蓝黑 + 霓虹青光晕 + 细网格 + 等宽字体标签 + Hero 代码卡片（科技感）。

---

## 目录结构

```
计协/
├── index.html                 ← 页面结构 + 全部文案（要改内容主要改这里）
├── css/style.css              ← 样式与配色
├── js/main.js                 ← 交互（主题、导航、动画、粒子背景、头像放大）
└── assets/
    ├── favicon.svg            ← 网站图标
    ├── avatar.jpg             ← 头像（熊猫代码表情包，点击页面头像可放大）
    └── avatar-placeholder.svg ← 备用占位头像（想换回默认时用）
```

---

## 待补充内容清单

在 `index.html` 里搜索 `✎` 就能找到所有替换点。

| # | 内容 | 当前状态 | 替换位置 |
|---|------|----------|----------|
| 1 | ~~头像~~ | ✅ 已接入 | `assets/avatar.jpg`，点击头像可放大查看 |
| 2 | ~~GitHub 链接~~ | ✅ 已填 | `https://github.com/zkwxd`（3 处链接 + 1 处显示文本） |
| 3 | ~~QQ 邮箱~~ | ✅ 已填 | `2059913911@qq.com`（2 处链接 + 1 处显示文本） |
| 4 | **项目** | ⏳ 3 张示例卡片 | `#projects` 区块：标题 / 简介 / 技术标签 / 源码与演示链接 |
| 5 | **技能栈** | ⏳ 通用占位 | `#skills` 区块的 `chip` 标签 |
| 6 | **刷题平台** | ⏳ 洛谷 / CF / AcWing / LeetCode | `#algo` 区块，改成你的真实主页链接 |
| 7 | **近况** | ⏳ 3 条示例时间线 | `#updates` 区块：日期 / 标题 / 描述 |

已按你提供的信息填好（无需改动除非要调整）：姓名**我爱学习**、沈阳理工大学信息学院电子信息工程、爱好算法与运动、ZKW 的小弟、GitHub **zkwxd**、QQ 邮箱 **2059913911@qq.com**。

---

## 已实现功能

- 侧边栏固定资料卡 + 平滑滚动导航 + 当前章节高亮
- 深色 / 浅色主题切换（记住选择，首次跟随系统）
- 卡片滚动入场动画（支持 `prefers-reduced-motion`）
- 移动端抽屉式导航
- 背景粒子连线动画（页面切后台自动暂停）
- 回到顶部按钮、页脚年份自动更新
- 响应式：1080 / 860 / 520 三档断点

---

## 如何预览与发布

**本地预览**：直接双击 `index.html`；或在该目录运行 `python -m http.server 8000` 后访问 http://localhost:8000 。

**发布到 GitHub Pages（个人主页）**：

目标地址：**https://zkwxd.github.io/**

仓库名必须是 `zkwxd.github.io`（用户同名仓库），这样内容才会挂在个人主页根路径上。

```bash
cd 计协
git init -b main
git add -A
git commit -m "个人主页：初始版本"
gh repo create zkwxd/zkwxd.github.io --public --source=. --push
gh api repos/zkwxd/zkwxd.github.io/pages -X POST \
  -f "source[branch]=main" -f "source[path]=/"
```

完成后等 1～2 分钟，访问 https://zkwxd.github.io/ 。

> 注意：个人主页仓库必须是 **PUBLIC**（免费账号限制）。页面上公开展示了你的 QQ 邮箱，介意的话可以先改成「联系请私信」或去掉邮箱再部署。

---

## 换配色

改 `css/style.css` 开头 `:root` 里的两个值即可换掉整站强调色：

```css
--accent: #2ee6ff;   /* 主强调色 */
--accent-2: #7b6cff; /* 渐变辅色 */
```

参考：粉 `#ff89b5` + 紫 `#8b7dff`、绿 `#22c55e` + 青 `#06b6d4`。
