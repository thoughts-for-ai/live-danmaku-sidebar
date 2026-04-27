# 🎬 直播弹幕侧边栏

> 一款为 Obsidian 设计的写作陪伴插件，将直播弹幕的欢乐带入你的写作过程。

[![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-7C3AED?logo=obsidian)](https://obsidian.md)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![English](https://img.shields.io/badge/English-README-blue.svg)](README.md)

---

## ✨ 这是什么？

看过直播时满屏飞过的热情弹幕吗？**直播弹幕侧边栏**将那种能量带到你在 Obsidian 中的写作工作区。

当你写作时，侧边栏会填满鼓励性的"弹幕"——在你文思泉涌时为你喝彩，在你停下来思考时陪伴你，在你达到字数里程碑时为你庆祝。

### 三种模式，一种体验

| 模式 | 触发时机 | 氛围 |
|------|---------|------|
| **输入（Input）** | 你正在积极打字 | 充满能量、热血沸腾 |
| **停顿（Idle）** | 你暂停思考 | 温柔、鼓励、耐心 |
| **里程碑（Milestone）** | 达到字数目标 | 庆祝、史诗感、成就感 |

所有弹幕内容都从**你创建和自定义的 Markdown 文件**中加载。插件是一块空白画布——你决定你的"观众"说什么。

---

## 🚀 安装

### 方式一：社区插件（推荐 — 即将上线）
1. 打开 **设置 → 社区插件**
2. 搜索 "Live Danmaku Sidebar"
3. 点击 **安装**，然后 **启用**

### 方式二：手动安装
1. 从 [Releases](../../releases) 页面下载最新版本
2. 解压并将文件夹复制到 `.obsidian/plugins/live-danmaku-sidebar/`
3. 重启 Obsidian
4. 前往 **设置 → 社区插件** 并启用 "Live Danmaku Sidebar"

### 方式三：BRAT（测试版）
1. 安装 [BRAT](https://github.com/TfTHacker/obsidian42-brat) 插件
2. 添加本仓库 URL：`https://github.com/thoughts-for-ai/live-danmaku-sidebar`
3. 点击 "Add Plugin"

---

## ⚙️ 使用方法

### 1. 打开侧边栏
点击左侧功能区中的 **直播弹幕** 图标，打开右侧边栏面板。

### 2. 创建你的弹幕库
首次启动时，插件会在你的仓库中自动创建以下文件夹结构：

```
live-danmaku/
├── input/          # 输入时触发的弹幕
├── idle/           # 停顿时触发的弹幕
└── milestones/     # 里程碑弹幕
```

你可以在这些文件夹中添加更多 `.md` 文件，插件会自动读取所有文件。

### 3. 写作并享受
- **打字** → 输入弹幕出现（仅在字数净增长时触发，不是每次按键）
- **停顿**（约5秒）→ 停顿弹幕温柔地陪伴你
- **达到里程碑**（如100、300、600、1000字）→ 特殊里程碑弹幕庆祝你的成就

### 4. 自定义一切
每个 `.md` 文件只是一个行列表——每行一条弹幕。你可以使用纯文本或 Markdown 列表。

**示例 `input.md`：**
```markdown
# 我的写作啦啦队

- 欧拉欧拉欧拉！继续敲击键盘吧！
- 灵感女神今天与你同在！
- 这段写得太燃了！
```

**示例里程碑文件 `100.md`：**
```markdown
# 100字 — 初战告捷！

- 🎉 100字达成！旅程正式开始！
- 第一个里程碑拿下！继续前进！
```

> **里程碑文件名必须以数字开头**（如 `100.md`、`500-庆祝.md`）。数字就是字数阈值。

---

## 🎨 示例主题

需要灵感？以下是一些社区热门主题，你可以直接复制粘贴到弹幕库中：

### 🌟 JOJO的奇妙冒险主题

<details>
<summary>点击展开 — 输入（打字时）弹幕</summary>

创建 `live-danmaku/input/jojo-input.md` 并粘贴：

```markdown
# JOJO输入弹幕

欧拉欧拉欧拉欧拉欧拉欧拉！
木大木大木大木大木大木大木大！
阿里阿里阿里阿里！Arrivederci！
哆啦啦啦啦啦啦啦啦！
WAAAAANNAABEEEEEEE！
我真是High到不行了！
加速！还要再加速！
思绪的速度！这思考的速度！
这是『漆黑的意志』！
完美的回旋！写出了『黄金长方形』的句子！
```
</details>

<details>
<summary>点击展开 — 停顿（思考时）弹幕</summary>

创建 `live-danmaku/idle/jojo-idle.md` 并粘贴：

```markdown
# JOJO停顿弹幕

砸瓦鲁多！（THE WORLD！）时间哟，停止吧！
绯红之王！（King Crimson！）
败者食尘！（Bites the Dust！）
天堂之门！（Heaven's Door！）
但是我拒绝！
真是リアリティ（真实感）啊！
你的下一句台词是……
你看，他又在思考了。
我只想过平静的生活……
Nice！
```
</details>

<details>
<summary>点击展开 — 里程碑弹幕</summary>

创建 `live-danmaku/milestones/100-jojo.md` 并粘贴：

```markdown
# 100字 — JOJO里程碑

我，乔鲁诺·乔巴纳，有一个梦想！
这是我的『觉悟』！
你『成长』了呢！
```

创建 `live-danmaku/milestones/1000-jojo.md` 并粘贴：

```markdown
# 1000字 — JOJO里程碑

Bravo！Oh，Bravo！
人类的赞歌就是勇气的赞歌！人类的伟大就是勇气的伟大！
吾心吾行澄如明镜，所作所为皆为正义！
这是一场必须跨越的『试炼』！
Dojyaaa~~n！
你已经到达了『天堂』！
黄金体验镇魂曲！
真是……太『圆』满了……
Arrivederci！（再会了！）
```
</details>

> 💡 **想要更多主题？** 前往 [Discussions](../../discussions) 页面查看社区创作的主题，或分享你自己的！

---

## 🛠️ 命令

| 命令 | 功能 |
|------|------|
| `Open Live Danmaku Sidebar` | 打开/激活侧边栏 |
| `Reload Live Danmaku Library` | 从磁盘刷新所有弹幕 |
| `Bootstrap Default Danmaku Library` | 恢复缺失的默认模板文件 |

---

## 📝 如何创建你自己的主题

最简单的方法是让 AI 为你生成主题弹幕！以下是一个可用的提示词：

```
你好！我需要你扮演一个充满热情和创意的助手，来为我的写作插件"live-danmaku"设计一套主题弹幕。

任务目标：
根据我指定的主题，为写作过程中的三种不同状态（输入时、停顿时、达成里程碑时）创作一系列弹幕。

技术规范与格式要求（非常重要）：

1. 三大分类：
   - Input（输入时）：当我快速打字时触发。弹幕风格应为：充满能量、节奏感强、鼓励加速、令人振奋。
   - Idle（停顿时）：当我停止打字陷入思考时触发。弹幕风格应为：引人深思、幽默、鼓励、或与"时间""思考"相关的梗。
   - Milestone（里程碑）：当我达到特定字数时触发。弹幕风格应为：史诗感、成就感、庆祝与赞美。

2. 文件结构与命名：
   - input 弹幕应当归于名为 input.md 的文件。
   - idle 弹幕应当归于名为 idle.md 的文件。
   - milestone 弹幕的文件名必须以数字开头，代表触发的字数。例如，为1000字设计的里程碑弹幕，文件名应为 1000.md。

3. 内容格式：
   - 所有弹幕内容都需要生成在Markdown格式的代码块中。
   - 在每个文件中，每行一条弹幕。

我的具体需求如下：
- 主题/作品名称：[在这里填写你想要的主题]
- 各类别弹幕数量：[例如：各类10条]
- 里程碑设置：[例如：1000, 5000, 10000, 50000]
```

---

## 🏗️ 技术栈

- 纯 JavaScript（无 TypeScript，无需构建步骤）
- Obsidian 插件 API
- CSS 硬件加速动画
- 内存会话追踪（字数不持久化存储）

---

## 🤝 参与贡献

### 分享你的主题
有一个超棒的弹幕主题？分享给社区吧！

1. 前往 [Discussions > Show & Tell](../../discussions/c/show-and-tell)
2. 以可复制的代码块形式发布你的主题
3. 我们会将最优秀的主题展示在 README 中

### 报告问题 / 功能建议
提交一个 [Issue](../../issues) 告诉我们！

---

## 📄 许可证

MIT 许可证 — 可自由使用、修改和分发。

---

## 🙏 致谢

- 灵感来源于直播文化的热情能量
- 为需要一点额外鼓励的写作者而用心打造
- JOJO主题示例为粉丝创作的演示内容

---

**祝你写作愉快！** 🎬✍️