# 🎬 Live Danmaku Sidebar

> A writing companion plugin for Obsidian that brings the joy of live-streaming danmaku (bullet comments) to your writing process.

[![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-7C3AED?logo=obsidian)](https://obsidian.md)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![中文说明](https://img.shields.io/badge/%E4%B8%AD%E6%96%87-%E8%AF%B4%E6%98%8E-red.svg)](README_CN.md)

---

## ✨ What is this?

Ever watched a live stream and enjoyed the barrage of enthusiastic comments flying across the screen? **Live Danmaku Sidebar** brings that energy to your writing workspace in Obsidian.

As you write, the sidebar fills with encouraging "bullet comments" — cheering you on when you're on a roll, keeping you company when you pause to think, and celebrating your milestones when you hit word-count goals.

### Three Modes, One Experience

| Mode | When it triggers | Vibe |
|------|-----------------|------|
| **Input** | You're actively typing | Energetic, hype, fast-paced |
| **Idle** | You've paused to think | Gentle, encouraging, patient |
| **Milestone** | You hit a word-count goal | Celebratory, epic, rewarding |

All danmaku content is loaded from **Markdown files you create and customize**. The plugin is a blank canvas — you decide what your "audience" says.

---

## 🚀 Installation

### Method 1: Community Plugins (Recommended — coming soon)
1. Open **Settings → Community Plugins**
2. Search for "Live Danmaku Sidebar"
3. Click **Install**, then **Enable**

### Method 2: Manual Installation
1. Download the latest release from the [Releases](../../releases) page
2. Extract and copy the folder to `.obsidian/plugins/live-danmaku-sidebar/`
3. Restart Obsidian
4. Go to **Settings → Community Plugins** and enable "Live Danmaku Sidebar"

### Method 3: BRAT (Beta)
1. Install the [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin
2. Add this repository URL: `https://github.com/thoughts-for-ai/live-danmaku-sidebar`
3. Click "Add Plugin"

---

## ⚙️ How to Use

### 1. Open the Sidebar
Click the **Live Danmaku** icon in the left ribbon bar to open the right sidebar panel.

### 2. Create Your Danmaku Library
On first launch, the plugin auto-creates this folder structure in your vault:

```
live-danmaku/
├── input/          # Danmaku for when you're typing
├── idle/           # Danmaku for when you're paused
└── milestones/     # Danmaku for word-count milestones
```

You can add more `.md` files to any of these folders. The plugin will read them all.

### 3. Write and Enjoy
- **Type** → input danmaku appear (only on net character growth, not every keystroke)
- **Pause** (~5 seconds) → idle danmaku gently keep you company
- **Hit a milestone** (e.g. 100, 300, 600, 1000 words) → special milestone danmaku celebrate your achievement

### 4. Customize Everything
Each `.md` file is just a list of lines — one danmaku per line. You can use plain text or Markdown bullet lists.

**Example `input.md`:**
```markdown
# My Writing Hype Squad

- ORA ORA ORA! Keep punching those keys!
- The muse is with you today!
- This paragraph is fire!
```

**Example milestone file `100.md`:**
```markdown
# 100 Words — First Blood!

- 🎉 100 words down! The journey begins!
- First milestone crushed! Onward!
```

> **Milestone filenames must start with a number** (e.g. `100.md`, `500-celebration.md`). The number is the word-count threshold.

---

## 🎨 Example Themes

Want inspiration? Here are some community-favorite themes you can copy and paste into your danmaku library:

### 🌟 JOJO's Bizarre Adventure Theme

<details>
<summary>Click to expand — Input (typing) danmaku</summary>

Create `live-danmaku/input/jojo-input.md` and paste:

```markdown
# JOJO Input Danmaku

ORA ORA ORA ORA ORA ORA!
MUDA MUDA MUDA MUDA MUDA!
ARI ARI ARI ARI! Arrivederci!
DORARARARARARARA!
WRYYYYYYYYYYYY!
ACCELERATION! WE NEED MORE ACCELERATION!
I'm so HIGH right now!
This must be the work of an enemy stand!
SPEEEEEDWAGOOOON!
The Golden Ratio! This prose has achieved the infinite Spin!
```
</details>

<details>
<summary>Click to expand — Idle (paused) danmaku</summary>

Create `live-danmaku/idle/jojo-idle.md` and paste:

```markdown
# JOJO Idle Danmaku

ZA WARUDO! TOKI WO TOMARE!
KING CRIMSON! It just works.
KIRA QUEEN! BITES THE DUST!
HEAVEN'S DOOR!
But I refuse.
This feels so... REAL!
Your next line is...
NIGERUNDAYO!
Chew. What a beautiful Duwang.
```
</details>

<details>
<summary>Click to expand — Milestone danmaku</summary>

Create `live-danmaku/milestones/100-jojo.md` and paste:

```markdown
# 100 Words — JOJO Milestone

NIIIICE!
I, the writer, have a dream!
You've truly 'grown'.
```

Create `live-danmaku/milestones/1000-jojo.md` and paste:

```markdown
# 1000 Words — JOJO Milestone

Oh? You're approaching me?
I can't write the hell out of this story without getting closer.
BRAVO! OH, BRAVO!
The human spirit is the spirit of praise!
Dojyaaa~~n!
You have finally arrived at 'Heaven'.
GOLDEN EXPERIENCE REQUIEM!
It's truly been... a roundabout path...
[<==TO BE CONTINUED]
```
</details>

> 💡 **Want more themes?** Check out the [Discussions](../../discussions) tab to see what the community has created, or share your own!

---

## 🛠️ Commands

| Command | Action |
|---------|--------|
| `Open Live Danmaku Sidebar` | Open/activate the sidebar |
| `Reload Live Danmaku Library` | Refresh all danmaku from disk |
| `Bootstrap Default Danmaku Library` | Restore missing default template files |

---

## 📝 How to Create Your Own Theme

The easiest way is to ask an AI to generate themed danmaku for you! Here's a prompt you can use:

```
I need you to design a themed danmaku set for my Obsidian plugin "live-danmaku".

The plugin has three categories:
- **input/**: Energetic, hype comments for when I'm actively typing
- **idle/**: Gentle, encouraging comments for when I've paused to think
- **milestones/**: Epic, celebratory comments when I hit word-count goals

Format: One danmaku per line, in Markdown code blocks.
Milestone filenames must start with a number (e.g., 100.md, 500.md).

Theme: [YOUR THEME HERE, e.g., "Harry Potter", "Dark Souls", "Cyberpunk 2077"]
Number of danmaku per category: [e.g., 10 each]
Milestone thresholds: [e.g., 100, 500, 1000, 5000]

Please generate the content creatively!
```

---

## 🏗️ Tech Stack

- Pure JavaScript (no TypeScript, no build step)
- Obsidian Plugin API
- CSS animations with hardware acceleration
- In-memory session tracking (no persistent storage for word counts)

---

## 🤝 Contributing

### Share Your Theme
Have an awesome danmaku theme? Share it with the community!

1. Go to [Discussions > Show & Tell](../../discussions/c/show-and-tell)
2. Post your theme with copy-pasteable code blocks
3. We'll feature the best ones in this README

### Report Bugs / Request Features
Open an [Issue](../../issues) and let us know!

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Credits

- Inspired by the energy of live-streaming culture
- Built with passion for writers who need a little extra encouragement
- JOJO theme examples are fan-created content for demonstration purposes

---

**Happy writing!** 🎬✍️
